import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

const dbConfig: DBConfig = {
  name: 'songDB',
  version: 1,
  objectStoresMeta: [{
    store: 'metadata',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'title', keypath: 'title', options: { unique: false } },
      { name: 'titleUrl', keypath: 'titleUrl', options: { unique: false } },
      { name: 'occurrenceCount', keypath: 'occurrenceCount', options: { unique: false } },
      { name: 'watchDatestamps', keypath: 'watchDatestamps', options: { unique: false } },
      { name: 'metadata', keypath: 'metadata', options: { unique: false } },
      { name: 'id', keypath: 'id', options: { unique: true } },
    ]
  }, {
    store: 'earliestDate',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'date', keypath: 'date', options: { unique: false } }
    ]
  }]
};


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxIndexedDBModule.forRoot(dbConfig)
  ]
})
export class IndexedDbModule { }
