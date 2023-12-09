import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { firstValueFrom, of } from 'rxjs'
import { ConfigService } from 'src/app/core/config.service'

describe('ConfigService', () => {
    let service: ConfigService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        })
        service = TestBed.inject(ConfigService)
    })

    test('should be created', () => {
        expect(service).toBeTruthy()
    })

    describe('load', () => {
        test('should redirect to the home page', async () => {
            const redirectUrl = 'example.com'
            const httpClient = TestBed.inject(HttpClient)
            const getSpy = jest.spyOn(httpClient, 'get').mockReturnValue(of({ redirectUrl }))
            Object.defineProperty(window, 'location', {
                value: {
                    href: '',
                    hostname: 'www.example.com',
                },
            })
            await firstValueFrom(service.getAppConfig())
            expect(getSpy).toHaveBeenCalled()
            expect(window.location.href).toBe(redirectUrl)
        })

        test('should set the config', async () => {
            const httpClient = TestBed.inject(HttpClient)
            const getSpy = jest
                .spyOn(httpClient, 'get')
                .mockReturnValue(
                    of({ name: 'test', subdomain: 'test', id: 'test', logo: 'logo.ico' })
                )

            const mockIcon = document.createElement('link')
            mockIcon.setAttribute('id', 'app-icon')
            mockIcon.setAttribute('href', 'favicon.ico')

            await firstValueFrom(service.getAppConfig())
            expect(getSpy).toHaveBeenCalled()
            expect(service.isLoaded).toBe(true)
            expect(service.getName()).toBe('test')
            expect(service.getIcon()).toBe('logo.ico')
            expect(service.getAppId()).toBe('test')
            expect(document.title).toBe('test')
        })
    })
})
