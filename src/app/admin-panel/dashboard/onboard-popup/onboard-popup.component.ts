import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterStateSnapshot } from '@angular/router';
import { DashboardService } from '@app/_services/admin-panel/dashboard/dashboard.service';

@Component({
  selector: 'app-onboard-popup',
  templateUrl: './onboard-popup.component.html',
  styleUrls: ['./onboard-popup.component.scss']
})
export class OnboardPopupComponent {
  onBoardData: any;
  isShowCancelBtn: boolean = false;
  constructor(public dialogRef: MatDialogRef<OnboardPopupComponent>, @Inject(MAT_DIALOG_DATA)
  public data: any, private _router: Router) { }
  ngOnInit(): void {
    this.onBoardData = this.data.onBoardStatus;
    //////console.log(this._router.url)
    this.isShowCancelBtn = (this._router.url == '/admin' ? true : false);
  }

  cancel() {
    this.dialogRef.close();
  }

  redirectToService() {
    this.cancel();
    this._router.navigate(['/admin/price-book']);
  }

  redirectToUser() {
    this.cancel();
    this._router.navigate(['/admin/account-setting']);
  }

  redirectToTax() {
    this.cancel();
    this._router.navigate(['/admin/account-setting']);
  }

  redirectToStripeConfiguration() {
    this.cancel();
    this._router.navigate(['/admin/account-setting']);
  }
}
