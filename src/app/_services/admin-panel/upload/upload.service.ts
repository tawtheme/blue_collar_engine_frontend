import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  changeStatus(uploadInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Upload/ChangeUploadStatus`, uploadInfo)
      .pipe(map(res => {
        return res;
      }));
  }

}
