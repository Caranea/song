import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'song';
  constructor(private titleService: Title, private metaService: Meta) {
    this.setSEOData(
      'Song: Youtube Watch History Analyzer',
      'Song is an app that allows you to view your YouTube listening history in a more user-friendly way, and provides and overview of your music taste.'
    );
  }

  setSEOData(title: string, description: string) {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
  }
}
