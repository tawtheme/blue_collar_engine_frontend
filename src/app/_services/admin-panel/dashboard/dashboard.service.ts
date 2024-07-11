import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getTopTechnician(userId: any = '') {
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

  getDashboardGraphStats(dashboardGraphStatInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/GetDashboardGraphStats`, dashboardGraphStatInfo)
      .pipe(map(res => {
        return res;
      }));
  }

  getDashboardPieChartStats(dashboardGraphStatInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/GetDashboardPieChartStats`, dashboardGraphStatInfo)
      .pipe(map(res => {
        return res;
      }));
  }
  getDashboardStats() {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Tenant/GetDashboardStats`)
      .pipe(map(res => {
        return res;
      }));
  }

  GetOnBoardStatus() {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Tenant/GetOnBoardStatus`)
      .pipe(map(res => {
        return res;
      }));
  }
}
