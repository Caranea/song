import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class V3ApiService {
  apiKey: string = 'AIzaSyAMcpf4KFCmft0kggCGKDiUZ_D3Lr7M10s'; //restricted api key

  constructor(public http: HttpClient) { }

  getVideosMetadata(videosIds: string[], maxResults?: string): Observable<Object> {
    let url = `https://youtube.googleapis.com/youtube/v3/videos?part=topicDetails,snippet&id=${videosIds}&key=`+this.apiKey;
    return this.http.get(url);
  }
}
