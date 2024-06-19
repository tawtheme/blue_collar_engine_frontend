import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountSettingService {
  public tenantAddressAdded: Subject<boolean>;
  constructor(private http: HttpClient) {
    this.tenantAddressAdded = new Subject<boolean>();
  }
  getProfileInfo() {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Tenant/Get`)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  updateProfile(profielInfo: any) {
    const httpOptions = {
      headers: new HttpHeaders().set('skip', 'true')
    };
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/UpdateProfile`, profielInfo, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  addTenantAddress(addessInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/AddUpdateAddress`, addessInfo)
      .pipe(map(res => {
        return res;
      }));
  }

  getTenantAddresses(PaginationModel: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/GetAllAddress`, PaginationModel)
      .pipe(map(res => {
        return res;
      }));
  }

  getTenantAddressById(addressId: number) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Tenant/GetAddress?addressId=` + addressId)
      .pipe(map(res => {
        return res;
      }));
  }

  getAllTax() {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Tenant/GetAllTaxes`)
      .pipe(map(res => {
        return res;
      }));
  }

  getTax(type: any) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Tenant/GetTax?taxName=` + type)
      .pipe(map(res => {
        return res;
      }));
  }

  addTenantTax(taxInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/AddUpdateTax`, taxInfo)
      .pipe(map(res => {
        return res;
      }));
  }

  changePassword(changePasswordInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Account/ChangePassword`, changePasswordInfo)
      .pipe(map(res => {
        return res;
      }));
  }
}
