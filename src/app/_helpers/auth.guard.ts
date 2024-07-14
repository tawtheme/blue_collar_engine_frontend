import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Role } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { DashboardService } from '@app/_services/admin-panel/dashboard/dashboard.service';
import { OnboardPopupComponent } from '@app/admin-panel/dashboard/onboard-popup/onboard-popup.component';
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    onBoardStatus: any;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private _jwtHelperService: JwtHelperService,
        private _snackBar: MatSnackBar,
        private _dashboardService: DashboardService,
        private _dialog: MatDialog
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;
        //////console.log(state.url)
        if (this._jwtHelperService.isTokenExpired(user?.data.token!)) {
            this._snackBar.open("Session has been expired", 'Close');
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        if (user) {
            //debugger
            const { roles } = route.data;
            if (roles && !roles.includes(user.data.role)) {
                this.router.navigate(['/unauthorized'], { queryParams: { returnUrl: state.url } });
                return false;
            }
            if (roles.includes(Role.Admin.toString())) {
                this.getOnBoardStats(state.url);
            }
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    getOnBoardStats(stateUrl: any) {
        this._dashboardService.GetOnBoardStatus()
            .subscribe({
                next: (res: { data: any[]; }) => {
                    this.onBoardStatus = res.data;
                    //console.log(this.onBoardStatus)
                    if ((!this.onBoardStatus.isServiceAdded || !this.onBoardStatus.isStripeKeysAdded || !this.onBoardStatus.isTaxAdded || !this.onBoardStatus.isTeamMemberAdded) && (stateUrl != '/admin/price-book' && stateUrl != '/admin/account-setting')) {
                        this._dialog.open(OnboardPopupComponent, { width: '900px', height: '600px', data: { 'onBoardStatus': this.onBoardStatus, isEnableEdit: false }, disableClose: true })
                    }

                },
                error: error => {
                }
            });
    }
}