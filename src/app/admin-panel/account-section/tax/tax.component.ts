import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent {
  taxes: any[] = [];
  taxInfo: any;
  loading: boolean = false;
  @ViewChild('addTaxCancelEle') addTaxCancelEle!: ElementRef<HTMLElement>;
  constructor(private _accountSettingService: AccountSettingService, private _router: Router) {

  }

  ngOnInit() {
    this.getAllTaxes();
    this._accountSettingService.tenantAddressAdded.subscribe(res => {
      if (res) {
        this.getAllTaxes();
      }
    });
  }

  getAllTaxes() {
    this.loading = true;
    this._accountSettingService.getAllTax()
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.taxes = res.data;
          //////console.log(this.taxes)
        }
      });
  }

  editTax(taxInfo: any) {
    this.taxInfo = taxInfo;
    // ////console.log(this.taxInfo)
    let el: HTMLElement = this.addTaxCancelEle.nativeElement;
    el.click();
  }

  addNewTax() {
    this.taxInfo = null;
    let el: HTMLElement = this.addTaxCancelEle.nativeElement;
    el.click();
  }

}
