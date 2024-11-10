import { Component, inject } from '@angular/core';
import { IndexedDbService } from '../../../shared/indexedDB/services/db-service/indexed-db.service';

@Component({
  selector: 'app-data-output',
  templateUrl: './data-output.component.html',
  styleUrl: './data-output.component.scss'
})
export class DataOutputComponent {
  private indexedDBService = inject(IndexedDbService);

  public async clearData() {
    await this.indexedDBService.removeAllData();
    window.location.reload();
  }
}
