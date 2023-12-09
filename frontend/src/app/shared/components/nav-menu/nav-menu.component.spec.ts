import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatListModule } from '@angular/material/list'
import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { AuthModule } from 'src/app/auth/auth.module'
import { AuthService } from 'src/app/auth/auth.service'

import { NavMenuComponent } from 'src/app/shared/components/nav-menu/nav-menu.component'

describe('NavMenuComponent', () => {
    let component: NavMenuComponent
    let fixture: ComponentFixture<NavMenuComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NavMenuComponent],
            imports: [AuthModule, MatListModule, RouterTestingModule, HttpClientTestingModule],
            providers: [{ provide: AuthService, useValue: { isLogged: () => false } }],
        })
        fixture = TestBed.createComponent(NavMenuComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    test('should create', () => {
        expect(component).toBeTruthy()
    })

    describe('logout', () => {
        test('should call logout', () => {
            const authService = TestBed.inject(AuthService)
            const router = TestBed.inject(Router)
            authService.logout = jest.fn()
            router.navigateByUrl = jest.fn()
            component.logout()
            expect(authService.logout).toHaveBeenCalled()
            expect(router.navigateByUrl).toHaveBeenCalledWith('/login')
        })
    })
})
