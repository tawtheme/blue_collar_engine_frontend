import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '@app/_services/admin-panel/customer/customer.service';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements OnInit {
  @Input() items?: any;
  @Input() IsShowAddEdit: boolean = true;
  @ViewChild('clickEvent') clickEvent!: ElementRef<HTMLElement>;
  constructor(private _customerService: CustomerService) { }

  ngOnInit(): void {
  }

  getData(address: any) {
    //this.address = address;
    this._customerService.bindAddress.next(address);
    let el: HTMLElement = this.clickEvent.nativeElement;
    el.click();
  }
  addAdreess() {
    let el: HTMLElement = this.clickEvent.nativeElement;
    el.click();
  }

  setAddress(address: any) {
    this._customerService.bindAddress.next(address);
  }
}
