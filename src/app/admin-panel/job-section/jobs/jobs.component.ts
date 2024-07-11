import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { BookingService } from '@app/_services/admin-panel/booking/booking.service';
import { first } from 'rxjs';
import { EditViewBookingComponent } from '../edit-view-booking/edit-view-booking.component';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { environment } from '@environments/environment';
import { DatePipe } from '@angular/common';

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
  bookingSearchForm!: FormGroup;
  assignedBooking: any[] = [];
  compeletedBooking: any[] = [];
  bookingStats: any;
  pageSize: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageEvent: PageEvent | undefined;
  activePageDataChunkAssigned: any = []
  apiBaseUrl: string = environment.apiUrl + '/';
  constructor(private _router: Router, private _bookingService: BookingService, private _dialog: MatDialog, private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.bookingSearchForm = this._formBuilder.group({
      searchStr: ['', null],
      bookingDate: [null, null],
      type: ['', null],
      currentStatus: ['', null]
    });
    this.bookingSearchForm.controls['bookingDate'].setValue(new Date());

    this.getAllUnAssignedBooking(null);
    this.getAllAssignedBooking(null);
    this.getAllCompletedBooking(null);
    this.getBookingStats();
    this._bookingService.bookingTeamMemberAssign.subscribe((data: boolean) => {
      if (data) {
        this.getAllUnAssignedBooking(null);
        this.getAllAssignedBooking(null);
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

  getAllUnAssignedBooking(param: any = null) {
    this.loadUnAssigned = true;
    var _param: any;
    if (param != null) {
      if (param.type != 'U') {
        this.unAssignedBooking = [];
        this.loadUnAssigned = false;
        return;
      }
      _param = param;
    }
    else {
      _param = {
        "id": 0,
        "pageNumber": 0,
        "pageSize": this.pageSize,
        "searchStr": "",
        "type": "U",
        "bookingDate": new Date()
      }
    }
    //console.log(JSON.stringify(_param))
    this._bookingService.getAll(_param)
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

  getAllAssignedBooking(param: any = null) {
    this.loadAssigned = true;
    var _param: any;
    if (param != null) {
      if (param.type != 'A') {
        this.assignedBooking = [];
        this.loadAssigned = false;
        return;
      }
      else {
        _param = param;
      }
    }
    else {
      _param = {
        "id": 0,
        "pageNumber": 0,
        "pageSize": this.pageSize,
        "searchStr": "",
        "type": "A",
        "bookingDate": new Date()
      }
    }
    //   //console.log("loadAssigned" + JSON.parse(_param))
    this._bookingService.getAll(_param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loadAssigned = false;
          this.assignedBooking = res.data;
          //console.log(this.assignedBooking)
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

  getAllCompletedBooking(param: any = null) {
    this.loadCompeleted = true;
    var _param: any;
    if (param != null) {
      if (param.type != 'C') {
        this.compeletedBooking = [];
        this.loadCompeleted = false;
        return;
      }
      _param = param;
    }
    else {
      _param = {
        "id": 0,
        "pageNumber": 0,
        "pageSize": this.pageSize,
        "searchStr": "",
        "type": "C",
        "bookingDate": new Date()
      }
    }
    // //console.log("loadCompeleted" + JSON.parse(_param))
    this._bookingService.getAll(_param)
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

  openEditViewBooking(booking: any) {
    //debugger
    this._dialog.open(EditViewBookingComponent, { width: '1200px', height: '800px', data: { 'bookingInfo': booking, isEnableEdit: true }, disableClose: true })
  }

  filterBooking() {
    var obj = this.bookingSearchForm.value;
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": this.pageSize,
      "searchStr": obj.searchStr,
      "type": obj.type,
      "bookingDate": obj.bookingDate,
      "currentStatus": obj.currentStatus
    }
    //console.log(obj)
    this.getAllUnAssignedBooking({ ..._param, ...{ type: _param.type == '' ? 'U' : _param.type, currentStatus: '' } });
    this.getAllAssignedBooking({ ..._param, ...{ type: _param.type == '' ? 'A' : _param.type } });
    this.getAllCompletedBooking({ ..._param, ...{ type: _param.type == '' ? 'C' : _param.type, currentStatus: '' } });
  }

  resetFilter() {
    this.bookingSearchForm.reset();
    this.bookingSearchForm.controls['bookingDate'].setValue(new Date());
    this.bookingSearchForm.controls['type'].setValue('');
    this.bookingSearchForm.controls['currentStatus'].setValue('');
    this.filterBooking();
  }

  getBookingStats() {
    this._bookingService.getBookingStats()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.bookingStats = res.data;
          //console.log(this.bookingStats)
        },
        error: error => {
        }
      });
  }

  onChangeCurrentStatus(event:any){
    this.bookingSearchForm.controls['currentStatus'].setValue(event.target.value);
    this.filterBooking();
  }

  onEnter(str: any): void {
    this.filterBooking();
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
    this.getAllAssignedBooking(_param);
    this.getAllCompletedBooking(_param);
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
}
