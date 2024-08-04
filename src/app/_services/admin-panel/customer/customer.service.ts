import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  public customerAdded: Subject<boolean>;
  public customerDetailAdded: Subject<number>;
  public customerAddNewTrigger: Subject<boolean>;
  public bindAddress: Subject<any>;
  constructor(private http: HttpClient) {
    this.customerAdded = new Subject<boolean>();
    this.customerDetailAdded = new Subject<number>();
    this.customerAddNewTrigger = new Subject<boolean>();
    this.bindAddress = new Subject<any>();
  }

  addUpdate(customerInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Customer/AddUpdate`, JSON.stringify(customerInfo))
      .pipe(map(res => {
        return res;
      }));
  }

  getAll(PaginationModel: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Customer/GetAll`, JSON.stringify(PaginationModel))
      .pipe(map(res => {
        return res;
      }));
  }
  get(customerId: number) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Customer/Get?customerId=` + customerId)
      .pipe(map(res => {
        return res;
      }));
  }

  findCustomerByMobileNo(mobileNo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Customer/FindCustomerByMobileNo?mobileNo=` + mobileNo, null)
      .pipe(map(res => {
        return res;
      }));
  }

  addUpdateAddress(addressInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Customer/AddUpdateAddress`, JSON.stringify(addressInfo))
      .pipe(map(res => {
        return res;
      }));
  }

  getAllAddress(PaginationModel: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Customer/GetAllAddress`, JSON.stringify(PaginationModel))
      .pipe(map(res => {
        return res;
      }));
  }

  getCustomerStats(customerId: number) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Customer/GetCustomerStats?customerId=` + customerId)
      .pipe(map(res => {
        return res;
      }));
  }

}
