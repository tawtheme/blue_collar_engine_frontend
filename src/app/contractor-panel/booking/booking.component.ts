import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { AuthenticationService } from '@app/_services';
import { CategoryService } from '@app/_services/admin-panel/category/category.service';
import { BookingSharedService } from '@app/_services/site-panel/booking/booking-shared.service';
import { environment } from '@environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { Subject, first } from 'rxjs';
import moment from 'moment';
import { TenantService } from '@app/_services/secure-panel/tenant.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  tenantInfo: any;
  user: any;
  items: any[] = [];
  loading = false;
  activeCategory: number = 0;
  baseUrl: string = '';
  isAdded: any = [];
  totalServiceCount: number = 0;
  categoryService: any[] = [];
  singleCategory: any;
  isEnableNextBtn: boolean = false;

  bookingDate: Date | null | undefined;
  todayDate: Date = new Date();
  businessHours: any[] = [];

  selectedServices: any[] = [];
  calanderBookingForm!: FormGroup;
  emailVerifyForm!: FormGroup;
  submitted = false;

  bookingTime: any;
  isVerifyOtp: boolean = false;
  openVerifyOTP: boolean = false;

  @ViewChild('openBookingAddress') openBookingAddressEle!: ElementRef<HTMLElement>;
  constructor(private authenticationService: AuthenticationService, private _categoryService: CategoryService, private _router: Router, private _dialog: MatDialog, private _toastrService: ToastrService, private _bookingSharedService: BookingSharedService, private _tenantService: TenantService, private formBuilder: FormBuilder,) {
    this.tenantInfo = <any>this.authenticationService.tenantValue;
    this.user = <any>this.authenticationService.userValue;
    this.baseUrl = environment.apiUrl;
    //console.log(this.tenantInfo)
    //console.log(this.user)

  }

  ngOnInit(): void {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this.getAll(_param);
    this.bindSelectedService();
    this.bookingDate = this.todayDate;
    const date = moment(this.todayDate);
    const dow = date.day();
    this.bindBusinessHours(dow);

    this.emailVerifyForm = this.formBuilder.group({
      emailAddress: ['', Validators.required],
      otp: ['', null]
    });

    this.calanderBookingForm = this.formBuilder.group({
      customerId: ['', null],
      customerAddressId: ['', null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      latitude: ['', null],
      longitude: ['', null]
    });
  }

  get e() { return this.emailVerifyForm.controls; }
  get f() { return this.calanderBookingForm.controls; }

  getAll(param: PaginationModel) {
    var _totalCount = 0;
    this._categoryService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.items = res.data;
          if (this.items.length > 0) {
            this.items = this.items.filter(function (event) {
              return event.categoryServices.length > 0;
            });
            this.items.forEach(function (item: any) {

              item.categoryServices.forEach(function (service: any) {
                _totalCount += service.categoryServiceId;
                if (service.uploadedFiles.length > 0) {
                  service.uploadedFiles[0].filePath = environment.apiUrl + '/' + service.uploadedFiles[0].filePath;
                }
              })
            });
            this.activeCategory = this.items[0].categoryId;
            this.isAdded = new Array(_totalCount);
          }
          //console.log(this.isAdded)
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  bindSelectedService() {
    this._bookingSharedService.getProducts().subscribe(res => {
      if (res.length > 0) {
        this.selectedServices = res;
        this.isEnableNextBtn = true;
        console.log(this.selectedServices)
      }
      else {
        this.isEnableNextBtn = false;
      }
    });
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

      console.log(this.businessHours)
    });
  }

  activeTab(categoryId: number) {
    this.activeCategory = categoryId;
  }

  addToCart(event: any, serviceId: number) {
    if (event.target.classList.contains('added')) {
      this._bookingSharedService.removeProductFromCart(serviceId);
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].categoryServices.length > 0) {
          for (let j = 0; j < this.items[i].categoryServices.length; j++) {
            if (this.items[i].categoryServices[j].categoryServiceId === serviceId) {
              this.isAdded[this.items[i].categoryServices[j].categoryServiceId] = false;
            }
          }
        }
      }
    }
    else {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].categoryServices.length > 0) {
          for (let j = 0; j < this.items[i].categoryServices.length; j++) {
            //console.log(j)
            if (this.items[i].categoryServices[j].categoryServiceId === serviceId) {
              this.isAdded[this.items[i].categoryServices[j].categoryServiceId] = true;
              this.singleCategory = this.items[i].categoryServices[j];
              this._bookingSharedService.addProductToCart(this.singleCategory);
            }
          }
        }
      }
    }
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

  proceedtoAddress() {
    //console.log('Booking date :' + moment(this.selected))
    console.log('Booking date :' + this.bookingDate)
    console.log('Business Hour Id :' + this.bookingTime)
    this.businessHours = this.businessHours.filter((time: { businessHourId: any; }) => {
      return time.businessHourId === this.bookingTime;
    })
    //console.log(this.businessHours)
    let el: HTMLElement = this.openBookingAddressEle.nativeElement;
    el.click();
  }

  onSelect(event: any) {
    const date = moment(event); // Thursday Feb 2015
    const dow = date.day();
    this.bindBusinessHours(dow);
  }

  // onTimeSlotChange(event: any) {
  //   this.businessHourId = event.value;
  // }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.calanderBookingForm.invalid) {
      return;
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
          console.log(this.calanderBookingForm.value)
        }
        else {
          return;
        }
      });
    }
    // this.loading = true;
  }

  // generateOTP(emailAddress: any) {
  //   this.openVerifyOTP = true;
  //   console.log(emailAddress)
  // }

  // verifyOTP(emailAddress: any) {
  //   console.log(emailAddress)
  //   this.openVerifyOTP = false;
  //   this._toastrService.success("Email address have been verified successfully", "Success");
  //   this.isVerifyOtp = true;
  // }

  onVerifyEmail() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.emailVerifyForm.invalid) {
      return;
    }
    this.emailVerifyForm.controls['emailAddress'].disable();
    this.submitted = false;

    
    this.emailVerifyForm.controls['otp'].setValidators([Validators.required, Validators.pattern('[0-9]{6}')]);
    this.emailVerifyForm.controls['otp'].updateValueAndValidity();
    this.openVerifyOTP = true;
    // console.log(this.emailVerifyForm.value.emailAddress)
    // console.log(this.emailVerifyForm.value.otp)
  }

  enableEditEmail() {
    this.emailVerifyForm.controls['emailAddress'].enable();
    this.openVerifyOTP = false;
    this.emailVerifyForm.controls['otp'].setValue('');
    this.emailVerifyForm.controls['otp'].removeValidators(Validators.required);
    this.emailVerifyForm.controls['otp'].updateValueAndValidity();
  }
}
