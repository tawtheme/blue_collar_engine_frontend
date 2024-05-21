import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { CategoryService } from '@app/_services/admin-panel/category/category.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
  loading = false;
  items: any[] = [];
  data = [];
  pageOfItems?: Array<any>;
  sortProperty: string = 'id';
  sortOrder = 1;
  constructor(private _categoryService: CategoryService, private _router: Router, private _dialog: MatDialog, private _toastrService: ToastrService) {

  }
  ngOnInit(): void {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this.getAll(_param);

    this._categoryService.categoryAdded.subscribe((data: boolean) => {
      if (data) {
        this.getAll(_param);
      }
    });
  }

  getAll(param: PaginationModel) {
    this._categoryService.getAll(param)
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
    //debugger
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

  editCategory(categoryId: number) {
    this._categoryService.editCategory.next(categoryId);
  }

  onChange(ev: any, category: any) {
    console.log(ev.checked)
    console.log(ev.source.checked)
    //debugger
    ev.source.checked = ev.checked == true ? false : true;
    const message = `Are you sure you want to change status?`;
    const dialogData = new ConfirmDialogModel("Confirmation", message);
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        var _param = {
          'categoryId': category.categoryId,
          'status': category.status == 'A' ? 'D' : 'A'
        }
        this._categoryService.ChangeStatus(_param).subscribe(res => {
          this._toastrService.success("Status has been changed successfully.", 'Success');          
          category.status = category.status == 'A' ? 'D' : 'A';
        })
      }
      else {
        ev.source.checked = ev.checked == true ? false : true;
        return;
      }
    });
  }

}
