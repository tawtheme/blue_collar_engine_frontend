import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }
  getAll(PaginationModel: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Invoice/GetAll`, JSON.stringify(PaginationModel))
      .pipe(map(res => {
        return res;
      }));
  }

  create(estimateData: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Invoice/CreateInvoice`, JSON.stringify(estimateData))
      .pipe(map(res => {
        return res;
      }));
  }

  get(invoiceId: number) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Invoice/Get?invoiceId=` + invoiceId)
      .pipe(map(res => {
        return res;
      }));
  }

  getStats() {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Invoice/GetStats`)
      .pipe(map(res => {
        return res;
      }));
  }
}
