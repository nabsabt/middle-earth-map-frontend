import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable()
export class MapRootService {
  constructor(private http: HttpClient) {}

  public getTestResult(params: {}): Observable<{ result: string }> {
    return this.http.get<{ result: string }>(`${environment.apiURL}/api/test`);
  }
}
