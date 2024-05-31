import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  createBooking(bookingInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Booking/CreateBooking`, bookingInfo)
      .pipe(map(res => {
        return res;
      }));
  }
}
