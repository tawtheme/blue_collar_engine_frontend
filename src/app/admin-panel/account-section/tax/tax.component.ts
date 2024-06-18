import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent {
  taxes: any[] = [];
  constructor(private _accountSettingService: AccountSettingService, private _router: Router) {
    
  }

  ngOnInit() {   
    this.getAllTaxes();
  }

  getAllTaxes() {
    this._accountSettingService.getAllTax()
      .subscribe({
        next: (res) => {
          this.taxes = res.data;
          console.log(this.taxes)
        }
      });
  }

}
