import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '@app/_services/admin-panel/booking/booking.service';
import { InvoiceService } from '@app/_services/admin-panel/invoice/invoice.service';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { StarRatingColor } from '@app/shared/star-rating/star-rating.component';
import { environment } from '@environments/environment';
import { first } from 'rxjs';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent {
  rating: number = 0;
  starCount: number = 5;
  starColor: StarRatingColor = StarRatingColor.accent;
  starColorP: StarRatingColor = StarRatingColor.primary;
  starColorW: StarRatingColor = StarRatingColor.warn;
  starDisable: boolean = false;
  tenantId: number = 0;
  bookingId: number = 0;
  apiBaseUrl: string = environment.apiUrl + '/';
  tenantInfo: any;
  ratingForm!: FormGroup;
  submitted = false;
  feebackText: any = '';
  hideSubmitBtn: boolean = false;
  constructor(private route: ActivatedRoute, private _accountSettingService: AccountSettingService, private _bookingService: BookingService, private _invoiceService: InvoiceService, private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, private _router: Router) {

  }

  ngOnInit(): void {
    this.ratingForm = this._formBuilder.group({
      feedback: ['', null],
      bookingId: [0, null]
    });
    this.route.queryParams
      .subscribe(params => {
        this.tenantId = params.tenant;
        this.bookingId = params.bookingId;
        // ////console.log('tenantId: ' + this.tenantId)
        // ////console.log('bookingId: ' + this.bookingId)
        if (this.tenantId != null && this.tenantId != null) {
          this.getTenant(this.tenantId);
        }
        if (this.bookingId > 0) {
          this.ratingForm.controls['bookingId'].setValue(this.bookingId);
          this.getBooking(this.bookingId);
        }
      })
  }

  getTenant(userId: any) {
    this._accountSettingService.getTenant(userId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          ////console.log(res.data)
          if (res.data == null) {
            this.hideSubmitBtn = true;
            this._snackBar.open("This link is no longer valid.", 'Close')
            return;
          }
          this.tenantInfo = { ...res.data, ...{ companyImagePath: this.apiBaseUrl + res.data.companyImagePath } };
        },
        error: error => {
        }
      });
  }

  getBooking(bookingId: any) {
    this._bookingService.get(bookingId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          //////console.log(res.data)
          if (res.data.invoiceId > 0) {
            //this.getInvoice(res.data.invoiceId);
          }
        },
        error: error => {
        }
      });
  }

  getInvoice(invoiceId: any) {
    this._invoiceService.get(invoiceId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          ////console.log(res.data)
        },
        error: error => {
        }
      });
  }

  onRatingChanged(rating: number) {
    this.rating = rating;
  }

  onSubmit() {
    this.submitted = true;
    var param = this.ratingForm.getRawValue();
    if (this.ratingForm.invalid) {
      return;
    }
    param = { ...param, ...{ rate: this.rating, tenantUserId: this.tenantInfo.userId, bookingId: this.bookingId } };
    this._bookingService.saveBookingRating(param)
      .subscribe(res => {
        this.submitted = false;
        this._snackBar.open(res.message, 'Close');
        if (this.tenantInfo.websiteUrl != undefined && this.tenantInfo.websiteUrl != null && this.tenantInfo.websiteUrl != "") {
          let url: string = '';
          if (!/^http[s]?:\/\//.test(this.tenantInfo.websiteUrl)) {
            url += 'http://';
          }
          url += this.tenantInfo.websiteUrl;
          window.location.href = url;
        }
      });
  }
  setDefaultPic() {
    if (this.tenantInfo != undefined) {
      this.tenantInfo.companyImagePath = "./../../../../assets/images/services3.png";
    }
  }
}
