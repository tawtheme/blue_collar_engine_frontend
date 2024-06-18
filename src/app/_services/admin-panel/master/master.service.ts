import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }

  // get(type: any) {
  //   return this.http.get<any>(`${environment.apiUrl}/api/v1/Master/GetTax?taxType=`+ type)
  //     .pipe(map(res => {
  //       return res;
  //     }));
  // }
}
