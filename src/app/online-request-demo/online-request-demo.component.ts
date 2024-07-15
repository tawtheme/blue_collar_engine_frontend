import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { MasterService } from '@app/_services/master.service';
import { RequestDemoService } from '@app/_services/secure-panel/request-demo.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';

@Component({
  selector: 'app-online-request-demo',
  templateUrl: './online-request-demo.component.html',
  styleUrls: ['./online-request-demo.component.scss']
})
export class OnlineRequestDemoComponent implements OnInit {
  requestDemoForm!: FormGroup;
  loading = false;
  submitted = false;

  noOfEmplyees: any = [];
  industries: any = [];
  hereAboutUs: any = [];
  timezones: any = [];
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _masterService: MasterService, private _requestDemoService: RequestDemoService, private _snackBar: MatSnackBar) {
    this.bindNoOFEmplyeeDDL();
    this.bindIndustriesDDL();
    this.bindHereAboutUsDDL();
    this.bindTimeZonesDDL();
  }

  ngOnInit(): void {
    this.requestDemoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required]],
      emailAddress: ['', [Validators.required]],
      companyName: ['', Validators.required],
      timeZone: ['', Validators.required],
      noOfEmpInCompany: ['', Validators.required],
      industry: ['', Validators.required],
      howHearAboutUs: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.requestDemoForm.controls; }

  bindNoOFEmplyeeDDL() {
    this._masterService.getNoOFEmployee().subscribe(res => {
      this.noOfEmplyees = res.data;
      this.loading = false;
    });
  }

  bindIndustriesDDL() {
    this._masterService.getIndustries().subscribe(res => {
      this.industries = res.data;
      this.loading = false;
    });
  }

  bindHereAboutUsDDL() {
    this._masterService.getHearAboutUs().subscribe(res => {
      this.hereAboutUs = res.data;
      this.loading = false;
    });
  }

  bindTimeZonesDDL() {
    this._masterService.getTimeZones().subscribe(res => {
      this.timezones = res.data;
      this.loading = false;
    });
  }
  onSubmit() {
    this.submitted = true;
    var _mobileNo = this.requestDemoForm.controls['phoneNumber'].value.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, '');
    var _param = this.requestDemoForm.value;
    _param = { ..._param, ...{ phoneNumber: _mobileNo } };
    //////////console.log(_param)
    if (this.requestDemoForm.invalid) {
      return;
    }

    this.loading = true;
    this._requestDemoService.saveRequestDemo(_param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.requestDemoForm.reset();
          this.requestDemoForm.controls['noOfEmpInCompany'].setValue('');
          this.requestDemoForm.controls['industry'].setValue('');
          this.requestDemoForm.controls['howHearAboutUs'].setValue('');
          this.requestDemoForm.controls['timeZone'].setValue('');
          this.submitted = false;
          this._snackBar.open(res.message);
        },
        error: error => {
          this.loading = false;
        }
      });
  }

}
