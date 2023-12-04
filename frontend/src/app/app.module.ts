import { APP_INITIALIZER, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from 'src/app/app-routing.module'
import { AppComponent } from 'src/app/app.component'
import { AuthModule } from 'src/app/auth/auth.module'
import { ConfigService } from 'src/app/core/config.service'
import { MapModule } from 'src/app/map/map.module'
import { SharedModule } from 'src/app/shared/shared.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        AuthModule,
        SharedModule,
        MapModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (configService: ConfigService) => () => configService.getAppConfig(),
            deps: [ConfigService],
            multi: true
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
