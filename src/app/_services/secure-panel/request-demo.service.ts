import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestDemoService {
  public subDomainAdded: Subject<boolean>;
  constructor(private http: HttpClient) {
    this.subDomainAdded = new Subject<boolean>();
   }

  getDemoRequested(params:any) {   
    return this.http.post<any>(`${environment.apiUrl}/api/v1/RequestDemo/GetAll`, params)
      .pipe(map(res => {
        return res;
      }));
  }

  saveRequestDemo(requestInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/RequestDemo/Save`, requestInfo)
      .pipe(map(res => {
        return res;
      }));
  }

  convertToTenant(requestInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/ConvertToTenant`, requestInfo)
      .pipe(map(res => {
        return res;
      }));
  }
}
