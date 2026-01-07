import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class MapRootService {
  constructor(private http: HttpClient) {}
}
