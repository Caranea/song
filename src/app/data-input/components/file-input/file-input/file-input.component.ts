import { Component, inject } from '@angular/core';
import { JsonHandlerService } from '../../../services/json-reader/json-reader.service';
import { HistoryEntry } from '../../../../shared/interfaces/history-entry.interface';
import { IndexedDbService } from '../../../../shared/indexedDB/services/db-service/indexed-db.service';
import { Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.scss'
})
export class FileInputComponent {
  private JsonHandlerService = inject(JsonHandlerService);
  private indexedDBService = inject(IndexedDbService);
  private router = inject(Router);

  public fileName = '';
  public progress$ = this.JsonHandlerService.progress$.pipe(map((progress) => Math.round(progress)));
  public preparingData$ = this.JsonHandlerService.preparingData$;

  constructor() {
    combineLatest([
      this.indexedDBService.getAllEntries(),
      this.progress$
    ]).subscribe(combinedOutput => {
      if (combinedOutput[0].length > 0 || combinedOutput[1] === 100) {
        this.router.navigate(['/results']);
      }
    })
  }


  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (!fileInput.files) {
      return;
    }

    const file: File = fileInput.files[0];

    if (file) {
      this.fileName = file.name;
      this.JsonHandlerService.readJsonFile(file).then((res) => {
        res = (res as HistoryEntry[]).filter((entry: HistoryEntry) => entry.titleUrl);
        this.JsonHandlerService.batchHandleEntries(
          this.JsonHandlerService.reduceHistoryEntriesAndFindEarliestDate((res as HistoryEntry[]))
        );
      }).catch((error) => {
        alert('Error reading file: ' + error);
      });
    }
  }
}
