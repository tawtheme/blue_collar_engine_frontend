import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { MasterService } from '@app/_services/master.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';

@Component({
  selector: 'app-business-hours',
  templateUrl: './business-hours.component.html',
  styleUrls: ['./business-hours.component.scss']
})
export class BusinessHoursComponent {
  exportTime = { hour: 7, minute: 15, meriden: "PM", format: 24 };
  timeZone: string = '';
  user: User;
  timezones: any = [];
  businessHoursDays: any[] = [];
  businessHourForm!: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  preLoading: boolean = false;
  minTime: string = '';
  maxTime: string = '';

  constructor(private authenticationService: AuthenticationService, private _accountSettingService: AccountSettingService, private _masterService: MasterService, private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) {
    this.user = <any>this.authenticationService.userValue;
    ////console.log(this.user);
  }

  ngOnInit() {
    this._accountSettingService.tenentProfileInfo.subscribe(res => {
      ////console.log(res);
      this.timeZone = res.timezone;
    });
    this.bindTimeZonesDDL();
    this.bindBusinessHoursDaysDDL();
    this.businessHourForm = this._formBuilder.group({
      days: this._formBuilder.array([])
    });
  }

  get f() { return this.businessHourForm.controls; }

  days(): FormArray {
    return this.businessHourForm.get('days') as FormArray;
  }

  day(): FormGroup {
    return this._formBuilder.group({
      dayId: [''],
      dayName: [''],
      isActive: [''],
      businessHours: this._formBuilder.array([])
    });
  }

  businessHours(empIndex: number): FormArray {
    return this.days().at(empIndex).get("businessHours") as FormArray;
  }

  newbusinessHours(dayId: number): FormGroup {
    return this._formBuilder.group({
      businessHourId: [0],
      dayId: [dayId],
      openTime: ['', [Validators.required]],
      closeTime: ['', [Validators.required]],
      isDeleted: [false]
    })
  }

  add(empIndex: number, dayId: number) {
    this.businessHours(empIndex).push(this.newbusinessHours(dayId));
  }

  remove(empIndex: number, skillIndex: number) {
    const message = `Are you sure you want to do delete?`;
    const dialogData = new ConfirmDialogModel("Confirmation", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if ((this.businessHours(empIndex).at(skillIndex).get('openTime')?.value == '' || this.businessHours(empIndex).at(skillIndex).get('closeTime')?.value == '')) {
          this.businessHours(empIndex).removeAt(skillIndex);
        }
        else {
          this.businessHours(empIndex).at(skillIndex).get('isDeleted')?.setValue(true);
        }
      }
      else {
        return;
      }
    });
  }

  bindTimeZonesDDL() {
    this._masterService.getTimeZones().subscribe(res => {
      this.timezones = res.data;
    });
  }

  bindBusinessHoursDaysDDL() {
    this.preLoading = true;
    this._accountSettingService.getBusinessHoursDays().subscribe(res => {
      this.preLoading = false;
      res.data.forEach((day: any, index: any) => {
        this.days().push(this._formBuilder.group({
          dayId: [day.dayId],
          dayName: [day.dayName],
          isActive: [day.isActive],
          businessHours: this._formBuilder.array([])
        }));
        day.businessHours.forEach((value: any) => {
          this.businessHours(index).push(this._formBuilder.group({
            businessHourId: [value.businessHourId],
            dayId: [value.dayId],
            openTime: [value.openTime],
            closeTime: [value.closeTime],
            isDeleted: [value.isDeleted],
          }));
        });
      });
      this.businessHourForm.patchValue(res.data);
    });
  }

  onSubmit() {
    this.submitted = true;
    var param = this.businessHourForm.value;
    if (this.businessHourForm.invalid) {
      return;
    }
    this.loading = true;
    //console.log(JSON.stringify(param))
    this._accountSettingService.addUpdateBusinessHours(param).subscribe(res => {
      this.loading = false;
      this._snackBar.open(res.message);          
    });
  }
  onOpenTimeset(event: any) {
    //console.log(event);
  }

  onCloseTimeset(event: any) {
    //console.log(event);
  }
}
