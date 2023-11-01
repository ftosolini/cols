import { TestBed } from '@angular/core/testing'
import { AuthService } from 'src/app/auth/auth.service'

describe('AuthService', () => {
    let service: AuthService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(AuthService)
    })

    test('should be created', () => {
        expect(service).toBeTruthy()
        expect(service.isLogged()).toBeTruthy()
    })

    test('should logout', () => {
        service.logout()
        expect(service.isLogged()).toBeFalsy()
    })

    test('should loging', () => {
        service.logout()
        expect(service.isLogged()).toBeFalsy()
        service.login('username', 'fakePassword')
        expect(service.isLogged()).toBeTruthy()
    })
})
