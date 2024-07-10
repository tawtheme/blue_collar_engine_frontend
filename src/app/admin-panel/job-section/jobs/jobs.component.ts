import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { BookingService } from '@app/_services/admin-panel/booking/booking.service';
import { first } from 'rxjs';
import { EditViewBookingComponent } from '../edit-view-booking/edit-view-booking.component';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {
  loadUnAssigned = false;
  loadAssigned = false;
  loadCompeleted = false;
  unAssignedBooking: any[] = [];
  todayDate = new FormControl(new Date());
  assignedBooking: any[] = [];
  compeletedBooking: any[] = [];
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageEvent: PageEvent | undefined;
  activePageDataChunkAssigned: any = []
  apiBaseUrl: string = environment.apiUrl + '/';
  constructor(private _router: Router, private _bookingService: BookingService, private _dialog: MatDialog,) {

  }

  ngOnInit(): void {
    var _param = {
      "id": 0,
      "pageNumber": 1,
      "pageSize": this.pageSize,
      "searchStr": "",
      "type": "",
      "bookingDate": new Date()
    }
    this.getAllUnAssignedBooking(_param);
    this.getAllAssignedBooking(_param);
    this.getAllCompletedBooking(_param);
    this._bookingService.bookingTeamMemberAssign.subscribe((data: boolean) => {
      if (data) {
        this.getAllUnAssignedBooking(_param);
        this.getAllAssignedBooking(_param);
      }
    });

    // this._bookingService.openEditBookingPage.subscribe(bookingId => {
    //   if (bookingId > 0) {
    //     this.openEditViewBooking(bookingId);
    //   }
    // })
  }

  createJob() {
    this._router.navigate(['/admin/create-job']);
  }

  getAllUnAssignedBooking(param: PaginationModel) {
    this.loadUnAssigned = true;
    param = { ...param, ...{ type: 'U' } };
    this._bookingService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loadUnAssigned = false;
          this.unAssignedBooking = res.data;
          this.unAssignedBooking.forEach(res => {
            if (res.assignedTeamMembers.length > 0) {
              res.assignedTeamMembers.forEach((r: any) => {
                if (r.profileImagePath != '' && r.profileImagePath != null) {
                  r.profileImagePath = this.apiBaseUrl + r.profileImagePath
                }
              })
            }
          })
        },
        error: error => {
          this.loadUnAssigned = false;
        }
      });
  }

  getAllAssignedBooking(param: PaginationModel) {
    this.loadAssigned = true;
    param = { ...param, ...{ type: 'A', bookingDate: null } };
    this._bookingService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loadAssigned = false;
          this.assignedBooking = res.data;
          this.assignedBooking.forEach(res => {
            if (res.assignedTeamMembers.length > 0) {
              res.assignedTeamMembers.forEach((r: any) => {
                if (r.profileImagePath != '' && r.profileImagePath != null) {
                  r.profileImagePath = this.apiBaseUrl + r.profileImagePath
                }
              })
            }
          })
        },
        error: error => {
          this.loadAssigned = false;
        }
      });
  }

  onPageChanged(e: any, type: any) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    var _param = {
      "id": 0,
      "pageNumber": e.pageIndex + 1,
      "pageSize": e.pageSize,
      "searchStr": "",
      "type": "",
      "bookingDate": new Date()
    }
    if (type == 'U') {
      this.getAllUnAssignedBooking(_param);
    }
    if (type == 'A') {
      this.getAllAssignedBooking(_param);
    }
    if (type == 'C') {
      this.getAllCompletedBooking(_param);
    }
  }

  getAllCompletedBooking(param: PaginationModel) {
    this.loadCompeleted = true;
    param = { ...param, ...{ type: 'C', bookingDate: null } };
    //////console.log(param)
    this._bookingService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loadCompeleted = false;
          this.compeletedBooking = res.data;
          this.compeletedBooking.forEach(res => {
            if (res.assignedTeamMembers.length > 0) {
              res.assignedTeamMembers.forEach((r: any) => {
                if (r.profileImagePath != '' && r.profileImagePath != null) {
                  r.profileImagePath = this.apiBaseUrl + r.profileImagePath
                }
              })
            }
          })
        },
        error: error => {
          this.loadCompeleted = false;
        }
      });
  }

  onUnassignedDateChange(event: MatDatepickerInputEvent<Date>): void {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": "",
      "type": "",
      "bookingDate": event.value
    }
    this.getAllUnAssignedBooking(_param);
  }

  openEditViewBooking(booking: any) {
    //debugger
    this._dialog.open(EditViewBookingComponent, { width: '1200px', height: '800px', data: { 'bookingInfo': booking, isEnableEdit: true }, disableClose: true })
  }
}
