import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { LayoutComponent } from 'src/app/shared/components/layout/layout.component'
import { NavMenuComponent } from 'src/app/shared/components/nav-menu/nav-menu.component'

describe('LayoutComponent', () => {
    let component: LayoutComponent
    let fixture: ComponentFixture<LayoutComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LayoutComponent, NavMenuComponent],
            imports: [MatSidenavModule, MatListModule, NoopAnimationsModule, RouterTestingModule],
        })
        fixture = TestBed.createComponent(LayoutComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    test('should create', () => {
        expect(component).toBeTruthy()
    })

    describe('toggleRightPanel', () => {
        test('should toggle the right panel', () => {
            component.rightMenu.toggle = jest.fn()
            component.toggleRightPanel()
            expect(component.rightMenu.toggle).toHaveBeenCalled()
        })
    })
})
