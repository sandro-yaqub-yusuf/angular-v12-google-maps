import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HelpService {
  private helpFilePath = './assets/files/help.md';

  constructor(private http: HttpClient) {}

  getHelpContent(): Observable<string> {
    return this.http.get(this.helpFilePath, { responseType: 'text' });
  }
}
