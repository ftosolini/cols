import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'

export type AppConfig = {
    name: string
    subdomain: string
    id?: string
    logo?: string
}

export type ConfigResponse = AppConfig & { redirectUrl?: string }

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private config: AppConfig = {
        name: 'FT-Map',
        subdomain: 'ft-map',
    }
    isLoaded = false
    constructor(private http: HttpClient) {}

    getAppConfig(): Observable<void> {
        const subdomain = window.location.hostname.split('.')[0]
        return this.http.get<ConfigResponse>(`/api/client/${subdomain}`).pipe(
            map((config) => {
                if (config.redirectUrl) {
                    window.location.href = config.redirectUrl
                } else {
                    document.title = config.name
                    /* c8 ignore next 2*/
                    config.logo = config.logo || 'https://www.letour.fr/img/global/logo.png'
                    document.querySelector('#app-icon')?.setAttribute('href', config.logo)
                    this.config = config
                    this.isLoaded = true
                }
            })
        )
    }

    getIcon(): string {
        return this.config.logo ?? 'favicon.ico'
    }

    getName(): string {
        return this.config.name
    }

    getAppId(): string | undefined {
        return this.config.id
    }
}
