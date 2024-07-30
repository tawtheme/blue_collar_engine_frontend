import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { MasterService } from '@app/_services/master.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { registerRendererType } from 'highcharts';


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
  // businessHoursArr: any[] = [{ id: 1, hour: '06:00 AM' }, { id: 2, hour: '07:00 AM' }, { id: 3, hour: '08:00 AM' }, { id: 4, hour: '09:00 AM' }, { id: 5, hour: '10:00 AM' }, { id: 6, hour: '11:00 AM' }, { id: 7, hour: '12:00 PM' }, { id: 8, hour: '01:00 PM' }, { id: 9, hour: '02:00 PM' }, { id: 10, hour: '03:00 PM' }, { id: 11, hour: '04:00 PM' }, { id: 12, hour: '05:00 PM' }, { id: 13, hour: '06:00 PM' }, { id: 14, hour: '07:00 PM' }, { id: 15, hour: '08:00 PM' }, { id: 16, hour: '09:00 PM' }, { id: 17, hour: '10:00 PM' }, { id: 18, hour: '11:00 PM' }, { id: 19, hour: '12:00 AM' }, { id: 20, hour: '01:00 AM' }, { id: 21, hour: '02:00 AM' }, { id: 22, hour: '03:00 AM' }, { id: 23, hour: '04:00 AM' }, { id: 24, hour: '05:00 AM' }];

  businessHoursArr: any[] = ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM'];

  constructor(private authenticationService: AuthenticationService, private _accountSettingService: AccountSettingService, private _masterService: MasterService, private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) {
    this.user = <any>this.authenticationService.userValue;
    ////////////console.log(this.user);
  }

  ngOnInit() {
    this._accountSettingService.tenentProfileInfo.subscribe(res => {
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

  newbusinessHours(dayId: number, index: number = 0): FormGroup {
    return this._formBuilder.group({
      businessHourId: [0],
      dayId: [dayId],
      openTime: ['', [Validators.required]],
      closeTime: ['', [Validators.required]],
      isDeleted: [false],
      hoursDDL: [this.businessHoursArr]
    })
  }

  add(empIndex: number, dayId: number, skillIndex: number) {
    this.businessHours(empIndex).push(this.newbusinessHours(dayId));
    // console.log(this.businessHours(empIndex).value)
    // var secondLastEle = this.businessHours(empIndex).value[this.businessHours(empIndex).value.length - 2];
    // var lastArrayEle = this.businessHours(empIndex).value.splice(-1)[0];
    // var index = secondLastEle.hoursDDL.indexOf(secondLastEle.closeTime);
    // if (index > -1) { // only splice array when item is found
    //   debugger
    //   //lastArrayEle.hoursDDL = [];
    //   lastArrayEle.hoursDDL = this.removeAllBefore(lastArrayEle.hoursDDL, index);
    //   console.log(lastArrayEle)
    // }
    // console.log(this.businessHours(empIndex))
  }

  removeAllBefore(array: any[], number: any) {
    var _data = array.splice(number, array.length - 1);
    return _data;
  }

  onChange(deviceValue: any) {
    console.log(deviceValue.target.value);
  }

  remove(empIndex: number, skillIndex: number) {
    const message = `Are you sure you want to delete?`;
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
      //console.log(res.data)
      res.data.forEach((day: any, index: any) => {
        this.days().push(this._formBuilder.group({
          dayId: [day.dayId],
          dayName: [day.dayName],
          isActive: [day.isActive],
          businessHours: this._formBuilder.array([])
        }));
        //console.log(day.businessHours)
        day.businessHours.forEach((value: any) => {
          //console.log(value)
          this.businessHours(index).push(this._formBuilder.group({
            businessHourId: [value.businessHourId],
            dayId: [value.dayId],
            openTime: [value.openTime],
            closeTime: [value.closeTime],
            isDeleted: [value.isDeleted],
            hoursDDL: [this.businessHoursArr]
          }));
        });
      });
      // console.log(res.data)
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
    var _errMsg = '';
    for (let i = 0; i < param.days.length; i++) {
      var _filteredDays = param.days[i].businessHours.filter(function (e: any) {
        return e.isDeleted == false;
      })
      if (this.isOverlapping(_filteredDays)) {
        _errMsg += param.days[i].dayName + ' hours are overlaped \n';
      }
    }
    if (_errMsg != '') {
      this._snackBar.open(_errMsg)
      return;
    }
    this._accountSettingService.addUpdateBusinessHours(param).subscribe(res => {
      this.loading = false;
      this._snackBar.open(res.message);
    });
  }

  overlapping = (a: any, b: any) => {
    return this.getMinutes(this.convertInto24Hours(a.closeTime)) > this.getMinutes(this.convertInto24Hours(b.openTime)) && this.getMinutes(this.convertInto24Hours(b.closeTime)) > this.getMinutes(this.convertInto24Hours(a.openTime));
  };

  convertInto24Hours(time: any) {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return sHours + ":" + sMinutes
  }

  getMinutes = (s: string) => {
    const p = s.split(':').map(Number);
    return p[0] * 60 + p[1];
  };

  isOverlapping = (arr: any[]) => {
    let i, j;
    for (i = 0; i < arr.length - 1; i++) {
      for (j = i + 1; j < arr.length; j++) {
        if (this.overlapping(arr[i], arr[j])) {
          return true;
        }
      };
    };
    return false;
  };
  onOpenTimeset(event: any) {
    //////////console.log(event);
  }

  onCloseTimeset(event: any) {
    //////////console.log(event);
  }
}
