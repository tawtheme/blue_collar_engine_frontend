import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '@app/_services/admin-panel/category/category.service';

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

  categoryInfo: any;
  @ViewChild('catgeorySideBarEle') catgeorySideBarEle!: ElementRef<HTMLElement>;
  constructor(private _categoryService: CategoryService, private _router: Router) {

  }
  ngOnInit(): void {
    // var _param = {
    //   "id": 0,
    //   "pageNumber": 0,
    //   "pageSize": 0,
    //   "searchStr": ""
    // }
    // this.getAll(_param);

    this._categoryService.editCategory.subscribe((data: number) => {
      if (data > 0) {
        this._categoryService.get(data).subscribe(res => {
          this.categoryInfo = res.data;
          let el: HTMLElement = this.catgeorySideBarEle.nativeElement;
          el.click();
        });
      }
    });
  }
}
