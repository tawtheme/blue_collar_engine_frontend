import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, first, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractorAuthGuard implements CanActivate {
  baseUrlHostname: any = environment.baseUrlHostName;
  private tenantSubject: BehaviorSubject<any | null>;
  public tenant: Observable<any | null>;
  user: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.tenantSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('tenant')!));
    this.tenant = this.tenantSubject.asObservable();
    this.user = <User>this.authenticationService.userValue;
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
              this.authenticationService.login(result.data.emailAddress, environment.tenantToken).subscribe(
                (response) => {
                  res(true);
                });
            } else {
              this.router.navigate(['/unauthorized'], { queryParams: { returnUrl: state.url } });
              res(false);
            }
          },
          (error) => {
            this.router.navigate(['/unauthorized'], { queryParams: { returnUrl: state.url } });
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
