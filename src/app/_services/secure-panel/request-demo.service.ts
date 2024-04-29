import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestDemoService {

  constructor() { }

  //   getDemoRequested() {
  //     let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  //     return this.http.post<any>(`${environment.apiUrl}/api/v1/Account/Login`, JSON.stringify(_params),{ headers: reqHeaders })
  //         .pipe(map(user => {
  //             //console.log(JSON.stringify(user))
  //             // store user details and jwt token in local storage to keep user logged in between page refreshes
  //             localStorage.setItem('user', JSON.stringify(user));
  //             this.userSubject.next(user);
  //             return user;
  //         }));
  // }
}
