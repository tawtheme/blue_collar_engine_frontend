import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-tax-rate',
  templateUrl: './add-tax-rate.component.html',
  styleUrls: ['./add-tax-rate.component.scss']
})
export class AddTaxRateComponent {
  todayDate: Date = new Date();
  addTaxForm!: FormGroup;
  submitted: boolean = false;
  loading: boolean = true;
  @Input() items?: any;
  @ViewChild('addTaxCancelEle') addTaxCancelEle!: ElementRef<HTMLElement>;
  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, private _accountSettingService: AccountSettingService) { }


  ngOnInit(): void {
    this.addTaxForm = this._formBuilder.group({
      taxId: [0, null],
      name: ['', [Validators.required]],
      tax: ['', [Validators.required]],
      effectiveDate: ['', [Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.addTaxForm.controls; }

  ngOnChanges() {
    if(this.addTaxForm!=undefined){
      if (this.items != null) {
        this.addTaxForm.patchValue(this.items);
      }
      else {
        this.submitted=false;
        this.addTaxForm.reset();
        this.addTaxForm.controls['taxId'].setValue(0);
        this.addTaxForm.controls['name'].setValue('');
      }
    }  
  }
  
  onSubmit() {
    this.submitted = true;
    var param = this.addTaxForm.getRawValue();
    if (this.addTaxForm.invalid) {
      return;
    }
    //////console.log(param)
    this.loading = true;
    this._accountSettingService.addTenantTax(param).subscribe(res => {
      this.loading = false;
      //////console.log(res)
      let el: HTMLElement = this.addTaxCancelEle.nativeElement;
      el.click();
      this._snackBar.open(res.message);
      this._accountSettingService.tenantAddressAdded.next(true);
    });
  }
}
