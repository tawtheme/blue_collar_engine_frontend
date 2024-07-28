import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeamBookingDetailsComponent } from '../team-booking-details/team-booking-details.component';
@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
})
export class TeamDetailsComponent {
  constructor(private _dialog: MatDialog) {}

  openTeamBookingDetails() {
    this._dialog.open(TeamBookingDetailsComponent, {
      width: '1200px',
      minHeight: '480px',
      maxHeight: '90vh',
      disableClose: true,
      panelClass: 'bookings-details-dialog-container'
    });
  }
}
