import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FeatureInfoComponent } from 'src/app/map/components/feature-info/feature-info.component'

describe('FeatureInfoComponent', () => {
    let component: FeatureInfoComponent
    let fixture: ComponentFixture<FeatureInfoComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeatureInfoComponent],
        })
        fixture = TestBed.createComponent(FeatureInfoComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    test('should create', () => {
        expect(component).toBeTruthy()
    })
})
