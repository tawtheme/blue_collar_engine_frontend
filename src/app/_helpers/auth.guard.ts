import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@app/_services';
import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastrService } from 'ngx-toastr';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private _jwtHelperService: JwtHelperService,
        private _snackBar: MatSnackBar
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;
       // //debugger
        if (this._jwtHelperService.isTokenExpired(user?.data.token!)) {
            this._snackBar.open("Session has been expired");
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        ////console.log(user?.data.role)
        if (user) {
            const { roles } = route.data;
            ////debugger
            if (roles && !roles.includes(user.data.role)) {
                // role not authorized so redirect to home page
                //this.router.navigate(['/']);
                this.router.navigate(['/unauthorized'], { queryParams: { returnUrl: state.url } });
                return false;
            }

            // authorized so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}