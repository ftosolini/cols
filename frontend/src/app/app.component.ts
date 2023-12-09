import { Component } from '@angular/core'
import { ConfigService } from 'src/app/core/config.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    constructor(private configService: ConfigService) {}

    isLoaded(): boolean {
        return this.configService.isLoaded
    }
}
