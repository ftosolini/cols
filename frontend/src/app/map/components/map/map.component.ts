import { AfterViewInit, Component, ViewChild } from '@angular/core'
import * as L from 'leaflet'
import { GeoJSON } from 'leaflet'
import { map } from 'rxjs'
import { Climb, Col } from 'src/app/map/components/col'
import { Feature } from 'src/app/map/components/geojson.model'
import { MapService } from 'src/app/map/map.service'
import { LayoutComponent } from 'src/app/shared/components/layout/layout.component'

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
    @ViewChild('layout') layout!: LayoutComponent
    map?: L.Map
    selectedFeature?: Feature<Col>
    constructor(public mapService: MapService) {}

    ngAfterViewInit(): void {
        this.map = L.map('map').setView([46.469524, 2.433], 6)
        const tilePath = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

        L.tileLayer(tilePath, {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map)

        this.loadCols().subscribe((cols) => {
            const layer = this.createGeoJsonLayer(cols)
            layer.addTo(this.map as L.Map)
            this.handleGeoJsonClick(layer)
        })
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    createGeoJsonLayer(cols: GeoJSON.Feature<GeoJSON.Point, any>[]) {
        return L.geoJson(cols, {
            pointToLayer: (feature, latLng) => {
                return L.circleMarker(latLng, {
                    color: 'red',
                    fillOpacity: 0.8,
                    /* c8 ignore next: not needed */
                    radius: L.Browser.mobile ? 15 : 3,
                })
            },
        })
    }

    handleGeoJsonClick(layer: L.Layer) {
        layer.on('click', async (event) => {
            this.selectedFeature = event.propagatedFrom.feature
            await this.layout.toggleRightPanel(true)
        })
    }

    loadCols() {
        return this.mapService
            .loadFeatures(-90, -180, 90, 180)
            .pipe(map((geoJson) => geoJson.features))
    }

    getColColor(feature: Feature<Col>) {
        const climbs = feature.properties.climbs
        if (climbs.every((climb: Climb) => climb.done)) return 'green'
        if (climbs.some((climb: Climb) => climb.done)) return 'yellow'
        return 'red'
    }
}
