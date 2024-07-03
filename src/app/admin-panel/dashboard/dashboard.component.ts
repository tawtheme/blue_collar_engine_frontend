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
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
  todayBookingLoaded: boolean = false;
  estimateInvoiceLoaded: boolean = false;
  invoiceLoaded: boolean = false;
  technicianLoaded: boolean = false;
  topServicesLoaded: boolean = false;
  apiBaseUrl: string = environment.apiUrl + '/';
  constructor(private _bookingService: BookingService, private _estimateService: EstimateService, private _invoiceService: InvoiceService, private _accountSettingService: AccountSettingService, private _dashboardService: DashboardService) { }

  ngOnInit(): void {
    var _param = {
      "id": 0,
      "pageNumber": 1,
      "pageSize": 3,
      "searchStr": "",
      "type": "",
      "bookingDate": new Date()
    }
    this.todayBookings(_param);
    this.getEstimates();
    this.getInvoices();
    this.getTopTechnician();
    this.getTopServices();
  }

  onRatingChanged(rating: number) {
    //console.log(rating);
    this.rating = rating;
  }

  todayBookings(param: any) {
    this.todayBookingLoaded = true;
    this._bookingService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.todayBookingLoaded = false;
          this.todayBooking = res.data;
          //console.log(this.todayBooking)
        },
        error: error => {
          this.todayBookingLoaded = false;
        }
      });
  }

  getEstimates() {
    var _param = {
      "id": 0,
      "pageNumber": 1,
      "pageSize": 3,
      "searchStr": '',
      "status": '',
      "startDate": null,
      "endDate": null
    }
    this.estimateInvoiceLoaded = true;
    this._estimateService.getAll(_param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.estimateInvoiceLoaded = false;
          this.estimateInvoices = res.data;
          //console.log(this.estimateInvoices)
        },
        error: error => {
          this.estimateInvoiceLoaded = false;
        }
      });
  }

  getInvoices() {
    var _param = {
      "id": 0,
      "pageNumber": 1,
      "pageSize": 3,
      "searchStr": '',
      "status": '',
      "startDate": null,
      "endDate": null
    }
    this.invoiceLoaded = true;
    this._invoiceService.getAll(_param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.invoiceLoaded = false;
          this.invoices = res.data;
        },
        error: error => {
          this.invoiceLoaded = false;
        }
      });
  }

  bindHighChart() {
    // @ts-ignore
    var chart = Highcharts.chart('container', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Monthly Average Rainfall'
      },
      subtitle: {
        text: 'Source: WorldClimate.com'
      },
      xAxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Rainfall (mm)'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Tokyo',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

      }, {
        name: 'New York',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

      }, {
        name: 'London',
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

      }, {
        name: 'Berlin',
        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
      }]
    });
  }

  getTopTechnician() {
    this.technicianLoaded = true;
    this._dashboardService.getTopTechnician()
      .subscribe({
        next: (res: { data: any[]; }) => {
          this.technician = res.data;
          this.technician.forEach(res => {
            res.profileImagePath = this.apiBaseUrl + res.profileImagePath
          })
          //console.log(this.technician)
          this.technicianLoaded = false;
        },
        error: error => {
          this.technicianLoaded = false;
        }
      });
  }

  getTopServices() {
    this.topServicesLoaded = true;
    this._dashboardService.getTopServices()
      .subscribe({
        next: (res: { data: any[]; }) => {
          this.topServices = res.data;
          //console.log(this.topServices)
          this.topServicesLoaded = false;
        },
        error: error => {
          this.topServicesLoaded = false;
        }
      });
  }

}
