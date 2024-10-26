import { Component, inject } from '@angular/core';
import { JsonHandlerService } from '../../../data-input/services/json-reader/json-reader.service';
import { combineLatest, map } from 'rxjs';
import { MetadataEntry } from '../../../shared/interfaces/metadata-entry.interface';
import { IndexedDbService } from '../../../shared/indexedDB/services/db-service/indexed-db.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-nostalgic-throwbacks',
  templateUrl: './nostalgic-throwbacks.component.html',
  styleUrl: './nostalgic-throwbacks.component.scss'
})
export class NostalgicThrowbacksComponent {
  private jsonHandlerService = inject(JsonHandlerService);
  private indexedDBService = inject(IndexedDbService);
  private sanitizer = inject(DomSanitizer)
  
  public years$ = this.jsonHandlerService.years$.pipe(
    map(years => years.slice(0, -1))
  );
  public throwbacks: MetadataEntry[] = [];
  public currentThrowback = 0;

  constructor() {
    this.years$.subscribe((years) => {
      this.getThrowbacks(years[0]);
    })
  }

  // Let's get throwbacks from a specific year
  // First, we get top entries from a specific year
  // Then, we check if the watchDatestamps of each entry contain no dates from a period that is half of the total history period from now
  // If the list is empty, we shorten the period recursively
  // Until the shortest period is half a year- if by this time we still have no throwbacks, we return an empty list
  public getThrowbacks(year: number) {
    combineLatest([
      this.years$,
      this.jsonHandlerService.getEntriesByYear(year),
      this.indexedDBService.allEntries$
    ]).pipe(
      map(([years, entries, allEntries]) => {
        let throwbacks: MetadataEntry[] = []
        let timeFraction = 2
        let cutoffDate = new Date(new Date().setFullYear(new Date().getFullYear() - years.length / timeFraction));
        const sixMonthsInMilliseconds = 1000 * 60 * 60 * 24 * 30 * 6;

        while (throwbacks.length === 0 && (new Date().getTime() - cutoffDate.getTime()) > sixMonthsInMilliseconds) {
          throwbacks = entries.filter((entry) => {
            return allEntries.find((allEntry) => {
              return allEntry.id === entry.id;
            })?.watchDatestamps?.every((watchDatestamp) => {
              const date = new Date(watchDatestamp);
              return date < cutoffDate;
            })
          });
          timeFraction += 2;
          cutoffDate = new Date(new Date().setFullYear(new Date().getFullYear() - years.length / timeFraction));
        }
        this.throwbacks = throwbacks;
        this.currentThrowback = 0;
      })
    ).subscribe();
  }

  public nextThrowback() {
    this.currentThrowback = this.currentThrowback + 1 < this.throwbacks.length ? this.currentThrowback + 1 : 0;
  }

  public previousThrowback() {
    this.currentThrowback = this.currentThrowback - 1 >= 0 ? this.currentThrowback - 1 : this.throwbacks.length - 1;
  }

  photoURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  filterBy(event: Event) {
    const year = (event.target as HTMLSelectElement).value;
    this.getThrowbacks(+year);
  }
}
