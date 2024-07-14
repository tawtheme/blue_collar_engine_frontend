import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { CategoryService } from '@app/_services/admin-panel/category/category.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { environment } from '@environments/environment';
import { first } from 'rxjs';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent {
  loading = false;
  items: any[] = [];
  data = [];
  pageOfItems?: Array<any>;
  sortProperty: string = 'id';
  sortOrder = 1;
  serviceItems: any[] = [];
  categoryInfo: any;
  categoryServiceInfo: any;
  activeCategory: number = 0;
  @ViewChild('catgeorySideBarEle') catgeorySideBarEle!: ElementRef<HTMLElement>;
  @ViewChild('catgeoryServiceSideBarEle') catgeoryServiceSideBarEle!: ElementRef<HTMLElement>;
  apiBaseUrl: string = environment.apiUrl + '/';
  constructor(private _categoryService: CategoryService, private _router: Router, private _dialog: MatDialog, private _snackBar: MatSnackBar) {
    
  }
  ngOnInit(): void {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this.getAll(_param);
    //this.getAllServices(_param);
    this._categoryService.editCategory.subscribe((data: number) => {
      if (data > 0) {
        this._categoryService.get(data).subscribe(res => {
          this.categoryInfo = res.data;
          let el: HTMLElement = this.catgeorySideBarEle.nativeElement;
          el.click();
        });
      }
    });

    this._categoryService.editCategoryService.subscribe((data: number) => {
      if (data > 0) {
        this._categoryService.getService(data).subscribe(res => {
          this.categoryServiceInfo = res.data;
          let el: HTMLElement = this.catgeoryServiceSideBarEle.nativeElement;
          el.click();
        });
      }
    });

    this._categoryService.categoryServiceAdded.subscribe((data: boolean) => {
      if (data) {
        this.getAll(_param);
      }
    });

    this._categoryService.categoryAdded.subscribe((data: boolean) => {
      if (data) {
        this.getAll(_param);
      }
    });
  }

  getAll(param: PaginationModel) {
    this.loading = true;
    this._categoryService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.items = res.data;
          if (this.items.length > 0) {
            this.activeCategory = this.items[0].categoryId;
          }
          ////////console.log(this.items)
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  getAllServices(param: PaginationModel) {
    this._categoryService.getAllServices(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.serviceItems = res.data;

          ////////console.log(this.serviceItems)
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  activeTab(categoryId: number) {
    this.activeCategory = categoryId;
  }

  editCategoryService(categoryServiceId: number) {
    this._categoryService.editCategoryService.next(categoryServiceId);
  }

  onChange(ev: any, service: any) {
    ev.source.checked = ev.checked == true ? false : true;
    const message = `Are you sure you want to change status?`;
    const dialogData = new ConfirmDialogModel("Confirmation", message);
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        ev.source.checked = ev.checked;
        var _param = {
          'serviceId': service.categoryServiceId,
          'status': service.isOnlineBooking == true ? false : true
        }
        this._categoryService.ChangeBookingStatus(_param).subscribe(res => {
          this._snackBar.open("Booking status has been changed successfully.",'Close');
          service.isOnlineBooking = (service.isOnlineBooking == true ? false : true);
          //this._categoryService.categoryServiceAdded.next(true);
        })
      }
      else {
        ev.source.checked = ev.checked == true ? false : true;
        return;
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

  openAddService() {
    this.categoryServiceInfo = null;
    let el: HTMLElement = this.catgeoryServiceSideBarEle.nativeElement;
    el.click();
  }

  openAddCategory() {
    this.categoryInfo = null;
    let el: HTMLElement = this.catgeorySideBarEle.nativeElement;
    el.click();
  }
}
