import { Component, inject } from '@angular/core';
import { IndexedDbService } from '../../../shared/indexedDB/services/db-service/indexed-db.service';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { MetadataEntry } from '../../../shared/interfaces/metadata-entry.interface';
import { JsonHandlerService } from '../../../data-input/services/json-reader/json-reader.service';

@Component({
  selector: 'app-top-list',
  templateUrl: './top-list.component.html',
  styleUrl: './top-list.component.scss'
})
export class TopListComponent {
  private indexedDBService = inject(IndexedDbService);
  private jsonHandlerService = inject(JsonHandlerService);
  private router = inject(Router);

  public entries$: Observable<MetadataEntry[]> = this.indexedDBService.allEntries$.pipe(tap((entries) => {
    if (!entries || !entries.length) {
      this.router.navigate(['/']);
    }
  }))

  public dataSource$ = this.entries$;

  public years$ = this.jsonHandlerService.years$;

  public filterBy(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'All time') {
      this.dataSource$ = this.entries$;
    } else {
      this.dataSource$ = this.jsonHandlerService.getEntriesByYear(+value);
    }
  }
}
