import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';
import { MasterService } from '@app/_services/master.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable, first } from 'rxjs';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent {
  profileInfo: any;
  profileForm!: FormGroup;
  submitted = false;
  noOfEmplyees: any;
  industries: any;

  message: string[] = [];

  previews: any = [];
  imageInfos?: Observable<any>;
  selectedFiles: FileList | any = null;
  progressInfos: any[] = [];
  apiBaseUrl: string = environment.apiUrl + '/';
  constructor(private _accountSettingService: AccountSettingService, private _router: Router, private formBuilder: FormBuilder, private _customerService: CustomerService, private _toastrService: ToastrService, private _masterService: MasterService, private _dialog: MatDialog) {

  }

  ngOnInit() {
    this.bindNoOFEmplyeeDDL();
    this.bindIndustriesDDL();
    this.profileForm = this.formBuilder.group({
      userId: ['', null],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailAddress: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      companyName: ['', [Validators.required, Validators.maxLength(200)]],
      noOfEmpInCompany: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      timezone: ['', null],
      subDomainName: ['', [Validators.required]],
      websiteUrl: ['', null],
      aboutCompany: ['', null],
      companyImagePath: ['', null],
      connectionStr: ['', null]
    });
    this.profileForm.controls['emailAddress'].disable();
    this.profileForm.controls['subDomainName'].disable();
    this.getProfileInfo();
  }

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  ngOnChanges() {

  }

  getProfileInfo() {
    this._accountSettingService.getProfileInfo()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.profileInfo = res.data;
          //console.log(this.profileInfo)
          this._accountSettingService.tenentProfileInfo.next(this.profileInfo);
          this.profileForm.patchValue(this.profileInfo);
          if (this.profileForm.controls['companyImagePath'].value != '') {
            var _data = {
              'filePath': this.apiBaseUrl + this.profileForm.controls['companyImagePath'].value,
              'index': 0
            }
            this.previews.push(_data);
          }
        },
        error: error => {
        }
      });
  }

  bindNoOFEmplyeeDDL() {
    this._masterService.getNoOFEmployee().subscribe(res => {
      this.noOfEmplyees = res.data;
     // console.log(this.noOfEmplyees)
    });
  }

  bindIndustriesDDL() {
    this._masterService.getIndustries().subscribe(res => {
      this.industries = res.data;
    });
  }

  selectFiles(event: any): void {
    this.previews = [];
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
      this.selectedFiles = null;
      this.submitted = false;
      this.profileForm.controls['companyImagePath'].setValue("");
      this._toastrService.error("Only png, jpeg, jpg extension files are allowed", "Error");
    }
  }

  removeServiceImage(index: number, uploadId: number) {
    //console.log(this.categoryServiceForm.value.categoryServiceId)
    const message = `Are you sure you want to remove?`;
    const dialogData = new ConfirmDialogModel("Confirmation", message);
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.profileForm.controls['companyImagePath'].setValue('');
        this.previews.splice(index, 1);
        this.selectedFiles = null;
      }
      else {
        return;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    var param = this.profileForm.getRawValue();
    if (this.profileForm.invalid) {
      return;
    }
    param = { ...param, ...{ file: this.selectedFiles } };
    const formData = new FormData();
   // console.log(param)
    formData.append('firstName', param.firstName);
    formData.append('lastName', param.lastName);
    formData.append('phoneNumber', param.phoneNumber);
    formData.append('companyName', param.companyName);
    formData.append('noOfEmpInCompany', param.noOfEmpInCompany);
    formData.append('industry', param.industry);
    formData.append('userId', param.userId);
    formData.append('websiteUrl', param.websiteUrl);
    formData.append('aboutCompany', param.aboutCompany);
    formData.append('companyImagePath', param.companyImagePath);
    formData.append('file', this.selectedFiles == null ? null : this.selectedFiles[0]);
    this._accountSettingService.updateProfile(formData)
      .subscribe(res => {
        this.submitted = false;
        this._toastrService.success(res.message, 'Success');
      });
  }
}
