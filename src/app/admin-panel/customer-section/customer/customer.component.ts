import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';
import { TagInputModule } from 'ngx-chips';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, debounce, first } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  loading = false;
  items: any[] = [];
  data = [];
  pageOfItems?: Array<any>;
  sortProperty: string = 'id';
  sortOrder = 1;

  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageEvent: PageEvent | undefined;
  customerStats: any;
  constructor(private _customerService: CustomerService, private _router: Router) {

  }

  async ngOnInit(): Promise<void> {
    var _param = {
      "id": 0,
      "pageNumber": 1,
      "pageSize": this.pageSize,
      "searchStr": ""
    }
    this.getAll(_param);
   this.getCustomerStats();
    this._customerService.customerAdded.subscribe((data: boolean) => {
      if (data) {
        this.getAll(_param);
      }
    });
  }

  getAll(param: PaginationModel) {
    this.loading = true;
    this._customerService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.items = res.data;
        //  console.log(this.items)
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  redirectToCustomerDetail(customerId: number) {
    this._router.navigate(['/admin/customer-detail'], { queryParams: { customerId: customerId } })
  }

  onChangePage(pageOfItems: any) {
    // update current page of items
    this.pageOfItems = pageOfItems;
    // this.pageOfItems = { ...this.pageOfItems!, ...{ ischeck: false } };
  }

  sortBy(property: string) {
    this.sortOrder = property === this.sortProperty ? (this.sortOrder * -1) : 1;
    this.sortProperty = property;
    this.items = [...this.items.sort((a: any, b: any) => {
      // sort comparison function
      let result = 0;
      if (a[property] < b[property]) {
        result = -1;
      }
      if (a[property] > b[property]) {
        result = 1;
      }
      return result * this.sortOrder;
    })];
  }

  sortIcon(property: string) {
    if (property === this.sortProperty) {
      return this.sortOrder === 1 ? '☝️' : '👇';
    }
    return '';
  }

  onEnter(str: any): void {
    var _param = {
      "id": 0,
      "pageNumber": 1,
      "pageSize": this.pageSize,
      "searchStr": str.target.value
    }
    this.getAll(_param);
  }

  checkAll(ev: any) {
    this.pageOfItems!.forEach(x => x.ischeck = ev.target.checked)
    //console.log(this.pageOfItems)
  }

  onPageChanged(e: any) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    var _param = {
      "id": 0,
      "pageNumber": e.pageIndex + 1,
      "pageSize": e.pageSize,
      "searchStr": ""
    }
    this.getAll(_param);
  }

  onChange(ev: any) {
    if (ev.checked) {
      ev.source.checked = false;
    }
    else {
      ev.source.checked = true;
    }
  }

  getCustomerStats() {
    this._customerService.getCustomerStats(0)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.customerStats = res.data;
          //console.log(this.customerStats)
        },
        error: error => {
        }
      });
  }


}
