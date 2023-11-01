import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { AuthService } from 'src/app/auth/auth.service'

import { LoginComponent } from 'src/app/auth/components/login/login.component'

describe('LoginComponent', () => {
    let component: LoginComponent
    let fixture: ComponentFixture<LoginComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                MatButtonModule,
                MatFormFieldModule,
                MatInputModule,
                NoopAnimationsModule,
                ReactiveFormsModule,
                RouterTestingModule,
            ],
        })
        fixture = TestBed.createComponent(LoginComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    test('should create', () => {
        expect(component).toBeTruthy()
    })

    describe('login', () => {
        test('should call authService.login', () => {
            const authService = TestBed.inject(AuthService)
            const router = TestBed.inject(Router)
            router.navigateByUrl = jest.fn()
            authService.login = jest.fn()
            const loginSpy = jest.spyOn(authService, 'login')
            const routerSpy = jest.spyOn(router, 'navigateByUrl')
            component.login()
            expect(loginSpy).toHaveBeenCalled()
            expect(routerSpy).toHaveBeenCalledWith('/map')
        })
    })
})
