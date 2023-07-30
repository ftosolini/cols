import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Col } from 'src/app/map/components/col'
import { GeoJson } from 'src/app/map/components/geojson.model'

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private httpClient: HttpClient) {}

  loadCols(name: string) {
    return this.httpClient.get<GeoJson<Col>>(`assets/data/${name}.json`)
  }
}
