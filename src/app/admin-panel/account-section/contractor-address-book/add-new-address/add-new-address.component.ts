import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';
import { MasterService } from '@app/_services/master.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';

@Component({
  selector: 'app-add-new-address',
  templateUrl: './add-new-address.component.html',
  styleUrls: ['./add-new-address.component.scss']
})
export class AddNewAddressComponent {
  addressForm!: FormGroup;
  submitted = false;
  loading = false;
  @Input() items?: any;
  @ViewChild('addNewAddressCancelEle') addNewAddressCancelEle!: ElementRef<HTMLElement>;
  constructor(private _accountSettingService: AccountSettingService, private formBuilder: FormBuilder, private _snackBar: MatSnackBar) {

  }
  ngOnInit() {
    this.addressForm = this.formBuilder.group({
      tenantAddressId: [0, null],
      tenantId: [0, null],
      addressLabel: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5,6}')]],
      latitude: ['', null],
      longitude: ['', null],
      isDefault: [true, null]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.addressForm.controls; }

  ngOnChanges() {
    if (this.addressForm != undefined) {
      if (this.items != null) {
       // //console.log(this.items)
        this.addressForm.patchValue(this.items);
        this.addressForm.controls['isDefault'].setValue(this.items?.isDefault);
      }
      else {
        this.submitted = false;
        this.addressForm.reset();
        this.addressForm.controls['tenantAddressId'].setValue(0);
        this.addressForm.controls['tenantId'].setValue(0);
        this.addressForm.controls['state'].setValue('');
        this.addressForm.controls['isDefault'].setValue(false);
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    var param = this.addressForm.getRawValue();
    if (this.addressForm.invalid) {
      return;
    }
    ////console.log(param)
    this.loading = true;
    this._accountSettingService.addTenantAddress(param).subscribe(res => {
      this.loading = false;
      ////console.log(res)
      let el: HTMLElement = this.addNewAddressCancelEle.nativeElement;
      el.click();
      this._snackBar.open(res.message);
      this.addressForm.reset();
      this.submitted = false;
      this.addressForm.controls['tenantAddressId'].setValue(0);
      this.addressForm.controls['tenantId'].setValue(0);
      this.addressForm.controls['state'].setValue('');
      this.addressForm.controls['isDefault'].setValue(false);
      this._accountSettingService.tenantAddressAdded.next(true);
    });
  }
}
