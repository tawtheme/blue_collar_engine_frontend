import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TenantService } from '@app/_services/secure-panel/tenant.service';
import { BookingSharedService } from '@app/_services/site-panel/booking/booking-shared.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import moment from 'moment';
import { BookingAddressComponent } from '../booking-address/booking-address.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking-slot',
  templateUrl: './booking-slot.component.html',
  styleUrls: ['./booking-slot.component.scss'],
})
export class BookingSlotComponent {
  bookingDate: Date | null | undefined;
  todayDate: Date = new Date();
  businessHours: any[] = [];
  bookingTime: any;
  bookingTimeText: any;
  selectedServices: any[] = [];
  submitted = false;
  isEnableNextBtn: boolean = false;
  loading: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<BookingSlotComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any[] = [],
    private _tenantService: TenantService,
    private _dialog: MatDialog,
    private _bookingSharedService: BookingSharedService,
    private _toastrService: ToastrService
  ) {}

  ngOnInit() {
    ////////console.log(this.data)
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
    this._tenantService.getBusinesshours().subscribe((res) => {
      this.loading = false;
      //////console.log(res.data)
      this.businessHours = res.data.filter(
        (time: { dayId: any; isDayActive: boolean }) => {
          return time.dayId === dayId && time.isDayActive == true;
        }
      );
      //////console.log(this.businessHours)
      if (this.businessHours.length > 0) {
        this.bookingTime = this.businessHours[0].businessHourId;
        this.bookingTimeText=this.businessHours[0].openTime+'-'+this.businessHours[0].closeTime;
        this.isEnableNextBtn = true;
      } else {
        this.bookingTime = 0;
        this.isEnableNextBtn = false;
      }
    });
  }

  openBookingAddress() {
    this.businessHours = this.businessHours.filter(
      (time: { businessHourId: any }) => {
        return time.businessHourId === this.bookingTime;
      }
    );

    this._dialog.open(BookingAddressComponent, {
      width: '800px',
      height: '550px',
      panelClass: 'custom-modal-style',
      data: {
        bookingDate: this.bookingDate,
        bookingTime: this.bookingTime,
        bookingTimeText:this.bookingTimeText,
        businessHours: this.businessHours,
        selectedServices: this.selectedServices,
      },
      disableClose: true,
    });
    this.dialogRef.close();
  }

  onSelect(event: any) {
    const date = moment(event); // Thursday Feb 2015
    const dow = date.day();
    this.bindBusinessHours(dow);
  }

  removeSelectedService(serviceId: number) {
    const message = `Are you sure you want to delete?`;
    const dialogData = new ConfirmDialogModel('Confirmation', message);
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this._bookingSharedService.removeProductFromCart(serviceId);
        this.bindSelectedService();
      } else {
        return;
      }
    });
  }

  bindSelectedService() {
    this._bookingSharedService.getProducts().subscribe((res) => {
      if (res.length > 0) {
        this.selectedServices = res;
        this.isEnableNextBtn = true;
        ////////console.log(this.selectedServices)
      } else {
        this.isEnableNextBtn = false;
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
