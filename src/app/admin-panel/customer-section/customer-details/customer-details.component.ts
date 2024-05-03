import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  customerInfo: any;
  customerAddress: any = [];
  customerId: number = 0;
  constructor(private route: ActivatedRoute, private _customerService: CustomerService, private _router: Router) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.customerId = params.customerId;
        this.get(params.customerId);
        this.getAddress(params.customerId);
      }
      );
    this._customerService.customerDetailAdded.subscribe((customerId: number) => {
      if (customerId > 0) {
        this.get(customerId);
        this.getAddress(customerId);
      }
    });
  }

  get(customerId: number) {
    this._customerService.get(customerId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.customerInfo = res.data;
        },
        error: error => {
        }
      });
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
          console.log(this.customerAddress)
        },
        error: error => {
        }
      });
  }
  redirectToCreateJob() {
    this._router.navigate(['/admin/create-job']);
  }
}
