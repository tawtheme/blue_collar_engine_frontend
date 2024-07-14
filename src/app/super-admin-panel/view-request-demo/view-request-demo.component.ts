import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from '@app/_services/master.service';
import { RequestDemoService } from '@app/_services/secure-panel/request-demo.service';
import { TenantService } from '@app/_services/secure-panel/tenant.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';

@Component({
  selector: 'app-view-request-demo',
  templateUrl: './view-request-demo.component.html',
  styleUrls: ['./view-request-demo.component.scss']
})
export class ViewRequestDemoComponent {
  @Input() items?: any;
  requestDemoForm!: FormGroup;
  loading = false;
  submitted = false;

  noOfEmplyees: any = [];
  industries: any = [];
  hereAboutUs: any = [];
  timezones: any = [];
  IsShwoButtonPanel: boolean = false;
  @ViewChild('customerCancelEle') customerCancelEle!: ElementRef<HTMLElement>;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _masterService: MasterService, private _requestDemoService: RequestDemoService, private _snackBar: MatSnackBar, private _tenantService: TenantService) {
    this.bindNoOFEmplyeeDDL();
    this.bindIndustriesDDL();
    this.bindHereAboutUsDDL();
    this.bindTimeZonesDDL();
  }

  ngOnInit(): void {
    this.requestDemoForm = this.formBuilder.group({
      requestId: ['', null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]{10}')]],
      emailAddress: ['', [Validators.required]],
      companyName: ['', Validators.required],
      timeZone: ['', Validators.required],
      noOfEmpInCompany: ['', Validators.required],
      industry: ['', Validators.required],
      howHearAboutUs: ['', Validators.required],
      subDomainName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]]
    });
    this.requestDemoForm.controls['firstName'].disable();
    this.requestDemoForm.controls['lastName'].disable();
    this.requestDemoForm.controls['emailAddress'].disable();
    this.requestDemoForm.controls['phoneNumber'].disable();
    this.requestDemoForm.controls['companyName'].disable();
    this.requestDemoForm.controls['timeZone'].disable();
    this.requestDemoForm.controls['noOfEmpInCompany'].disable();
    this.requestDemoForm.controls['industry'].disable();
    this.requestDemoForm.controls['howHearAboutUs'].disable();
    this.requestDemoForm.controls['phoneNumber'].disable();
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
      //////console.log(this.timezones)
      this.loading = false;
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.requestDemoForm.invalid) {
      return;
    }
    this.loading = true;
    let param = this.requestDemoForm.value as any;
    Object.assign(param, { status: 'A' });
    this._tenantService.convertToTenant(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          let el: HTMLElement = this.customerCancelEle.nativeElement;
          el.click();
          this._snackBar.open(res.message, 'Close');
          this._requestDemoService.subDomainAdded.next(true);
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  ngOnChanges() {
    //////console.log(this.items)
    this.requestDemoForm.patchValue(this.items);
    //////console.log(this.requestDemoForm.value.subDomainName)
    if (this.items.subDomainName != null) {
      this.requestDemoForm.controls['subDomainName'].disable();
      this.IsShwoButtonPanel = false;
    }
    else {
      this.requestDemoForm.controls['subDomainName'].enable();
      this.IsShwoButtonPanel = true;
    }
  }
}
