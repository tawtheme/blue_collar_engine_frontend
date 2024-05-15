import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';
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
  @ViewChild('customerCancelEle') customerCancelEle!: ElementRef<HTMLElement>;
  constructor(private formBuilder: FormBuilder, private _customerService: CustomerService, private _router: Router, private _toastrService: ToastrService) {

  }
  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      customerId: [0, null],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      companyName: ['', [Validators.maxLength(200)]],
      mobileNumber: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]{10}')]],
      landlineNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]{10}')]],
      emailAddress: ['', [Validators.required, Validators.maxLength(200)]],
      serviceAddress: ['', [Validators.required, Validators.maxLength(500)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      zipCode: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]{5,6}')]],
      setDefaultBillingAddress: [true],
      tags: ['', [Validators.required, Validators.maxLength(500)]],
      status: ['A', null],
    });
    if (this.items?.length > 0) {
      this.items = { ...this.items, ...{ tags: this.items.tags.split(',') } };
      this.customerForm.patchValue(this.items);
    }


  }
  // convenience getter for easy access to form fields
  get f() { return this.customerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.customerForm.invalid) {
      return;
    }
    let param = this.customerForm.value as any;
    Object.assign(param, { latitude: '30.849536', longitude: '75.796101' });
    param = { ...param, ...{ tags: param.tags.length > 0 ? param.tags.toString() : '' } }
    console.log(param);
    this.loading = true;
    this._customerService.addUpdate(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res)
          let el: HTMLElement = this.customerCancelEle.nativeElement;
          el.click();
          this._toastrService.success(res.message, 'Success');
          this._customerService.customerAdded.next(true);
          if (param.customerId > 0) {
            this._customerService.customerDetailAdded.next(param.customerId);
          }
        },
        error: error => {
          debugger
          this.loading = false;
        }
      });
  }

}
