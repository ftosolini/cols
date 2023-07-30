import * as L from 'leaflet';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { map } from 'rxjs'
import { Col } from 'src/app/map/components/col'
import { Feature } from 'src/app/map/components/geojson.model'
import { MapService } from 'src/app/map/map.service'
import { LayoutComponent } from 'src/app/shared/components/layout/layout.component'

const MAX_CATEGORY = 2

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('layout') layout!: LayoutComponent
  private map?: L.Map
  private collection: any
  selectedFeature?: Feature<Col>
  constructor(private mapService: MapService) {
    this.collection ={
      "type": "FeatureCollection",
      "features": [
      ]
    }
  }

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([46.469524, 2.433], 6);
    const tilePath = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

    L.tileLayer(tilePath, {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.loadCols().subscribe(cols => {
      L.geoJson(cols  ,{
        pointToLayer: (feature,latlng) => {
          return L.circleMarker(latlng, {
            radius: L.Browser.mobile ? 15 : 3,
            color: this.getColColor(feature),
            fillOpacity:0.8 });
        },
      }).addTo(this.map as L.Map).on('click', async (event) => {
        console.log(event.propagatedFrom)
        this.selectedFeature = event.propagatedFrom.feature
        await this.layout.toggleRightPanel(true)
      });
    })


  }

  loadCols() {
    return this.mapService.loadCols('pyerenees-est').pipe(
      map(geoJson => geoJson.features = geoJson.features.filter(feat => feat.properties.climbs.some((climb: any) => climb.category < MAX_CATEGORY)))
    )
  }

  private getColColor(feature: any) {
    const climbs = feature.properties.climbs
    if (climbs.every((climb: any) => climb.done)) return 'green'
    if (climbs.some((climb: any) => climb.done)) return 'yellow'
    return 'red'
  }

}
