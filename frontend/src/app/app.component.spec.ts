import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from 'src/app/app.component'
import { ConfigService } from 'src/app/core/config.service'

describe('AppComponent', () => {
    let component: AppComponent
    let fixture: ComponentFixture<AppComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [
                {
                    provide: ConfigService,
                    useValue: {
                        isLoaded: true,
                    },
                },
            ],
            imports: [RouterTestingModule],
        }).compileComponents()
        fixture = TestBed.createComponent(AppComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    test('should create the app', () => {
        expect(component).toBeTruthy()
    })

    describe(`isLoaded'`, () => {
        test('should return true when config is loaded', () => {
            expect(component.isLoaded()).toBeTruthy()
        })

        test('should return false when config is not loaded', () => {
            TestBed.inject(ConfigService).isLoaded = false
            expect(component.isLoaded()).toBeFalsy()
        })
    })
})
