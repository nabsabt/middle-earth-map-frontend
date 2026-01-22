import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GISObject, SearchResults } from '../@Interface/maproot.interface';
import { FeatureCollection } from 'geojson';

@Injectable()
export class MapRootService {
  constructor() {}
  private http = inject(HttpClient);

  public getSearchResults(params: {
    input: string;
  }): Observable<SearchResults[] | { message: string }> {
    return this.http.get<SearchResults[]>(`${environment.apiURL}/api/getSearchResults`, { params });
  }

  public getGISObject(gisID: number): Observable<GISObject> {
    return this.http.get<GISObject>(`${environment.apiURL}/api/getGISObject`, {
      params: { gisID: gisID },
    });
  }

  public getGeoJSONS(): Observable<{
    areas: FeatureCollection;
    paths: FeatureCollection;
    places: FeatureCollection;
  }> {
    return this.http.get<{
      areas: FeatureCollection;
      paths: FeatureCollection;
      places: FeatureCollection;
    }>(`${environment.apiURL}/api/getGeoJSONS`);
  }
}
