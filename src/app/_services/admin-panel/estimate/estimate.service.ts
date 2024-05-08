import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstimateService {

  constructor(private http: HttpClient) { }

  getAll(PaginationModel: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Estimate/GetAll`, JSON.stringify(PaginationModel))
      .pipe(map(res => {
        return res;
      }));
  }

  create(estimateData: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Estimate/CreateEstimate`, JSON.stringify(estimateData))
      .pipe(map(res => {
        return res;
      }));
  }

  get(estimateId: number) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Estimate/Get?estimateId=` + estimateId)
      .pipe(map(res => {
        return res;
      }));
  }
}
