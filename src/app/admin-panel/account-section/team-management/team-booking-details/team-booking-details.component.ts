import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-team-booking-details',
  templateUrl: './team-booking-details.component.html',
  styleUrls: ['./team-booking-details.component.scss'],
})
export class TeamBookingDetailsComponent {
  constructor(private dialogRef: MatDialogRef<TeamBookingDetailsComponent>) {}
  closeDialog() {
    this.dialogRef.close();
  }
}
