import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { CategoryService } from '@app/_services/admin-panel/category/category.service';
import { EstimateService } from '@app/_services/admin-panel/estimate/estimate.service';
import { InvoiceService } from '@app/_services/admin-panel/invoice/invoice.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.scss']
})
export class EstimateComponent implements OnInit {
  loading = false;
  items: any[] = [];
  pageOfItems?: Array<any>;
  sortProperty: string = 'id';
  sortOrder = 1;
  productList: any = [];

  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 20, 50];
  pageEvent: PageEvent | undefined;

  estimateRagePickerForm!: FormGroup;
  stats:any;
  constructor(private _router: Router, private _estimateService: EstimateService, private _formBuilder: FormBuilder, private _invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.estimateRagePickerForm = this._formBuilder.group({
      start: [null, null],
      end: [null, null],
      searchStr: ['', null],
      status: ['', null]
    });
    this.getAll(this.bindSearchcParam());
    this.getStats();
  }
  createEstimate() {
    this._router.navigate(['/admin/create-estimate'])
  }

  getAll(param: any) {
    this.loading = true;
    this._estimateService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.items = res.data;
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  onEnter(str: any): void {
    var _param = this.bindSearchcParam();
    this.getAll(_param);
  }

  rangeChangeEvent() {
    if (this.estimateRagePickerForm.value.end == null) {
      return;
    }
    this.getAll(this.bindSearchcParam());
  }

  checkAll(ev: any) {
    //debugger
    this.items!.forEach(x => x.ischeck = ev.target.checked)
    //////////console.log(this.pageOfItems)
  }

  redirectToCreateEstimate(estimateId: number) {
    this._router.navigate(['/admin/create-estimate'], { queryParams: { estimateId: estimateId } })
  }

  onPageChanged(e: any) {
    var _param = this.bindSearchcParam();
    _param.pageNumber = e.pageIndex + 1,
      _param.pageSize = e.pageSize
    this.getAll(_param);
  }

  filterGrid() {
    this.getAll(this.bindSearchcParam())
  }

  bindSearchcParam() {
    var _param = {
      "id": 0,
      "pageNumber": 1,
      "pageSize": this.pageSize,
      "searchStr": this.estimateRagePickerForm.value.searchStr,
      "status": this.estimateRagePickerForm.value.status,
      "startDate": this.estimateRagePickerForm.value.start,
      "endDate": this.estimateRagePickerForm.value.end,
    }
    return _param;
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

  getStats() {
    this._invoiceService.getStats()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.stats = res.data;
          ////console.log(this.stats)
        },
        error: error => {
        }
      });
  }
}
