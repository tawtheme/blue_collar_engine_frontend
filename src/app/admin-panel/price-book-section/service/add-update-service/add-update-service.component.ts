import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { CategoryService } from '@app/_services/admin-panel/category/category.service';
import { UploadService } from '@app/_services/admin-panel/upload/upload.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable, first, map } from 'rxjs';

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

  previews: any = [];
  imageInfos?: Observable<any>;
  selectedFiles: FileList | any = null;
  progressInfos: any[] = [];
  apiBaseUrl: string = environment.apiUrl + '/';
  constructor(private formBuilder: FormBuilder, private _categoryService: CategoryService, private _router: Router, private _toastrService: ToastrService, private _dialog: MatDialog, private _uploadService: UploadService) {
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
      categoryId: ['', Validators.required],
      serviceName: ['', [Validators.required]],
      price: ['0', [Validators.required]],
      cost: ['0', [Validators.required]],
      description: ['', null],
      status: ['A', null],
      isOnlineBooking: [true, [Validators.required]],
      files: ['', [Validators.required]]
    });

    this._categoryService.categoryAdded.subscribe((data: boolean) => {
      if (data) {
        var _param = {
          "id": 0,
          "pageNumber": 0,
          "pageSize": 0,
          "searchStr": ""
        }
        this.getAllCatgeory(_param);
      }
    });
  }

  ngOnChanges() {
    this.previews = [];
    this.selectedFiles = null;
    this.categoryServiceForm.patchValue(this.items);
    if (this.items == null) {
      this.categoryServiceForm.reset();
      this.categoryServiceForm.controls['categoryServiceId'].setValue(0);
      this.categoryServiceForm.controls['categoryId'].setValue('');
      this.categoryServiceForm.controls['isOnlineBooking'].setValue(true);
      this.categoryServiceForm.controls['files'].setValue("");
      this.categoryServiceForm.controls['files'].addValidators([Validators.required]);
      this.categoryServiceForm.controls['files'].updateValueAndValidity();
      return;
    }
    if (this.items.uploadedFiles.length > 0) {
      for (let i = 0; i < this.items.uploadedFiles.length; i++) {
        var _data = {
          'filePath': this.apiBaseUrl + this.items.uploadedFiles[i].filePath,
          'index': i,
          'uploadId': this.items.uploadedFiles[i].uploadId
        }
        this.previews.push(_data);
        this.categoryServiceForm.controls['files'].clearValidators();
        this.categoryServiceForm.controls['files'].updateValueAndValidity();
      }
    }
    else {
      this.submitted = true;
      this.categoryServiceForm.controls['files'].setValue("");
      this.categoryServiceForm.controls['files'].addValidators([Validators.required]);
      this.categoryServiceForm.controls['files'].updateValueAndValidity();
    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.categoryServiceForm.controls; }

  onSubmit() {
    this.submitted = true;
    let param = this.categoryServiceForm.value as any;
    param = { ...param, ...{ files: this.selectedFiles } };
    const formData = new FormData();
    formData.append('categoryServiceId', param.categoryServiceId);
    formData.append('categoryId', param.categoryId);
    formData.append('serviceName', param.serviceName);
    formData.append('price', param.price);
    formData.append('cost', param.cost);
    formData.append('description', param.description);
    formData.append('status', param.status);
    formData.append('isOnlineBooking', param.isOnlineBooking);
    formData.append('files', this.selectedFiles == null ? null : this.selectedFiles[0]);
    this.loading = true;
    if (this.categoryServiceForm.invalid) {
      return;
    }
    this._categoryService.addUpdateService(formData)
      .subscribe(res => {
        this.loading = false;
        console.log(res)
        let el: HTMLElement = this.customerCancelEle.nativeElement;
        el.click();
        this._toastrService.success(res.message, 'Success');
        this._categoryService.categoryServiceAdded.next(true);
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
    var _type = this.selectedFiles[0].type;
    if (_type == 'image/jpeg' || _type == 'image/png' || _type == 'image/jpg') {
      //this.previews = [];
      if (this.selectedFiles && this.selectedFiles[0]) {
        const numberOfFiles = this.selectedFiles.length;
        for (let i = 0; i < numberOfFiles; i++) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            var _data = {
              'filePath': e.target.result,
              'index': i,
              'uploadId': 0
            }
            this.previews.push(_data);
          };
          reader.readAsDataURL(this.selectedFiles[i]);
        }
      }
    }
    else {
      debugger
      this.selectedFiles = null;
      this.submitted = false;
      this.categoryServiceForm.controls['files'].setValue("");
      this._toastrService.error("Only png, jpeg, jpg extension files are allowed", "Error");
    }
  }

  removeServiceImage(index: number, uploadId: number) {
    console.log(this.categoryServiceForm.value.categoryServiceId)
    const message = `Are you sure you want to remove?`;
    const dialogData = new ConfirmDialogModel("Confirmation", message);
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (this.categoryServiceForm.value.categoryServiceId > 0 && uploadId > 0) {
          //this.previews.splice(index, 1);          
          console.log('uploadId :' + uploadId)
          var _param = {
            'uploadId': uploadId,
            'status': 'D'
          }
          this._uploadService.changeStatus(_param).subscribe(res => {
            this._toastrService.success("Service Image has been deleted successfully.", 'Success');
            this._categoryService.categoryServiceAdded.next(true);
          })
        }
        else {
          this.submitted = false;
          this.previews.splice(index, 1);
          this.selectedFiles = null;
          this.categoryServiceForm.controls['files'].setValue("");
        }
      }
      else {
        debugger
        return;
      }
    });
  }
}
