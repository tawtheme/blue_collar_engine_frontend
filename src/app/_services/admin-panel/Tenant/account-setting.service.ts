import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountSettingService {
  public tenantAddressAdded: Subject<boolean>;
  public tenentProfileInfo: Subject<any>;
  public userAdded: Subject<boolean>;
  constructor(private http: HttpClient) {
    this.tenantAddressAdded = new Subject<boolean>();
    this.tenentProfileInfo = new Subject<any>();
    this.userAdded = new Subject<boolean>();
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

  setAsDefaultAddress(addressInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/SetAsDefaultAddress`, addressInfo)
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

  getBusinessHoursDays() {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Tenant/GetBusinessHourDays`)
      .pipe(map(res => {
        return res;
      }));
  }

  addUpdateBusinessHours(businessHoursInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/AddUpdateBusinessHours`, businessHoursInfo)
      .pipe(map(res => {
        return res;
      }));
  }

  deleteBusinesshour(businessHourId: any) {
    let httpParams = new HttpParams().set('businessHourId', businessHourId);
    let options = { params: httpParams };
    return this.http.delete<any>(`${environment.apiUrl}/api/v1/Tenant/DeleteBusinessHour`, options)
      .pipe(map(res => {
        return res;
      }));
  }

  addUpdateStripeConfiguration(stripeConfigurationInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/AddUpdateStripeConfiguration`, stripeConfigurationInfo)
      .pipe(map(res => {
        return res;
      }));
  }

  getStripeConfiguration() {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Tenant/GetStripeConfiguration`)
      .pipe(map(res => {
        return res;
      }));
  }

  getAllUsers(PaginationModel: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/GetAllUsers`, PaginationModel)
      .pipe(map(res => {
        return res;
      }));
  }

  addUpdateUser(userInfo: any) {
    const httpOptions = {
      headers: new HttpHeaders().set('skip', 'true')
    };
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/AddUpdateUser`, userInfo, httpOptions)
      .pipe(map(res => {
        return res;
      }));
  }

  getTenant(userId: any) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Account/GetTenant?subdomain=&userId=` + userId)
      .pipe(map(res => {
        return res;
      }));
  }

  addUpdateTermsConditions(termConditionInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Tenant/AddUpdateTermsConditions`, termConditionInfo)
      .pipe(map(res => {
        return res;
      }));
  }

  getTermsConditions(type: any) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Tenant/GetTermsConditions?type=` + type)
      .pipe(map(res => {
        return res;
      }));
  }
}
