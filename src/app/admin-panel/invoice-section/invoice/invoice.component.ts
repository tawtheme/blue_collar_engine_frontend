import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { InvoiceService } from '@app/_services/admin-panel/invoice/invoice.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  loading = false;
  items: any[] = [];
  pageOfItems?: Array<any>;
  sortProperty: string = 'id';
  sortOrder = 1;

  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageEvent: PageEvent | undefined;

  invoiceRagePickerForm!: FormGroup;
  constructor(private _router: Router, private _invoiceService: InvoiceService, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.invoiceRagePickerForm = this._formBuilder.group({
      start: [null, null],
      end: [null, null],
      searchStr: ['', null],
      status: ['', null]
    });
    this.getAll(this.bindSearchcParam());
  }

  getAll(param: any) {
    this.loading = true;
    this._invoiceService.getAll(param)
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
    this.getAll(this.bindSearchcParam());
  }

  checkAll(ev: any) {
    this.pageOfItems!.forEach(x => x.ischeck = ev.target.checked)
  }

  createInvoice() {
    this._router.navigate(['/admin/create-invoice']);
  }

  viewInvoice(invoiceId: number) {
    this._router.navigate(['/admin/create-invoice'], { queryParams: { invoiceId: invoiceId } })
  }

  onPageChanged(e: any) {
    var _param = this.bindSearchcParam();
    _param.pageNumber = e.pageIndex + 1,
      _param.pageSize = e.pageSize
    this.getAll(_param);
  }

  bindSearchcParam() {
    var _param = {
      "id": 0,
      "pageNumber": 1,
      "pageSize": this.pageSize,
      "searchStr": this.invoiceRagePickerForm.value.searchStr,
      "status": this.invoiceRagePickerForm.value.status,
      "startDate": this.invoiceRagePickerForm.value.start,
      "endDate": this.invoiceRagePickerForm.value.end,
    }
    return _param;
  }

  filterGrid() {
    this.getAll(this.bindSearchcParam())
  }

  rangeChangeEvent() {
    this.getAll(this.bindSearchcParam());
  }
}
