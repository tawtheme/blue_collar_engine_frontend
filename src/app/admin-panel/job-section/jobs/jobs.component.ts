import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { BookingService } from '@app/_services/admin-panel/booking/booking.service';
import { first } from 'rxjs';
import { EditViewBookingComponent } from '../edit-view-booking/edit-view-booking.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {
  loading = false;
  unAssignedBooking: any[] = [];
  todayDate = new FormControl(new Date());
  constructor(private _router: Router, private _bookingService: BookingService, private _dialog: MatDialog,) {

  }

  ngOnInit(): void {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": "",
      "type": "",
      "bookingDate": new Date()
    }
    this.getAllUnAssignedBooking(_param);
  }

  createJob() {
    this._router.navigate(['/admin/create-job']);
  }

  getAllUnAssignedBooking(param: PaginationModel) {
    param = { ...param, ...{ type: 'U' } };
    console.log(param)
    this._bookingService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.unAssignedBooking = res.data;
          console.log(this.unAssignedBooking)
        },
        error: error => {
          this.loading = false;
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
    this._dialog.open(EditViewBookingComponent, { width: '1200px', height: '800px', data: booking, disableClose: true })
  }
}
