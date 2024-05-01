import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';
import { TagInputModule } from 'ngx-chips';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, first } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TagInputModule],
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;
  loading = false;
  submitted = false;
  customerArr: any = [];
  @ViewChild('customerCancelEle') customerCancelEle!: ElementRef<HTMLElement>;
  constructor(private formBuilder: FormBuilder, private _customerService: CustomerService, private _router: Router, private _toastrService: ToastrService) {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this.getAll(_param);
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
          var _param = {
            "id": 0,
            "pageNumber": 0,
            "pageSize": 0,
            "searchStr": ""
          }
          this.getAll(_param);
        },
        error: error => {
          debugger
          this.loading = false;
        }
      });
  }

  getAll(param: PaginationModel) {
    this._customerService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.customerArr = res.data;
          console.log(this.customerArr)
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  redirectToCustomerDetail(customerId: number) {
    this._router.navigate(['/admin/customer-detail'], { queryParams: { customerId: customerId } })
  }
}
