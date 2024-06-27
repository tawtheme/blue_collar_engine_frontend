import { devOnlyGuardedExpression } from '@angular/compiler';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';

@Component({
  selector: 'app-create-customer-address',
  templateUrl: './create-customer-address.component.html',
  styleUrls: ['./create-customer-address.component.scss']
})
export class CreateCustomerAddressComponent implements OnInit {
  @Input() items?: any;
  @Input() customerId: number = 0;
  @Input() data?: any;
  customerAddressForm!: FormGroup;
  loading = false;
  submitted = false;
  @ViewChild('customerAddCancelEle') customerAddCancelEle!: ElementRef<HTMLElement>;
  constructor(private formBuilder: FormBuilder, private _customerService: CustomerService, private _router: Router, private _toastrService: ToastrService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    //console.log(this.data)
    this._customerService.bindAddress.subscribe((address: any) => {
      //console.log(address);
      this.customerAddressForm.patchValue(address);
    });

    this.route.queryParams
      .subscribe(params => {
        this.customerId = params.customerId;
      }
      );

    this.customerAddressForm = this.formBuilder.group({
      customerAddressId: [0, null],
      customerId: [this.customerId > 0 ? this.customerId : 0, null],
      addressLabel: ['', [Validators.required, Validators.maxLength(200)]],
      address: ['', [Validators.required, Validators.maxLength(500)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      zipCode: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]{5,7}')]],
      latitude: ['', null],
      longitude: ['', null],
      isDefault: [true, null]
    });
    ////debugger

  }
  // convenience getter for easy access to form fields
  get f() { return this.customerAddressForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.customerAddressForm.invalid) {
      return;
    }
    let param = this.customerAddressForm.value as any;
    Object.assign(param, { latitude: '30.849536', longitude: '75.796101' });
    //console.log(param);
    this.loading = true;
    this._customerService.addUpdateAddress(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          let el: HTMLElement = this.customerAddCancelEle.nativeElement;
          el.click();
          this._toastrService.success(res.message, 'Success');
          this._customerService.customerAdded.next(true);
          if (param.customerId > 0) {
            this._customerService.customerDetailAdded.next(param.customerId);
          }
        },
        error: error => {
          this.loading = false;
        }
      });
  }
}
