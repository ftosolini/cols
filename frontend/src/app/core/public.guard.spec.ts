import { TestBed } from '@angular/core/testing'
import { ActivatedRoute, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { AuthService } from 'src/app/auth/auth.service'
import { publicGuard } from 'src/app/core/public.guard'

describe('publicGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => publicGuard(...guardParameters))

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: { isLogged: () => false } },
                { provide: ActivatedRoute, useValue: { snapshot: {} } },
            ],
            imports: [RouterTestingModule],
        })
    })

    test('should return true if user is not logged', () => {
        const activatedRoute = TestBed.inject(ActivatedRoute)
        expect(executeGuard(activatedRoute.snapshot, {} as RouterStateSnapshot)).toBe(true)
    })

    test('should call router.navigateByUrl if user is logged', () => {
        const authService = TestBed.inject(AuthService)
        const router = TestBed.inject(Router)
        const activatedRoute = TestBed.inject(ActivatedRoute)
        const isLoggedSpy = jest.spyOn(authService, 'isLogged').mockReturnValue(true)
        const routerSpy = jest.spyOn(router, 'navigateByUrl')
        executeGuard(activatedRoute.snapshot, {} as RouterStateSnapshot)
        expect(isLoggedSpy).toHaveBeenCalled()
        expect(routerSpy).toHaveBeenCalledWith('/map')
    })
})
