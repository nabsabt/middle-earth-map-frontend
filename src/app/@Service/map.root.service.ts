import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { SearchResults } from '../@Interface/maproot.interface';

@Injectable()
export class MapRootService {
  constructor(private http: HttpClient) {}

  public getSearchResults(params: { input: string; lang: string }): Observable<SearchResults[]> {
    return this.http.get<SearchResults[]>(`${environment.apiURL}/api/getSearchResults`, { params });
  }
}
