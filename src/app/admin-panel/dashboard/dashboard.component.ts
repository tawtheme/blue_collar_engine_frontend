import { Component, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { BookingService } from '@app/_services/admin-panel/booking/booking.service';
import { first, min } from 'rxjs';
import { EstimateService } from '@app/_services/admin-panel/estimate/estimate.service';
import { InvoiceService } from '@app/_services/admin-panel/invoice/invoice.service';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { environment } from '@environments/environment';
import { DashboardService } from '@app/_services/admin-panel/dashboard/dashboard.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OnboardPopupComponent } from './onboard-popup/onboard-popup.component';
import { Router } from '@angular/router';
import { StarRatingColor } from '@app/shared/star-rating/star-rating.component';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexNonAxisChartSeries
} from "ng-apexcharts";
const startDate = new Date();
const endDate = new Date(startDate.getTime() - (336 * 60 * 60 * 1000));

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
  starDisable: boolean = true;
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
  onBoardStatus: any;

  @ViewChild("chart", { static: false })
  chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  constructor(
    private _bookingService: BookingService,
    private _estimateService: EstimateService,
    private _invoiceService: InvoiceService,
    private _accountSettingService: AccountSettingService,
    private _dashboardService: DashboardService,
    private _formBuilder: FormBuilder, private _dialog: MatDialog, private _router: Router
  ) {

  }

  ngOnInit(): void {
    this.dashboardRagePickerForm = this._formBuilder.group({
      start: [null, null],
      end: [null, null],
    });
    this.dashboardRagePickerForm.controls['start'].setValue(endDate);
    this.dashboardRagePickerForm.controls['end'].setValue(startDate);

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
    this.getOnBoardStats();
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
          //////console.log(this.todayBooking)
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
          //////console.log(this.estimateInvoices)
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
        //////console.log(this.topServices)
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
        error: (error) => { },
      });
  }

  getDashboardStats() {
    this._dashboardService.getDashboardStats()
      .subscribe({
        next: (res: { data: any[]; }) => {
          this.stats = res.data;
          // //console.log(this.stats)
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

    ////console.log(graphData)
    // @ts-ignore
    // var chart = Highcharts.chart('container', {
    //   chart: {
    //     type: 'column',
    //   },
    //   title: {
    //     text: '',
    //   },
    //   subtitle: {
    //     text: 'Counter, total booking, total estimate, total estimate',
    //   },
    //   xAxis: {
    //     categories: days,
    //     crosshair: true,
    //   },
    //   yAxis: {
    //     min: 0,
    //     title: {
    //       text: 'Total Count',
    //     },
    //   },
    //   tooltip: {
    //     headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    //     pointFormat:
    //       '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
    //       '<td style="padding:0"><b>{point.y}</b></td></tr>',
    //     footerFormat: '</table>',
    //     shared: true,
    //     useHTML: true,
    //   },
    //   plotOptions: {
    //     column: {
    //       pointPadding: 0.2,
    //       borderWidth: 0,
    //     },
    //   },
    //   series: graphData,
    // });
  console.log(graphData)
    this.chartOptions = {
      series: graphData,      
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: days
      },
      yaxis: {
        title: {
          text: "Total Count"
        },
        min: 0
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: string) {
            return  val;
          }
        }
      }
    };

  }


  openOnBoardModel() {
    this._dialog.open(OnboardPopupComponent, { width: '900px', height: '600px', data: { 'onBoardStatus': this.onBoardStatus, isEnableEdit: false }, disableClose: true })
  }

  getOnBoardStats() {
    this._dashboardService.GetOnBoardStatus()
      .subscribe({
        next: (res: { data: any[]; }) => {
          this.onBoardStatus = res.data;
          //console.log(this.onBoardStatus)
        },
        error: error => {
        }
      });
  }
}
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
