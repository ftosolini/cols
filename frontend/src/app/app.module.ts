import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { APP_INITIALIZER, NgModule } from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { firstValueFrom } from 'rxjs'
import { AppRoutingModule } from 'src/app/app-routing.module'
import { AppComponent } from 'src/app/app.component'
import { AuthModule } from 'src/app/auth/auth.module'
import { ConfigService } from 'src/app/core/config.service'
import { HeaderInterceptor } from 'src/app/core/header.interceptor'
import { MapModule } from 'src/app/map/map.module'
import { SharedModule } from 'src/app/shared/shared.module'

function initializeAppFactory(configService: ConfigService): () => Promise<void> {
    return () => firstValueFrom(configService.getAppConfig())
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        AuthModule,
        SharedModule,
        MapModule,
        MatProgressSpinnerModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeAppFactory,
            deps: [ConfigService],
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeaderInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
