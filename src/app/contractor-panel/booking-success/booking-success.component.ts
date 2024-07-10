import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingSharedService } from '@app/_services/site-panel/booking/booking-shared.service';
import { BookingService } from '@app/_services/site-panel/booking/booking.service';

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.scss']
})

export class BookingSuccessComponent {
  bookingData:any;
  constructor(private router:Router, private _bookingSharedService: BookingSharedService) {    
    this.bookingData=this.router.getCurrentNavigation()!.extras.state;
    
  }  
}
