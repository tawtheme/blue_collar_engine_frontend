import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private _snackBar: MatSnackBar) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let error: any;
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && this.authenticationService.userValue) {
                this.authenticationService.logout();
                if (err.status == 401) {
                    this._snackBar.open("Unauthorized access",'Close');
                }
                else {
                    this._snackBar.open("Session has been expired",'Close');
                }
                return throwError(() => error);
            }
            else if (err.status == 400) {
                error = err.error.message || err.error.data;
            }
            else {
                error = err.error.message || err.error.data || err.statusText;
            }
            this._snackBar.open(error,'Close');
            return throwError(() => error);
        }))
    }
}