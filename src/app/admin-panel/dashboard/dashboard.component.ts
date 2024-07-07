import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { StarRatingColor } from '../shared/star-rating/star-rating.component';
import { BookingService } from '@app/_services/admin-panel/booking/booking.service';
import { first } from 'rxjs';
import { EstimateService } from '@app/_services/admin-panel/estimate/estimate.service';
import { InvoiceService } from '@app/_services/admin-panel/invoice/invoice.service';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { environment } from '@environments/environment';
import { DashboardService } from '@app/_services/admin-panel/dashboard/dashboard.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

const startDate = new Date();
const endDate= new Date(startDate.getTime() - (336*60*60*1000));

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  rating: number = 5;
  starCount: number = 5;
  starColor: StarRatingColor = StarRatingColor.accent;
  starColorP: StarRatingColor = StarRatingColor.primary;
  starColorW: StarRatingColor = StarRatingColor.warn;

  todayBooking: any[] = [];
  estimateInvoices: any[] = [];
  invoices: any[] = [];
  technician: any[] = [];
  topServices: any[] = [];
  graphStats: any[] = [];
  stats: any;
  todayBookingLoaded: boolean = false;
  estimateInvoiceLoaded: boolean = false;
  invoiceLoaded: boolean = false;
  technicianLoaded: boolean = false;
  topServicesLoaded: boolean = false;
  apiBaseUrl: string = environment.apiUrl + '/';

  dashboardRagePickerForm!: FormGroup;

  constructor(
    private _bookingService: BookingService,
    private _estimateService: EstimateService,
    private _invoiceService: InvoiceService,
    private _accountSettingService: AccountSettingService,
    private _dashboardService: DashboardService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dashboardRagePickerForm = this._formBuilder.group({
      start: [null, null],
      end: [null, null],
    });
<<<<<<< HEAD
    this.dashboardRagePickerForm.controls['start'].setValue(
      new Date(year, month, day - 14)
    );
    this.dashboardRagePickerForm.controls['end'].setValue(
      new Date(year, month, day)
    );
=======
    this.dashboardRagePickerForm.controls['start'].setValue(endDate);
    this.dashboardRagePickerForm.controls['end'].setValue(startDate);
>>>>>>> 0407233f05dfde6f1e012f5b6d65839d46ca54b1

    this.getDashboardGraphStats();
    this.getDashboardStats();
    var _param = {
      id: 0,
      pageNumber: 1,
      pageSize: 3,
      searchStr: '',
      type: '',
      bookingDate: new Date(),
    };
    this.todayBookings(_param);
    this.getEstimates();
    this.getInvoices();
    this.getTopTechnician();
    this.getTopServices();
  }

  onRatingChanged(rating: number) {
    this.rating = rating;
  }

  todayBookings(param: any) {
    this.todayBookingLoaded = true;
    this._bookingService
      .getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.todayBookingLoaded = false;
          this.todayBooking = res.data;
          ////console.log(this.todayBooking)
        },
        error: (error) => {
          this.todayBookingLoaded = false;
        },
      });
  }

  getEstimates() {
    var _param = {
      id: 0,
      pageNumber: 1,
      pageSize: 3,
      searchStr: '',
      status: '',
      startDate: null,
      endDate: null,
    };
    this.estimateInvoiceLoaded = true;
    this._estimateService
      .getAll(_param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.estimateInvoiceLoaded = false;
          this.estimateInvoices = res.data;
          ////console.log(this.estimateInvoices)
        },
        error: (error) => {
          this.estimateInvoiceLoaded = false;
        },
      });
  }

  getInvoices() {
    var _param = {
      id: 0,
      pageNumber: 1,
      pageSize: 3,
      searchStr: '',
      status: '',
      startDate: null,
      endDate: null,
    };
    this.invoiceLoaded = true;
    this._invoiceService
      .getAll(_param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.invoiceLoaded = false;
          this.invoices = res.data;
        },
        error: (error) => {
          this.invoiceLoaded = false;
        },
      });
  }

  getTopTechnician() {
    this.technicianLoaded = true;
    this._dashboardService.getTopTechnician().subscribe({
      next: (res: { data: any[] }) => {
        this.technician = res.data;
        this.technician.forEach((res) => {
          res.profileImagePath = this.apiBaseUrl + res.profileImagePath;
        });
        this.technicianLoaded = false;
      },
      error: (error) => {
        this.technicianLoaded = false;
      },
    });
  }

  getTopServices() {
    this.topServicesLoaded = true;
    this._dashboardService.getTopServices().subscribe({
      next: (res: { data: any[] }) => {
        this.topServices = res.data;
        ////console.log(this.topServices)
        this.topServicesLoaded = false;
      },
      error: (error) => {
        this.topServicesLoaded = false;
      },
    });
  }

  rangeChangeEvent() {
    this.getDashboardGraphStats();
  }

  getDashboardGraphStats() {
    var objDahsboardGraphInput = {
      startDate: this.dashboardRagePickerForm.value.start,
      endDate: this.dashboardRagePickerForm.value.end,
    };
    if (objDahsboardGraphInput.endDate == null) {
      return;
    }
    this._dashboardService
      .getDashboardGraphStats(objDahsboardGraphInput)
      .subscribe({
        next: (res: { data: any[] }) => {
          this.graphStats = res.data;
          this.bindHighChart(this.graphStats);
        },
        error: (error) => {},
      });
  }

  getDashboardStats() {
    this._dashboardService.getDashboardStats()
      .subscribe({
        next: (res: { data: any[]; }) => {
          this.stats = res.data;
          // console.log(this.stats)
        },
        error: error => {
        }
      });
  }

  bindHighChart(graphStats: any = []) {
    var days = this.graphStats.map(function (el) {
      return el.day;
    });
    var graphData = [];
    graphData.push(
      {
        name: 'Total Booking',
        data: this.graphStats.map(function (el) {
          return el.totalBookingCount;
        }),
      },
      {
        name: 'Total Estimate',
        data: this.graphStats.map(function (el) {
          return el.totalEstimateCount;
        }),
      },
      {
        name: 'Total Invoice',
        data: this.graphStats.map(function (el) {
          return el.totalInvoiceCount;
        }),
      }
    );

    //console.log(graphData)
    // @ts-ignore
    var chart = Highcharts.chart('container', {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Counter',
      },
      subtitle: {
        text: 'Total Booking, Total Estimate & Total Invoice',
      },
      xAxis: {
        categories: days,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total Count',
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: graphData,
    });
  }
}
