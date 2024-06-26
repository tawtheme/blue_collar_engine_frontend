import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const user = this.authenticationService.userValue;
        const tenant = this.authenticationService.tenantTokenValue;
        const isLoggedIn = user?.data.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            if (request.headers.get('skip') == 'true') {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${user.data.token}`
                    }
                });
            }
            else {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${user.data.token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        }
        return next.handle(request);
    }
}