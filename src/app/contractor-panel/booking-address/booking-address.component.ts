import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';
import { TenantService } from '@app/_services/secure-panel/tenant.service';
import { BookingSharedService } from '@app/_services/site-panel/booking/booking-shared.service';
import { BookingService } from '@app/_services/site-panel/booking/booking.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking-address',
  templateUrl: './booking-address.component.html',
  styleUrls: ['./booking-address.component.scss']
})
export class BookingAddressComponent {
  calanderBookingForm!: FormGroup;
  mobileVerifyForm!: FormGroup;
  isVerifyOtp: boolean = false;
  openVerifyOTP: boolean = false;
  submitted = false;
  tenantInfo: any;
  user: any;
  bookingDate: Date | null | undefined;
  businessHours: any[] = [];
  bookingTime: any;
  selectedServices: any[] = [];
  isEnableNextBtn: boolean = false;
  IsShowEditBtn: boolean = false;
  constructor(private authenticationService: AuthenticationService, private _router: Router, private _dialog: MatDialog, private _toastrService: ToastrService, private _bookingSharedService: BookingSharedService, private _tenantService: TenantService, private formBuilder: FormBuilder, private _customerService: CustomerService, public dialogRef: MatDialogRef<BookingAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _bookingService: BookingService) {
    this.tenantInfo = <any>this.authenticationService.tenantValue;
    this.user = <any>this.authenticationService.userValue;
    // //console.log(this.tenantInfo)
    // //console.log(this.user)
    ////console.log(this.data)
    this.businessHours = this.data.businessHours;
    this.bookingTime = this.data.bookingTime;
    this.bookingDate = this.data.bookingDate;
    this.selectedServices = this.data.selectedServices;
    if (this.selectedServices.length > 0) {
      this.isEnableNextBtn = true;
    }
  }

  ngOnInit() {
    this.mobileVerifyForm = this.formBuilder.group({
      mobileNo: ['', [Validators.required]],
      countryCode: ['', Validators.required],
      otp: ['', null]
    });

    this.calanderBookingForm = this.formBuilder.group({
      customerId: ['', null],
      customerAddressId: ['', null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', [Validators.required]],
      serviceAddress: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5,6}')]],
      latitude: ['', null],
      longitude: ['', null]
    });
  }

  get e() { return this.mobileVerifyForm.controls; }
  get f() { return this.calanderBookingForm.controls; }

  onVerifyMobileNo() {
    this.submitted = true;
    if (this.mobileVerifyForm.invalid) {
      return;
    }
    this.mobileVerifyForm.controls['mobileNo'].disable();
    this.submitted = false;
    this.mobileVerifyForm.controls['otp'].setValidators([Validators.required, Validators.pattern('[0-9]{6}')]);
    this.mobileVerifyForm.controls['otp'].updateValueAndValidity();
    this.openVerifyOTP = true;
    var _mobileNo = this.mobileVerifyForm.controls['mobileNo'].value.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, '');
    var _param = {
      "sendTo": _mobileNo,
      "otp": "",
      "timeZone": this.tenantInfo.timeZone,
      "validTillInMin": 10
    }
    if (this.mobileVerifyForm.controls['otp'].value == '') {
      this.authenticationService.generateOTP(_param).subscribe(res => {
        console.log(res);
        this.IsShowEditBtn = true;
        this._toastrService.success("One time password have been sent on mobile no.")
      })
    }
    else {
      _param.otp = this.mobileVerifyForm.controls['otp'].value;
      this.authenticationService.verifyOTP(_param).subscribe(res => {
        //console.log(res)
        this._toastrService.success(res.message);
        this.openVerifyOTP = false;
        this.isVerifyOtp = true;
        this._customerService.findCustomerByMobileNo(_param.sendTo).subscribe(res => {
          //console.log(res)
          if (res.data.response != -1 && res.data.response != -2) {
            this.calanderBookingForm.patchValue(res.data.result);
          }
        })
      })
    }
  }

  enableEditMobileNo() {
    this.mobileVerifyForm.controls['mobileNo'].enable();
    this.openVerifyOTP = false;
    this.IsShowEditBtn = false;
    this.isVerifyOtp = false;
    this.mobileVerifyForm.controls['mobileNo'].setValue('');
    this.mobileVerifyForm.controls['otp'].setValue('');
    this.mobileVerifyForm.controls['otp'].removeValidators(Validators.required);
    this.mobileVerifyForm.controls['otp'].updateValueAndValidity();
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

  proceedBooking() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.calanderBookingForm.invalid) {
      return;
    }
    else if (this.selectedServices.length == 0) {
      this._toastrService.error("Please add atleast one service", "Error");
    }
    else {
      const message = `Are you sure you want to do proceed?`;
      const dialogData = new ConfirmDialogModel("Confirmation", message);
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          let _param = this.calanderBookingForm.value as any;
          var _mobileNo = this.mobileVerifyForm.controls['mobileNo'].value.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, '');
          _param = { ..._param, ...{ mobileNo: _mobileNo, bookingDate: this.bookingDate, timeSlot: this.bookingTime, bookingDetails: this.selectedServices, customerId: (_param.customerId == '' ? 0 : _param.customerId), addressId: (_param.customerAddressId == '' ? 0 : _param.customerAddressId), status: 'U' } };
          //console.log(_param)
          this._bookingService.createBooking(_param).subscribe(res => {
            //console.log(res)
            this._toastrService.success(res.message, "Success");
            this._bookingSharedService.emptryCart();
            this.dialogRef.close();
          })
        }
        else {
          return;
        }
      });
    }
  }
}
