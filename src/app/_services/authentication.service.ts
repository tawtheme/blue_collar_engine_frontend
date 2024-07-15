import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    private tenantSubject: BehaviorSubject<any | null>;    
    public tenant: Observable<any | null>;

    private tenantTokenSubject: BehaviorSubject<any | null>;
    public tenantToken: Observable<any | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();

        this.tenantSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('tenant')!));
        this.tenant = this.tenantSubject.asObservable();


        this.tenantTokenSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('tenantToken')!));
        this.tenantToken = this.tenantSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    public get tenantValue() {
        return this.tenantSubject.value;
    }

    public get tenantTokenValue() {
        return this.tenantTokenSubject.value;
    }

    login(username: string, password: string) {
        var _params = {
            'username': username,
            'password': password
        };
        let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<any>(`${environment.apiUrl}/api/v1/Account/Login`, JSON.stringify(_params), { headers: reqHeaders })
            .pipe(map(user => {
                ////////////console.log(JSON.stringify(user))
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    forgetPassword(email: string) {
        var _params = {
            'emailAddress': email
        };
        let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<any>(`${environment.apiUrl}/api/v1/Account/ForgetPassword`, JSON.stringify(_params), { headers: reqHeaders })
            .pipe(map(res => {
                return res;
            }));
    }

    resetPassword(resetPassword: any) {
        let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<any>(`${environment.apiUrl}/api/v1/Account/ResetPassword`, JSON.stringify(resetPassword), { headers: reqHeaders })
            .pipe(map(res => {
                return res;
            }));
    }

    getTenant(subdomain: any) {
        return this.http.get<any>(`${environment.apiUrl}/api/v1/Account/GetTenant?subdomain=` + subdomain)
            .pipe(map(res => {
                return res;
            }));
    }

    generateOTP(generateOTP: any) {
        return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/GenerateOTP`, generateOTP)
            .pipe(map(res => {
                return res;
            }));
    }

    verifyOTP(verifyOTP: any) {
        return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/VerifyOTP`, verifyOTP)
            .pipe(map(res => {
                return res;
            }));
    }

    authTenant(username: string, password: string) {
        var _params = {
            'username': username,
            'password': password
        };
        let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<any>(`${environment.apiUrl}/api/v1/Account/Login`, JSON.stringify(_params), { headers: reqHeaders })
            .pipe(map(tenant => {
                ////////////console.log(JSON.stringify(user))
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('tenantToken', JSON.stringify(tenant));
                this.tenantTokenSubject.next(tenant);
                return tenant;
            }));
    }
}