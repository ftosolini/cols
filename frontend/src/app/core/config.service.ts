import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'

export interface AppConfig {
    name: string;
    subdomain: string;
    appId?: string;
    logo?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: AppConfig = {
        name: 'FT-Map',
        subdomain: 'ft-map',
    }
    constructor(private http: HttpClient) {}

    getAppConfig(): Observable<void> {
        const subdomain = window.location.hostname.split('.')[0];
        return this.http.get<AppConfig>(`/api/client/${subdomain}`).pipe(
            map((config) => {
                config.logo = 'https://www.letour.fr/img/global/logo.png'
                document.title = config.name
                document.querySelector('#app-icon')?.setAttribute('href', config.logo)
                this.config = config
            })
        );
    }

    getIcon(): string {
        return this.config.logo ?? 'favicon.ico'
    }

    getName(): string {
        return this.config.name
    }
}
