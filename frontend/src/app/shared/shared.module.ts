import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { AuthModule } from 'src/app/auth/auth.module'
import { LayoutComponent } from 'src/app/shared/components/layout/layout.component'
import { NavMenuComponent } from 'src/app/shared/components/nav-menu/nav-menu.component'

@NgModule({
    declarations: [LayoutComponent, NavMenuComponent],
    exports: [LayoutComponent],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        AuthModule,
    ],
})
export class SharedModule {}
