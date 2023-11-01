import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from 'src/app/app.component'

describe('AppComponent', () => {
    let component: AppComponent
    let fixture: ComponentFixture<AppComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [RouterTestingModule],
        }).compileComponents()
        fixture = TestBed.createComponent(AppComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    test('should create the app', () => {
        expect(component).toBeTruthy()
    })

    test(`should have as title 'cols'`, () => {
        expect(component.title).toEqual('cols')
    })
})
