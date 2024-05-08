import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { EstimateService } from '@app/_services/admin-panel/estimate/estimate.service';
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
  constructor(private _router: Router, private _estimateService: EstimateService) { }

  ngOnInit(): void {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this.getAll(_param);
  }
  createEstimate() {
    this._router.navigate(['/admin/create-estimate'])
  }


  getAll(param: PaginationModel) {
    this._estimateService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.items = res.data;
          console.log(this.items)
        },
        error: error => {
          this.loading = false;
        }
      });
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
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": str.target.value
    }
    this.getAll(_param);
  }
  checkAll(ev: any) {
    this.pageOfItems!.forEach(x => x.ischeck = ev.target.checked)
    console.log(this.pageOfItems)
  }

  redirectToCreateEstimate(estimateId: number) {
    this._router.navigate(['/admin/create-estimate'], { queryParams: { estimateId: estimateId } })
  }
}
