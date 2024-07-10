import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { MasterService } from '@app/_services/master.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable, first } from 'rxjs';

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss']
})
export class AddTeamMemberComponent {
  userForm!: FormGroup;
  submitted = false;
  loading = false;
  @Input() items?: any;
  @ViewChild('addTeamMemberEle') addTeamMemberEle!: ElementRef<HTMLElement>;

  previews: any = [];
  imageInfos?: Observable<any>;
  selectedFiles: FileList | any = null;
  message: string[] = [];
  progressInfos: any[] = [];
  apiBaseUrl: string = environment.apiUrl + '/';
  states:any[]=[];
  constructor(private _accountSettingService: AccountSettingService, private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private _dialog: MatDialog, private _masterService: MasterService) {

  }
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      teamId: [0, null],
      userId: ['', null],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      mobileNo: ['', [Validators.required]],
      alternateNo: ['', null],
      emailAddress: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      latitude: ['', null],
      longitude: ['', null],
      status: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      profileImagePath: ['', null],
    });
     this.getAllStates();
  }
  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }

  ngOnChanges() {
    this.previews = [];
    if (this.userForm != undefined) {
      if (this.items != null) {
        ////console.log(this.items)
        this.userForm.patchValue(this.items);
        this.userForm.controls['mobileNo'].disable();
        this.userForm.controls['emailAddress'].disable();
        ////console.log(this.userForm.controls['profileImagePath'].value)
        if (this.userForm.controls['profileImagePath'].value != '' && this.userForm.controls['profileImagePath'].value != null) {
          var _data = {
            'filePath': this.userForm.controls['profileImagePath'].value,
            'index': 0
          }
          this.previews.push(_data);
        }
      }
      else {
        this.submitted = false;
        this.userForm.reset();
        this.userForm.controls['teamId'].setValue(0);
        this.userForm.controls['userId'].setValue('');
        this.userForm.controls['state'].setValue('');
        this.userForm.controls['designation'].setValue('');
        this.userForm.controls['status'].setValue('A');
        this.userForm.controls['mobileNo'].enable();
        this.userForm.controls['emailAddress'].enable();
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    var param = this.userForm.getRawValue();
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    param = { ...param, ...{ mobileNo: param.mobileNo.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, ''), alternateNo: param.alternateNo != null && param.alternateNo != '' ? param.alternateNo.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, '') : '', file: this.selectedFiles } };
   // //console.log(param)
    //return;
    const formData = new FormData();
    formData.append('teamId', param.teamId);
    formData.append('userId', param.userId);
    formData.append('firstName', param.firstName);
    formData.append('lastName', param.lastName);
    formData.append('mobileNo', param.mobileNo);
    formData.append('alternateNo', param.alternateNo);
    formData.append('emailAddress', param.emailAddress);
    formData.append('address', param.address);
    formData.append('city', param.city);
    formData.append('state', param.state);
    formData.append('zipCode', param.zipCode);
    formData.append('latitude', param.latitude);
    formData.append('longitude', param.longitude);
    formData.append('status', param.status);
    formData.append('designation', param.designation);
    formData.append('profileImagePath', param.profileImagePath);
    formData.append('file', this.selectedFiles == null ? null : this.selectedFiles[0]);
    this._accountSettingService.addUpdateUser(formData).subscribe({
      next: res => {
        this.submitted = false;
        this.loading = false;
        this._snackBar.open(res.message);
        this._accountSettingService.userAdded.next(true);
        let el: HTMLElement = this.addTeamMemberEle.nativeElement;
        el.click();
      },
      error: error => {
        this.loading = false;
      }
    })
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
      this.userForm.controls['companyImagePath'].setValue("");
      this._snackBar.open("Only png, jpeg, jpg extension files are allowed", "Error");
    }
  }

  removeServiceImage(index: number, uploadId: number) {
    //////console.log(this.categoryServiceForm.value.categoryServiceId)
    const message = `Are you sure you want to remove?`;
    const dialogData = new ConfirmDialogModel("Confirmation", message);
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.userForm.controls['companyImagePath'].setValue('');
        this.previews.splice(index, 1);
        this.selectedFiles = null;
      }
      else {
        return;
      }
    });
  }

  getAllStates() {
    this._masterService.getStates()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.states = res.data;
        },
        error: error => {
        }
      });
  }
}
