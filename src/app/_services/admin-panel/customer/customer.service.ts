import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  addUpdate(customerInfo: any) {
    let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
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
}
