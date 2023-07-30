import { Component, Input } from '@angular/core';
import { Col } from 'src/app/map/components/col'
import { Feature } from 'src/app/map/components/geojson.model'

@Component({
  selector: 'app-feature-info',
  templateUrl: './feature-info.component.html',
  styleUrls: ['./feature-info.component.css']
})
export class FeatureInfoComponent {
  @Input()feature?: Feature<Col>
}
