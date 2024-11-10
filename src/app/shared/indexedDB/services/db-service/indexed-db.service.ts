import { Injectable, inject } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map } from 'rxjs';
import { MetadataEntry } from '../../../interfaces/metadata-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbService = inject(NgxIndexedDBService);

  public allEntries$ = this.getAllEntries().pipe(map(
    (res) => {
      return res[0] as MetadataEntry[];
    }
  ));

  bulkAddEntries(entries: any[]) {
    return this.dbService.add('metadata', entries)
  }

  getAllEntries() {
    return this.dbService.getAll('metadata');
  }

  clearAllEntries() {
    return this.dbService.clear('metadata');
  }

  setEarliestDate(date: Date) {
    return this.dbService.add('earliestDate', date);
  }

  getEarliestDate() {
    return this.dbService.getAll('earliestDate');
  }

  async removeAllData() {
    window.caches.keys().then(function (names) {
      for (let name of names)
        window.caches.delete(name);
    });

    const dbs = await window.indexedDB.databases()
    dbs.forEach(db => { window.indexedDB.deleteDatabase(db.name as string) })

    window.localStorage.clear();
    window.sessionStorage.clear();
  }

}
