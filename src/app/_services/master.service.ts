import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }

  getNoOFEmployee() {   
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Master/GetNoOfEmployees`)
      .pipe(map(res => {
        return res;
      }));
  }

  getIndustries() {   
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Master/GetIndustries`)
      .pipe(map(res => {
        return res;
      }));
  }

  getHearAboutUs() {   
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Master/GetHearAboutUs`)
      .pipe(map(res => {
        return res;
      }));
  }

  getTimeZones() {   
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Master/GetTimeZones`)
      .pipe(map(res => {
        return res;
      }));
  }

  getStates() {   
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Master/GetStates`)
      .pipe(map(res => {
        return res;
      }));
  }
}
