import { TestBed } from '@angular/core/testing'
import { ActivatedRoute, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router'
import { AuthService } from 'src/app/auth/auth.service'
import { privateGuard } from 'src/app/core/private.guard'

describe('privateGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => privateGuard(...guardParameters))

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: { isLogged: () => false } },
                { provide: ActivatedRoute, useValue: { snapshot: {} } },
            ],
        })
    })

    test('should return true if user is logged', () => {
        const activatedRoute = TestBed.inject(ActivatedRoute)
        const authService = TestBed.inject(AuthService)
        const isLoggedSpy = jest.spyOn(authService, 'isLogged').mockReturnValue(true)
        expect(executeGuard(activatedRoute.snapshot, {} as RouterStateSnapshot)).toBe(true)
        expect(isLoggedSpy).toHaveBeenCalled()
    })

    test('should call router.navigateByUrl if user is not logged', () => {
        const authService = TestBed.inject(AuthService)
        const router = TestBed.inject(Router)
        const activatedRoute = TestBed.inject(ActivatedRoute)
        const isLoggedSpy = jest.spyOn(authService, 'isLogged').mockReturnValue(false)
        const routerSpy = jest.spyOn(router, 'navigateByUrl')
        executeGuard(activatedRoute.snapshot, {} as RouterStateSnapshot)
        expect(isLoggedSpy).toHaveBeenCalled()
        expect(routerSpy).toHaveBeenCalledWith('/login')
    })
})
