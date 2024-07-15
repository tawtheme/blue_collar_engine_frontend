import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaginationModel } from '@app/_models/pagination';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-contractor-address-book',
  templateUrl: './contractor-address-book.component.html',
  styleUrls: ['./contractor-address-book.component.scss']
})
export class ContractorAddressBookComponent {
  items: any[] = [];
  addressInfo: any;
  loading: boolean = false;
  @ViewChild('editAddressEle') editAddressEle!: ElementRef<HTMLElement>;
  constructor(private _accountSettingService: AccountSettingService, private _router: Router, private _dialog: MatDialog, private _snackBar: MatSnackBar) {
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
    this.loading = true;
    this._accountSettingService.getTenantAddresses(param)
      .subscribe({
        next: (res) => {
          this.items = res.data;
          this.loading = false;
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

  onChange(ev: any, addressInfo: any) {
    ev.source.checked = ev.checked == true ? false : true;
    if(ev.source.checked){
      return;
    }
    const message = `Are you sure you want to set this address as the default address?`;
    const dialogData = new ConfirmDialogModel("Confirmation", message);
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        addressInfo = { ...addressInfo, ...{ isDefault: ev.checked } };
        this._accountSettingService.setAsDefaultAddress(addressInfo).subscribe(res => {
          this._snackBar.open(res.message);
          var _param = {
            "id": 0,
            "pageNumber": 0,
            "pageSize": 0,
            "searchStr": ""
          }
          this.getAllAddress(_param);
        })
      }
      else {
        ev.source.checked = ev.checked == true ? false : true;
        addressInfo.isDefault=ev.source.checked;
        return;
      }
    });
  }
}
