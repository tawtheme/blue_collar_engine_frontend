import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, first, tap } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class ContractorAuthGuard implements CanActivate {
  baseUrlHostname: any = environment.baseUrlHostName;
  private tenantSubject: BehaviorSubject<any | null>;
  public tenant: Observable<any | null>;

  private tenantTokenSubject: BehaviorSubject<any | null>;
  public tenantToken: Observable<any | null>;
  user: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private _jwtHelperService: JwtHelperService
  ) {
    this.tenantSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('tenant')!));
    this.tenant = this.tenantSubject.asObservable();
    this.user = <User>this.authenticationService.userValue;

    this.tenantTokenSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('tenantToken')!));
    this.tenantToken = this.tenantTokenSubject.asObservable();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let getLink = window.location.href;
    const { hostname } = new URL(getLink);
    var subdomain = hostname.split(".")[0];
    if (subdomain != this.baseUrlHostname) {
      return new Promise(res => {
        this.authenticationService.getTenant(subdomain).subscribe(
          (result) => {
            if (result.message === 'Success') {
              localStorage.setItem('tenant', JSON.stringify(result.data));
              this.tenantSubject.next(result.data);
              var _tenantInfo = <any>this.authenticationService.tenantValue;
             // //console.log(_tenantInfo)
              const user = this.authenticationService.userValue;
              if (user?.data.tenantInfo.subDomainName == subdomain) {
                if (this._jwtHelperService.isTokenExpired(user?.data.token!)) {
                  this.authenticationService.login(result.data.emailAddress, environment.tenantToken).subscribe(
                    (response) => {
                      res(true);
                    });
                }
                else {
                  res(true);
                }
              }
              else {
                this.authenticationService.login(result.data.emailAddress, environment.tenantToken).subscribe(
                  (response) => {
                    res(true);
                  });
              }

            } else {
              this.router.navigate(['/unauthorized'], { queryParams: { returnUrl: '/booking/online-form' } });
              res(false);
            }
          },
          (error) => {
            this.router.navigate(['/unauthorized'], { queryParams: { returnUrl: '/booking/online-form' } });
            res(false);
          }
        );
      });
    }
    else {
      this.router.navigate(['/unauthorized'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
