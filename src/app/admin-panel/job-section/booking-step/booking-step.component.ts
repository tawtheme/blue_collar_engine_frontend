import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { BookingService } from '@app/_services/admin-panel/booking/booking.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-booking-step',
  templateUrl: './booking-step.component.html',
  styleUrls: ['./booking-step.component.scss']
})
export class BookingStepComponent {
  bookingStepInfo: any;
  @Input() bookingId: number = 0;
  user: User;
  loading: boolean = false;
  constructor(private _bookingService: BookingService, private authenticationService: AuthenticationService) {
    this.user = <User>this.authenticationService.userValue;
    console.log(this.user.data.tenantInfo.timezone)
  }

  ngOnInit(): void {
    var param = {
      'bookingId': this.bookingId,
      'timeZone': this.user.data.tenantInfo.timezone
    }
    console.log(param)
    this.getBookingSteps(param);
  }

  getBookingSteps(bookingStepInput: any) {
    this.loading = true;
    this._bookingService.getBookingSteps(bookingStepInput)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.bookingStepInfo = res.data;
          console.log(this.bookingStepInfo)
          this.loading = false;
        }
      });
  }
}
