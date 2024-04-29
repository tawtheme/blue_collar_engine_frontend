import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestDemoService {

  constructor(private http: HttpClient) { }

  getDemoRequested() {
    //let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    var params = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    return this.http.post<any>(`${environment.apiUrl}/api/v1/RequestDemo/GetAll`, params)
      .pipe(map(res => {
        return res;
      }));
  }
}
