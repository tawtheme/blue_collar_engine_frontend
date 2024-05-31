import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TenantService } from '@app/_services/secure-panel/tenant.service';
import { BookingSharedService } from '@app/_services/site-panel/booking/booking-shared.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import moment from 'moment';
import { BookingAddressComponent } from '../booking-address/booking-address.component';

@Component({
  selector: 'app-booking-slot',
  templateUrl: './booking-slot.component.html',
  styleUrls: ['./booking-slot.component.scss']
})
export class BookingSlotComponent {
  bookingDate: Date | null | undefined;
  todayDate: Date = new Date();
  businessHours: any[] = [];
  bookingTime: any;
  selectedServices: any[] = [];
  submitted = false;
  isEnableNextBtn: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<BookingSlotComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any[] = [], private _tenantService: TenantService, private _dialog: MatDialog, private _bookingSharedService: BookingSharedService
  ) { }

  ngOnInit() {
    //console.log(this.data)
    this.selectedServices = this.data;
    if (this.selectedServices.length > 0) {
      this.isEnableNextBtn = true;
    }
    this.bookingDate = this.todayDate;
    const date = moment(this.todayDate);
    const dow = date.day();
    this.bindBusinessHours(dow);
  }

  bindBusinessHours(dayId: number) {
    this._tenantService.getBusinesshours().subscribe(res => {
      this.businessHours = res.data.filter((time: { dayId: any; }) => {
        return time.dayId === dayId;
      })
      if (this.businessHours.length > 0) {
        this.bookingTime = this.businessHours[0].businessHourId;
      }
      else {
        this.bookingTime = 0;
      }

      //console.log(this.businessHours)
    });
  }

  openBookingAddress() {
    this.businessHours = this.businessHours.filter((time: { businessHourId: any; }) => {
      return time.businessHourId === this.bookingTime;
    });

    this._dialog.open(BookingAddressComponent, { width: '640px', height: '400px', data: { bookingDate: this.bookingDate, bookingTime: this.bookingTime, businessHours: this.businessHours, selectedServices: this.selectedServices }, disableClose: true });
    this.dialogRef.close();
  }

  onSelect(event: any) {
    const date = moment(event); // Thursday Feb 2015
    const dow = date.day();
    this.bindBusinessHours(dow);
  }

  removeSelectedService(serviceId: number) {
    const message = `Are you sure you want to do remove?`;
    const dialogData = new ConfirmDialogModel("Confirmation", message);
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this._bookingSharedService.removeProductFromCart(serviceId);
        this.bindSelectedService();
      }
      else {
        return;
      }
    });
  }

  bindSelectedService() {
    this._bookingSharedService.getProducts().subscribe(res => {
      if (res.length > 0) {
        this.selectedServices = res;
        this.isEnableNextBtn = true;
        //console.log(this.selectedServices)
      }
      else {
        this.isEnableNextBtn = false;
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }


}
