import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestDemoService } from '@app/_services/secure-panel/request-demo.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { first } from 'rxjs';

@Component({
  selector: 'app-request-demo',
  templateUrl: './request-demo.component.html',
  styleUrls: ['./request-demo.component.scss']
})
export class RequestDemoComponent implements OnInit {
  requestDemo: any = [];
  loading = true;
  pageOfItems?: Array<any>;
  sortProperty: string = 'requestId';
  sortOrder = 1;
  requestDemoInfo: any;
  @ViewChild('clickRqtDemoDetail') clickRqtDemoDetail!: ElementRef<HTMLElement>;

  constructor(private _requestDemoService: RequestDemoService, public _dialog: MatDialog) {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this.bindGrid(_param);
  }

  ngOnInit(): void {
    this._requestDemoService.subDomainAdded.subscribe((data: boolean) => {
      if (data) {
        var _param = {
          "id": 0,
          "pageNumber": 0,
          "pageSize": 0,
          "searchStr": ""
        }
        this.bindGrid(_param);
      }
    });
  }

  bindGrid(param: any) {
    this._requestDemoService.getDemoRequested(param).subscribe(res => {
      this.requestDemo = res.data;
      ////console.log(this.requestDemo)
      this.loading = false;
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
    this.requestDemo = [...this.requestDemo.sort((a: any, b: any) => {
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
    this.bindGrid(_param);
  }

  onChange(ev: any) {
    if (ev.checked) {
      ev.source.checked = false;
    }
    else {
      ev.source.checked = true;
    }
  }

  viewDetail(requestDemoInfo: any) {
    this.requestDemoInfo = requestDemoInfo;
    let el: HTMLElement = this.clickRqtDemoDetail.nativeElement;
    el.click();
  }
}
