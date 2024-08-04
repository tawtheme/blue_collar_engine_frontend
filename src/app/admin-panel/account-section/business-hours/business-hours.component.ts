import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { MasterService } from '@app/_services/master.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';

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
  businessHoursArr: any[] = ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM'];
  isDisabled: boolean = true;
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
      openTime: ['' ],
      closeTime: [''],
      isDeleted: [false],
      hoursDDL: [this.businessHoursArr]
    })
  }

  add(empIndex: number, dayId: number, skillIndex: number) {
    this.businessHours(empIndex).push(this.newbusinessHours(dayId));
  }

  removeAllBefore(array: any[], number: any) {
    var _data = array.splice(number, array.length - 1);
    return _data;
  }

  onOpenTimeChange(deviceValue: any) {
    console.log(deviceValue.target.value);
  }

  onCloseTimeChange(index: number, subIndex: number) {
    var row = this.businessHours(index).controls[subIndex];
    // if (row.value.openTime === row.value.closeTime) {
    //   this.businessHours(index).controls[subIndex].get('closeTime')?.setValue('')
    //   this._snackBar.open("Close time is not same as open time");
    //   return;
    // }
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
            openTime: [value.openTime,[Validators.required]],
            closeTime: [value.closeTime,[Validators.required]],
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
    var _errMsgDay = [];
    for (let i = 0; i < param.days.length; i++) {
      var _filteredDays = param.days[i].businessHours.filter(function (e: any) {
        return e.isDeleted == false;
      })
      //console.log(_filteredDays)
      if(_filteredDays.length==1){
        if(_filteredDays[0].openTime===_filteredDays[0].closeTime){
          this._snackBar.open("Open and close time should not be same.");
          return;
        }
        // console.log(this.getMinutes(this.convertInto24Hours(_filteredDays[0].openTime)))
        // console.log(this.getMinutes(this.convertInto24Hours(_filteredDays[0].closeTime)))
        // if(this.getMinutes(this.convertInto24Hours(_filteredDays[0].openTime)) > this.getMinutes(this.convertInto24Hours(_filteredDays[0].closeTime))){
        //   this._snackBar.open("Close time should not be greater than open time.");
        //   return;
        // }
      }
      if (this.isOverlapping(_filteredDays)) {
        _errMsgDay.push(param.days[i].dayName);
      }
    }
    if (_errMsgDay.length > 0) {
      this._snackBar.open(_errMsgDay.join(', ') + ' hours are overlaped. Please correct.')
      return;
    }
    this._accountSettingService.addUpdateBusinessHours(param).subscribe(res => {
      this.loading = false;
      this._snackBar.open(res.message);
    });
  }

  overlapping = (a: any, b: any) => {
    //debugger
    // console.log('a open time :' + this.getMinutes(this.convertInto24Hours(a.openTime)))
    // console.log('b close time :' + this.getMinutes(this.convertInto24Hours(a.closeTime)))
    // console.log('b open time :' + this.getMinutes(this.convertInto24Hours(b.openTime)))
    // console.log('b close time :' + this.getMinutes(this.convertInto24Hours(b.closeTime)))
    return (this.getMinutes(this.convertInto24Hours(a.closeTime)) > this.getMinutes(this.convertInto24Hours(b.openTime)) && this.getMinutes(this.convertInto24Hours(b.closeTime)) > this.getMinutes(this.convertInto24Hours(a.openTime))) || (this.getMinutes(this.convertInto24Hours(b.openTime)) == this.getMinutes(this.convertInto24Hours(b.closeTime))) || (this.getMinutes(this.convertInto24Hours(a.openTime)) == this.getMinutes(this.convertInto24Hours(a.closeTime)));
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
