import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TenantService } from '@app/_services/secure-panel/tenant.service';

@Component({
  selector: 'app-edit-view-booking',
  templateUrl: './edit-view-booking.component.html',
  styleUrls: ['./edit-view-booking.component.scss']
})
export class EditViewBookingComponent {
  bookingInfo: any;

  _value: number = 0;
  _step: number = 1;
  _min: number = 0;
  _max: number = Infinity;
  _wrap: boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<EditViewBookingComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any[] = [], private _tenantService: TenantService, private _dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.bookingInfo = this.data;
  }

  cancel() {
    this.dialogRef.close();
  }
}
