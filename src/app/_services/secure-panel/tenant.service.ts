import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor(private http: HttpClient) { }

  convertToTenant(requestInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/ConvertToTenant`, requestInfo)
      .pipe(map(res => {
        return res;
      }));
  }

  getBusinesshours() {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Tenant/GetBusinessHours`)
      .pipe(map(res => {
        return res;
      }));
  }
}
