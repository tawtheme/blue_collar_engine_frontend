import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private _toastrService: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let error: any;
        return next.handle(request).pipe(catchError(err => {
            debugger
            if ([401, 403].includes(err.status) && this.authenticationService.userValue) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                this.authenticationService.logout();
                if (err.status == 401) {
                    this._toastrService.error("Unauthorized access", "Error");
                }
                else {
                    this._toastrService.error("Session has been expired", "Error");
                }
                return throwError(() => error);
            }
            else if (err.status == 400) {
                error = err.error.data;
            }
            else {
                error = err.error.message || err.statusText;
            }
            this._toastrService.error(error, "Error");
            return throwError(() => error);
        }))
    }
}