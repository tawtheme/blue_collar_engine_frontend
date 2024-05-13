import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantManager } from '@app/_helpers/constant/constantManager';
import { CustomerModel } from '@app/_models/customer/customerModel';
import { PaginationModel } from '@app/_models/pagination';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';
import { InvoiceService } from '@app/_services/admin-panel/invoice/invoice.service';
import { MasterService } from '@app/_services/admin-panel/master/master.service';
import { ProductService } from '@app/_services/admin-panel/product/product.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;
  loading = false;
  loadingSend = false;
  loadingDraft = false;
  submitted = false;
  customerList: any = [];
  productList: any = [];
  customerAddress: any = [];
  isDisabled: boolean = true;
  customerInfo: CustomerModel = { firstName: '--', lastName: '--', mobileNumber: '--', emailAddress: '--', serviceAddress: '--', customerAddressId: 0, customerId: 0 };
  taxPer: any;
  clickType: any;
  subTotal: number = 0.00;
  estimateTotal: number = 0.00;
  taxAmount: number = 0.00;
  isShowRegNo: boolean = false;
  expiryDateStr: string = '';
  status: string = '';
  todayDate: Date = new Date();
  result: string = '';
  isProceed: boolean = false;
  constructor(private _formBuilder: FormBuilder, private _invoiceService: InvoiceService, private _router: Router, private _toastrService: ToastrService, private _customerService: CustomerService, private _productService: ProductService, private _masterService: MasterService, private _activeRoute: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    this._customerService.bindAddress.subscribe((address: any) => {
      this.customerInfo.serviceAddress = address.address + ' ' + address.city + ' ' + address.state + ' ' + address.zipCode;
      this.invoiceForm.controls['customerAddressId'].setValue(address.customerAddressId);
    });
    this.invoiceForm = this._formBuilder.group({
      invoiceId: [0, null],
      refNo: ['', null],
      customerId: ['', [Validators.required]],
      customerAddressId: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],
      notes: ['', null],
      discount: ['0', null],
      tax: ['', null],
      products: this._formBuilder.array([this._formBuilder.group({
        productId: ['', [Validators.required]],
        qty: ['', [Validators.required]],
        price: ['', null],
        totalPrice: ['', null],
        description: ['', null]
      })])
    });

    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this.getAll(_param);
    this.getAllProduct();
    this.bindTax(ConstantManager.TaxType);

    this._activeRoute.queryParams
      .subscribe(params => {
        if (params.invoiceId != undefined && params.invoiceId > 0) {
          this.isShowRegNo = true;
          this.get(params.invoiceId);
        }
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.invoiceForm.controls; }


  getAll(param: PaginationModel) {
    this._customerService.getAll(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.customerList = res.data;
          console.log(this.customerList)
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  get(invoiceId: number) {
    this._invoiceService.get(invoiceId).subscribe(res => {
      this.products().clear();
      res.data.products.forEach((t: { batches: any[]; }) => {
        var teacher: FormGroup = this.newProduct();
        this.products().push(teacher);
      });
      this.invoiceForm.patchValue(res.data);

      this.customerInfo=<CustomerModel>res.data;
      this.invoiceForm.controls['customerAddressId'].setValue(this.customerInfo.customerAddressId);
      this.getAddress(this.customerInfo.customerId);
      this.isDisabled = false;

      this.calculateTotal();
      this.expiryDateStr = res.data.expiryDate;
      this.status = res.data.status;
    })

  }

  getAllProduct() {
    this._productService.getAll()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.productList = res.data;
          console.log(this.productList)
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  bindTax(type: any) {
    this._masterService.get(type).subscribe(res => {
      console.log(res.data.tax)
      this.invoiceForm.controls['tax'].setValue(res.data.tax);
      this.taxPer = res.data.tax;
    })
  }

  bindCustomerInfo(ev: any) {
    var customerData = this.customerList.filter(function (event: { customerId: number; }) {
      return event.customerId == ev.target.value;
    });
    this.customerInfo = <CustomerModel>customerData[0];
    if (this.customerInfo.customerId > 0) {
      this.isDisabled = false;
    }
    this.invoiceForm.controls['customerAddressId'].setValue(this.customerInfo.customerAddressId);
    this.getAddress(this.customerInfo.customerId);
  }

  bindProductInfo(ev: any, index: number) {
    var productData = this.productList.filter(function (event: { productId: number; }) {
      return event.productId == ev;
    });
    this.products().at(index).get('price')?.setValue(productData[0].price);
    this.calculateTotal();
  }

  getAddress(customerId: number) {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this._customerService.getAllAddress(_param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.customerAddress = res.data.filter(function (el: { customerId: number; }) {
            return el.customerId == customerId;
          });
        },
        error: error => {
        }
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.invoiceForm.invalid) {
      return;
    }
    let param = this.invoiceForm.value as any;
    Object.assign(param, { status: this.clickType });
    if (this.clickType == 'S') {
      const message = `Are you sure you want to do send?`;
      const dialogData = new ConfirmDialogModel("Confirmation", message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.loadingSend = true;
          this.proceedSubmit(param);
        }
        else {
          return;
        }
      });
    }
    else {
      this.loadingDraft = true;
      this.proceedSubmit(param);
    }

  }

  proceedSubmit(param: any) {
    this._invoiceService.create(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (this.clickType == 'S') {
            this.loadingSend = false;
          }
          else {
            this.loadingDraft = false;
          }
          this._toastrService.success(res.message, 'Success');
          console.log(res)
          this._router.navigate(['/admin/invoice']);
        },
        error: error => {
          if (this.clickType == 'S') {
            this.loadingSend = false;
          }
          else {
            this.loadingDraft = false;
          }
        }
      });
  }

  products(): FormArray {
    return this.invoiceForm.get("products") as FormArray
  }
  newProduct(): FormGroup {
    return this._formBuilder.group({
      productId: ['', [Validators.required]],
      qty: ['', [Validators.required]],
      price: ['', null],
      totalPrice: ['', null],
      description: ['', null]
    })
  }

  addProduct() {
    this.products().push(this.newProduct());
    console.log(this.f)
  }

  removeQuantity(i: number) {
    this.products().removeAt(i);
  }

  getAction(type: any) {
    this.clickType = type;
    this.onSubmit();
  }

  changeQty(ev: any, index: number) {
    let _price = this.products().at(index).get('price')?.value;
    this.products().at(index).get('totalPrice')?.setValue(_price * ev);
    this.calculateTotal();
  }

  calculateTotal() {
    let _totalAmt = 0;
    for (let i = 0; i < this.products().length; i++) {
      _totalAmt += this.products().at(i).get('totalPrice')?.value;
    }
    this.subTotal = _totalAmt - this.invoiceForm.controls['discount'].value;
    this.taxAmount = (this.subTotal * this.taxPer / 100);
    this.estimateTotal = this.subTotal + this.taxAmount;
  }

}
