import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-contractor-address-book',
  templateUrl: './contractor-address-book.component.html',
  styleUrls: ['./contractor-address-book.component.scss']
})
export class ContractorAddressBookComponent {
  items: any[] = [];
  addressInfo: any;
  @ViewChild('editAddressEle') editAddressEle!: ElementRef<HTMLElement>;
  constructor(private _accountSettingService: AccountSettingService, private _router: Router) {
  }

  ngOnInit() {
    var _param = {
      "id": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "searchStr": ""
    }
    this.getAllAddress(_param);

    this._accountSettingService.tenantAddressAdded.subscribe((data: boolean) => {
      if (data) {
        this.getAllAddress(_param);
      }
    });
  }

  getAllAddress(param: PaginationModel) {
    this._accountSettingService.getTenantAddresses(param)
      .subscribe({
        next: (res) => {
          this.items = res.data;
         // console.log(this.items)
        }
      });
  }

  editAddress(address: any) {
    this.addressInfo = address;
    let el: HTMLElement = this.editAddressEle.nativeElement;
    el.click();
  }

  addNewAddress() {
    this.addressInfo = null;
    let el: HTMLElement = this.editAddressEle.nativeElement;
    el.click();
  }
}
