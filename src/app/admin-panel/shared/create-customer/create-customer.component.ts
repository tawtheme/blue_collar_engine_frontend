import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';
import { MasterService } from '@app/_services/master.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {
  @Input() items?: any;
  customerForm!: FormGroup;
  loading = false;
  submitted = false;
  states:any[]=[];
  @ViewChild('customerCancelEle') customerCancelEle!: ElementRef<HTMLElement>;
  constructor(private formBuilder: FormBuilder, private _customerService: CustomerService, private _router: Router, private _snackBar: MatSnackBar, private _masterService: MasterService) {

  }
  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      customerId: [0, null],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      companyName: ['', [Validators.maxLength(200)]],
      mobileNumber: ['', [Validators.required]],
      landlineNo: ['', null],
      emailAddress: ['', [Validators.required, Validators.maxLength(200)]],
      serviceAddress: ['', [Validators.required, Validators.maxLength(500)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      zipCode: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]{5,6}')]],
      setDefaultBillingAddress: [true],
      tags: ['', [Validators.maxLength(500)]],
      status: ['A', null],
    });

    this.getAllStates();

  }
  ngOnChanges() {
    if (this.items != undefined) {
      this.items = { ...this.items, ...{ tags: this.items.tags != null && this.items.tags.length > 0 ? this.items.tags.split(',') : '' } };
      this.customerForm.patchValue(this.items);
    }

  }
  // convenience getter for easy access to form fields
  get f() { return this.customerForm.controls; }

  onSubmit() {
    this.submitted = true;
    let param = this.customerForm.value as any;
    Object.assign(param, { latitude: '30.849536', longitude: '75.796101' });
    param = { ...param, ...{ tags: param.tags != null && param.tags.length > 0 ? param.tags.toString() : '', mobileNumber: param.mobileNumber.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, ''), landlineNo: param.landlineNo.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, '') } }
    if (this.customerForm.invalid) {
      return;
    }
    this.loading = true;
    this._customerService.addUpdate(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          //////////console.log(res)
          let el: HTMLElement = this.customerCancelEle.nativeElement;
          el.click();
          this._snackBar.open(res.message);
          this._customerService.customerAdded.next(true);
          if (param.customerId > 0) {
            this._customerService.customerDetailAdded.next(param.customerId);
          }
        },
        error: error => {
          //debugger
          this.loading = false;
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

