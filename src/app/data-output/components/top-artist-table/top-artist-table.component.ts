import { Component, inject } from '@angular/core';
import { JsonHandlerService } from '../../../data-input/services/json-reader/json-reader.service';

@Component({
  selector: 'app-top-artist-table',
  templateUrl: './top-artist-table.component.html',
  styleUrl: './top-artist-table.component.scss'
})
export class TopArtistTableComponent {
  private jsonHandlerService = inject(JsonHandlerService);
  
  public topArtists$ = this.jsonHandlerService.topArtists$;
}
