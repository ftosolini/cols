import { AfterViewChecked, Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import * as L from 'leaflet'
import { map } from 'rxjs'
import { Climb, Col } from 'src/app/map/components/col'
import { Feature } from 'src/app/map/components/geojson.model'
import { MapService } from 'src/app/map/map.service'

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewChecked {
    map?: L.Map
    selectedFeature?: Feature<Col>
    private lng = 2.433
    private lat = 46.469524
    private zoom = 6
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public mapService: MapService
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            if (params['lat'] && params['lng']) {
                this.lat = +params['lat']
                this.lng = +params['lng']
                this.zoom = 10
                this.map?.setView([this.lat, this.lng], this.zoom)
            }
        })
    }

    ngAfterViewChecked(): void {
        if (!this.map && document.getElementById('map')) {
            this.map = L.map('map')
            const tilePath = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

            L.tileLayer(tilePath, {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(this.map)
            this.map.setView([this.lat, this.lng], this.zoom)
            this.loadCols().subscribe((cols) => {
                const layer = this.createGeoJsonLayer(cols)
                layer.addTo(this.map as L.Map)
                this.handleGeoJsonClick(layer)
            })
        }
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
            // open the side panel
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
