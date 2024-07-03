import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { BookingService } from '@app/_services/admin-panel/booking/booking.service';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';
import { EstimateService } from '@app/_services/admin-panel/estimate/estimate.service';
import { InvoiceService } from '@app/_services/admin-panel/invoice/invoice.service';
import { EditViewBookingComponent } from '@app/admin-panel/job-section/edit-view-booking/edit-view-booking.component';
import { first } from 'rxjs';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  customerInfo: any;
  customerAddress: any = [];
  customerId: number = 0;
  customerStats: any;
  customerStatsLoading: boolean = false;
  loadBooking: boolean = false;
  loadInvoice: boolean = false;
  loadEstimateInvoice: boolean = false;
  bookings: any = [];
  invoices: any = [];
  estimateInvoice: any = [];

  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageEvent: PageEvent | undefined;
  constructor(private route: ActivatedRoute, private _customerService: CustomerService, private _router: Router, private _bookingService: BookingService, private _invoiceService: InvoiceService, private _estimateService: EstimateService, private _dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.customerId = params.customerId;
        this.get(params.customerId);
        this.getAddress(params.customerId);
        this.getCustomerStats(this.customerId);
        var _param = {
          "id": 0,
          "pageNumber": 1,
          "pageSize": this.pageSize,
          "searchStr": "",
          "type": "",
          "bookingDate": null,
          'customerUserId': this.customerId
        }
        this.getBookings(_param);
        this.getInvoices(_param);
        this.getEstimateinvoices(_param);
      }
      );
    this._customerService.customerDetailAdded.subscribe((customerId: number) => {
      if (customerId > 0) {
        this.get(customerId);
        this.getAddress(customerId);
      }
    });

  }

  getBookings(param: PaginationModel) {
    this.loadBooking = true;
    this._bookingService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loadBooking = false;
          this.bookings = res.data;
          //console.log(this.bookings)
        },
        error: error => {
          this.loadBooking = false;
        }
      });
  }

  getInvoices(param: PaginationModel) {
    this.loadInvoice = true;
    this._invoiceService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loadInvoice = false;
          this.invoices = res.data;
          //console.log(this.invoices)
        },
        error: error => {
          this.loadInvoice = false;
        }
      });
  }

  getEstimateinvoices(param: PaginationModel) {
    this.loadEstimateInvoice = true;
    this._estimateService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loadEstimateInvoice = false;
          this.estimateInvoice = res.data;
          //console.log(this.estimateInvoice)
        },
        error: error => {
          this.loadEstimateInvoice = false;
        }
      });
  }

  get(customerId: number) {
    this._customerService.get(customerId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.customerInfo = res.data;
        },
        error: error => {
        }
      });
  }

  getAddress(customerId: number) {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this._customerService.getAllAddress(_param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.customerAddress = res.data.filter(function (el: { customerId: number; }) {
            return el.customerId == customerId;
          });
          // //console.log(this.customerAddress)
        },
        error: error => {
        }
      });
  }

  redirectToCreateJob() {
    this._router.navigate(['/admin/create-job']);
  }

  getCustomerStats(customerId: number) {
    this.customerStatsLoading = true;
    this._customerService.getCustomerStats(customerId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.customerStatsLoading = false;
          this.customerStats = res.data;
          ////console.log(this.customerStats)
        },
        error: error => {
          this.customerStatsLoading = false;
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
      "bookingDate": null,
      'customerUserId': this.customerId
    }
    if (type == 'B') {
      this.getBookings(_param);
    }
    if (type == 'I') {
      this.getInvoices(_param);
    }
    if (type == 'E') {
      this.getEstimateinvoices(_param);
    }
  }

  openEditViewBooking(booking: any) {
    this._dialog.open(EditViewBookingComponent, { width: '1200px', height: '800px', data: { 'bookingInfo': booking, isEnableEdit: false }, disableClose: true })
  }

  viewInvoice(invoiceId: number) {
    this._router.navigate(['/admin/create-invoice'], { queryParams: { invoiceId: invoiceId } })
  }

  redirectToCreateEstimate(estimateId: number) {
    this._router.navigate(['/admin/create-estimate'], { queryParams: { estimateId: estimateId } })
  }

  redirectToEstimate(customerId:number){
    this._router.navigate(['/admin/create-estimate'], { queryParams: { customerId: customerId } })
  }
}
