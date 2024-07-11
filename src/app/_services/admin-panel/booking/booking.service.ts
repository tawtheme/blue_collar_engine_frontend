import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  public bookingTeamMemberAssign: Subject<boolean>;
  public bookingStepData: Subject<any>;
  public openEditBookingPage: Subject<number>;
  constructor(private http: HttpClient) {
    this.bookingTeamMemberAssign = new Subject<boolean>();
    this.bookingStepData = new Subject<any>();
    this.openEditBookingPage = new Subject<number>();
  }

  get(bookingId: number) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Booking/Get?bookingId=` + bookingId)
      .pipe(map(res => {
        return res;
      }));
  }

  getAll(PaginationModel: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Booking/GetAll`, PaginationModel)
      .pipe(map(res => {
        return res;
      }));
  }

  getBookingAssignTeam(bookingId: number) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Booking/GetBookingAssignTeam`)
      .pipe(map(res => {
        return res;
      }));
  }

  getBookingAssignedTeam(bookingId: number) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Booking/GetBookingAssignedTeam`)
      .pipe(map(res => {
        return res;
      }));
  }
  assignTeamMember(teammemberList: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Booking/AssignTeam`, teammemberList)
      .pipe(map(res => {
        return res;
      }));
  }

  getBookingSteps(bookingStepInputInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Booking/GetBookingSteps`, bookingStepInputInfo)
      .pipe(map(res => {
        return res;
      }));
  }

  saveBookingRating(bookingRateInfo: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/Booking/SaveRating`, bookingRateInfo)
      .pipe(map(res => {
        return res;
      }));
  }
  
  getBookingStats() {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Booking/GetBookingStats`)
      .pipe(map(res => {
        return res;
      }));
  }
}
