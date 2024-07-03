import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getTopTechnician(userId: any='') {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Tenant/GetTopTechnician?userId=` + userId)
      .pipe(map(res => {
        return res;
      }));
  }

  getTopServices() {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Tenant/GetTopServices`)
      .pipe(map(res => {
        return res;
      }));
  }
}
