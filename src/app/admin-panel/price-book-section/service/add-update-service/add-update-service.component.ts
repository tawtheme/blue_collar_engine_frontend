import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { CategoryService } from '@app/_services/admin-panel/category/category.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, first } from 'rxjs';

@Component({
  selector: 'app-add-update-service',
  templateUrl: './add-update-service.component.html',
  styleUrls: ['./add-update-service.component.scss']
})
export class AddUpdateServiceComponent {
  @Input() items?: any;
  categoryServiceForm!: FormGroup;
  loading = false;
  submitted = false;

  categories: any = [];
  @ViewChild('customerCancelEle') customerCancelEle!: ElementRef<HTMLElement>;

  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  constructor(private formBuilder: FormBuilder, private _categoryService: CategoryService, private _router: Router, private _toastrService: ToastrService) {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this.getAllCatgeory(_param);
  }

  ngOnInit(): void {
    this.categoryServiceForm = this.formBuilder.group({
      categoryServiceId: [0, null],
      categoryId: [0, Validators.required],
      serviceName: ['', [Validators.required]],
      price: ['0', [Validators.required]],
      cost: ['0', [Validators.required]],
      description: ['', null],
      status: ['A', null],
      isOnlineBooking: [true, [Validators.required]]
    });

  }
  ngOnChanges() {
    console.log(this.items)
    this.categoryServiceForm.patchValue(this.items);
  }
  // convenience getter for easy access to form fields
  get f() { return this.categoryServiceForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.categoryServiceForm.invalid) {
      return;
    }
    let param = this.categoryServiceForm.value as any;
    param = { ...param, ...{ files: this.selectedFiles } };
    console.log(JSON.stringify(param));

    // let formData: FormData = new FormData();
    // formData.append('pfile', file);
    // formData.append('paramh', this.token);
    // formData.append('pkuserid', this.userID);


    this.loading = true;
    this._categoryService.addUpdateService(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res)
          let el: HTMLElement = this.customerCancelEle.nativeElement;
          el.click();
          this._toastrService.success(res.message, 'Success');
          this._categoryService.categoryAdded.next(true);
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  getAllCatgeory(param: PaginationModel) {
    this._categoryService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.categories = res.data;
          console.log(this.items)
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }
}
