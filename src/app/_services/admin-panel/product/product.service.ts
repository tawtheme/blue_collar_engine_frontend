import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Product/Get`)
      .pipe(map(res => {
        return res;
      }));
  }

  get(productId: number) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Product/GetInfo?productId=` + productId)
      .pipe(map(res => {
        return res;
      }));
  }

}
