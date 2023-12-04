import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/auth/auth.service'
import { ConfigService } from 'src/app/core/config.service'

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent {
    isLabelHidden = true
    constructor(
        public configService: ConfigService,
        private authService: AuthService,
        private router: Router
    ) {}

    async logout() {
        console.log('logout')
        this.authService.logout()
        await this.router.navigateByUrl('/login')
    }
}
