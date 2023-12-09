import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { GeoJSON } from 'leaflet'
import { Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class MapService {
    constructor(private httpClient: HttpClient) {}

    loadFeatures(
        minLatitude: number,
        minLongitude: number,
        maxLatitude: number,
        maxLongitude: number
        /* eslint-disable @typescript-eslint/no-explicit-any */
    ): Observable<GeoJSON.FeatureCollection<GeoJSON.Point, any>> {
        return this.httpClient.post<GeoJSON.FeatureCollection<GeoJSON.Point, any>>(
            `/api/map/geojson`,
            {
                minLatitude,
                minLongitude,
                maxLatitude,
                maxLongitude,
            }
        )
    }
}
