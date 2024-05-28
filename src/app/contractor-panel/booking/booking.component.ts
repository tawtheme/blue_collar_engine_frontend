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

  public products = new Subject();
  @ViewChild('openBookingModalEle') openBookingModalEle!: ElementRef<HTMLElement>;
  constructor(private authenticationService: AuthenticationService, private _categoryService: CategoryService, private _router: Router, private _dialog: MatDialog, private _toastrService: ToastrService, private _bookingSharedService: BookingSharedService) {
    this.tenantInfo = <any>this.authenticationService.tenantValue;
    this.user = <any>this.authenticationService.userValue;
    this.baseUrl = environment.apiUrl;
    console.log(this.tenantInfo)
    console.log(this.user)
  }

  ngOnInit(): void {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this.getAll(_param);
    this._bookingSharedService.getProducts().subscribe(res => {
      if (res.length > 0) {
        this.isEnableNextBtn = true;
      }
      else {
        this.isEnableNextBtn = false;
      }
    });
  }

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
          console.log(this.isAdded)
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  activeTab(categoryId: number) {
    this.activeCategory = categoryId;
  }

  addToCart(event: any, serviceId: number) {
    // If Item is already added then display alert message
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
            console.log(j)
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
}
