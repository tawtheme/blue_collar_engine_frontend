import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { BookingService } from '@app/_services/admin-panel/booking/booking.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {
  loading = false;
  unAssignedBooking: any[] = [];
  constructor(private _router: Router, private _bookingService: BookingService) { }

  ngOnInit(): void {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this.getAll(_param);
  }

  createJob() {
    this._router.navigate(['/admin/create-job']);
  }

  getAll(param: PaginationModel) {
    param = { ...param, ...{ type: 'U' } };
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
}
