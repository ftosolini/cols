import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from 'src/app/core/config.service'

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
    constructor(private configService: ConfigService) {}

    /* eslint-disable @typescript-eslint/no-explicit-any */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const appId = this.configService.getAppId()

        const appReq = req.clone({
            headers: req.headers.set('x-client-id', appId ?? ''),
        })
        return next.handle(appReq)
    }
}
