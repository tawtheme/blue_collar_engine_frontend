import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  public categoryAdded: Subject<boolean>;
  public categoryServiceAdded: Subject<number>;
  public editCategory: Subject<number>;
  public bindAddress: Subject<any>;
  constructor(private http: HttpClient) {
    this.categoryAdded = new Subject<boolean>();
    this.categoryServiceAdded = new Subject<number>();
    this.editCategory = new Subject<number>();
    this.bindAddress = new Subject<any>();
  }

  addUpdate(categoryInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Category/AddUpdate`, categoryInfo)
      .pipe(map(res => {
        return res;
      }));
  }

  getAll(paginationModel: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Category/GetAll`, paginationModel)
      .pipe(map(res => {
        return res;
      }));
  }
  get(categoryId: number) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Category/Get?categoryId=` + categoryId)
      .pipe(map(res => {
        return res;
      }));
  }

  addUpdateService(categoryServiceInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/CategoryService/AddUpdate`, JSON.stringify(categoryServiceInfo))
      .pipe(map(res => {
        return res;
      }));
  }

  getAllServices(paginationModel: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/CategoryService/GetAll`, paginationModel)
      .pipe(map(res => {
        return res;
      }));
  }
  getService(serviceId: number) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/CategoryService/Get?categoryServiceId=` + serviceId)
      .pipe(map(res => {
        return res;
      }));
  }
}
