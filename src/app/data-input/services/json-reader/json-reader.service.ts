import { Injectable, inject } from '@angular/core';
import { HistoryEntry, ReducedHistoryEntry } from '../../../shared/interfaces/history-entry.interface';
import { V3ApiService } from '../../../shared/youtube-api/services/v3-api/v3-api.service';
import { BehaviorSubject, Observable, concat, map } from 'rxjs';
import { MetadataEntry } from '../../../shared/interfaces/metadata-entry.interface';
import { IndexedDbService } from '../../../shared/indexedDB/services/db-service/indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class JsonHandlerService {
  public progress$ = new BehaviorSubject(0);
  public preparingData$ = new BehaviorSubject(false);

  private youtubeApiService = inject(V3ApiService);
  private indexedDBService = inject(IndexedDbService);

  public years$ = this.indexedDBService.getEarliestDate().pipe(map((res) => {
    const date = res[0] as Date;
    const years = [];
    if (date) {
      for (let i = date.getFullYear(); i <= new Date().getFullYear(); i++) {
        years.push(i);
      }
    }
    return years;
  }));

  public topArtists$ = this.indexedDBService.allEntries$.pipe(map((entries) => {
    const topArtists: {
      artist: string;
      songs: number;
      cumulativeListens: number;
    }[] = [];

    entries.forEach((entry) => {
      const artist = entry.metadata?.snippet?.tags?.[0];
      if (!artist) {
        return;
      }
      const listens = entry.occurrenceCount;
      const topArtist = topArtists.find((topArtist) => topArtist.artist.toLowerCase().trim() === artist.toLowerCase().trim());
      if (topArtist) {
        topArtist.cumulativeListens += listens;
        topArtist.songs++
      } else {
        topArtists.push({
          artist: artist,
          songs: 1,
          cumulativeListens: listens,
        });
      }
    });
    return topArtists.sort((a, b) => b.cumulativeListens - a.cumulativeListens);
  }
  ));

  public topArtistsByYear(year: number): Observable<{
    artist: string;
    cumulativeListens: number;
  }[]> {
    return this.getEntriesByYear(year).pipe(map((entries) => {
      const topArtists: {
        artist: string;
        cumulativeListens: number;
      }[] = [];
      entries.forEach((entry) => {
        const artist = entry.metadata?.snippet?.tags?.[0];
        if (!artist) {
          return;
        }
        const listens = entry.occurrenceCount;
        const topArtist = topArtists.find((topArtist) => topArtist.artist.toLowerCase().trim() === artist.toLowerCase().trim());
        if (topArtist) {
          topArtist.cumulativeListens += listens;
        } else {
          topArtists.push({
            artist: artist,
            cumulativeListens: listens,
          });
        }
      });
      return topArtists.sort((a, b) => b.cumulativeListens - a.cumulativeListens);
    }));
  }

  public readJsonFile(file: File): Promise<string | unknown> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const result = JSON.parse(reader.result as string);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file, 'UTF-8');
    });
  }

  public reduceHistoryEntriesAndFindEarliestDate(entries: HistoryEntry[]): ReducedHistoryEntry[] {
    const reducedEntries: ReducedHistoryEntry[] = [];
    let date = new Date();
    for (let i = 0; i < entries.length; i++) {
      if (new Date(entries[i].time) < date) {
        date = new Date(entries[i].time);
      }

      const reducedEntry = reducedEntries.find(reducedEntry => reducedEntry.titleUrl === entries[i].titleUrl);
      if (reducedEntry) {
        reducedEntry.occurrenceCount++;
        reducedEntry.watchDatestamps.push(entries[i].time);
      } else {
        reducedEntries.push({
          ...entries[i],
          id: entries[i].titleUrl.split('?v=')[1],
          occurrenceCount: 1,
          watchDatestamps: [entries[i].time],
        });
      }
    }
    this.indexedDBService.setEarliestDate(date).subscribe();
    return reducedEntries.sort((a, b) => b.occurrenceCount - a.occurrenceCount);
  }

  public batchHandleEntries(entries: ReducedHistoryEntry[]): void {
    this.indexedDBService.clearAllEntries().subscribe(() => {
      const entriesMetadata: Partial<MetadataEntry>[] = [];
      const observables: Observable<any>[] = [];
      let batchIndex = 1;

      this.preparingData$.next(true);
      for (let i = 0; i < entries.length; i += 50) {
        const videosIds = entries.slice(i, i + 50).map(entry => {
          return entry.id;
        });
        const observable = this.getVideosMetadata(videosIds);
        observables.push(observable);
      }

      this.preparingData$.next(false);

      concat(...observables).subscribe((res) => {
        for (let entryMetadata of res.items.filter((item: { snippet: { categoryId: string; }; }) => item.snippet?.categoryId === '10')) {
          const entry = entries.find(entry => entry.id === entryMetadata.id);
          entriesMetadata.push({
            ...entry,
            metadata: entryMetadata,
          });
        }

        this.progress$.next(batchIndex / observables.length * 100);
        batchIndex++
        if (batchIndex > observables.length) {
          this.indexedDBService.bulkAddEntries(entriesMetadata.map(entry => this.removeArtistFromTitle(entry))
            .map(entry => this.removeParenthesesFromTitle(entry))).subscribe()
        }
      })
    });
  }

  public getEntriesByYear(year: number): Observable<MetadataEntry[]> {
    return this.indexedDBService.allEntries$.pipe(
      map((entries) => {
        let filteredEntries = entries.flatMap((entry) => {
          if (entry.watchDatestamps) {
            const filteredWatchDatestamps = entry.watchDatestamps.filter((watchDatestamp) => {
              return new Date(watchDatestamp).getFullYear() === year;
            })
            if (filteredWatchDatestamps.length) {
              return [{
                ...entry,
                watchDatestamps: filteredWatchDatestamps,
                occurrenceCount: filteredWatchDatestamps.length,
              }];
            } else {
              return [];
            }
          } else {
            return [];
          }
        }).sort((a, b) => b.occurrenceCount - a.occurrenceCount);
        return filteredEntries;
      })
    );
  }

  public getVideosMetadata(videosIds: string[]): Observable<any> {
    return this.youtubeApiService.getVideosMetadata(videosIds)
  }

  private removeArtistFromTitle(entry: Partial<MetadataEntry>): Partial<MetadataEntry> {
    const artist = entry.metadata?.snippet?.tags?.[0];
    const title = entry.metadata?.snippet?.title;
    if (entry.metadata && title && title.includes(artist + ' - ')) {
      entry.metadata.snippet.title = title.replace(artist + ' - ', '');
    }
    return entry;
  }

  private removeParenthesesFromTitle(entry: Partial<MetadataEntry>): Partial<MetadataEntry> {
    const title = entry.metadata?.snippet?.title;
    if (entry.metadata && title && title.includes('(')) {
      entry.metadata.snippet.title = title.replace(/\([^()]*\)/, '');
    }
    return entry;
  }
}

