﻿import { Injectable } from '@angular/core';
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

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        var _params = {
            'username': username,
            'password': password
        };
        let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<any>(`${environment.apiUrl}/api/v1/Account/Login`, JSON.stringify(_params), { headers: reqHeaders })
            .pipe(map(user => {
                //console.log(JSON.stringify(user))
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
}