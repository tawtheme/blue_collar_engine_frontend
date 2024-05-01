import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  customerInfo: any;
  constructor(private route: ActivatedRoute, private _customerService: CustomerService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        //console.log(params); // { order: "popular" }
        this.get(params.customerId);
      }
      );
  }

  get(customerId: number) {
    this._customerService.get(customerId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          //console.log(res)
          this.customerInfo = res.data;
        },
        error: error => {
        }
      });
  }

}
