import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';
import { ContractorPanelRoutingModule } from './contractor-panel-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { BookingComponent } from './booking/booking.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoneMaskDirective } from '@app/_helpers/directive/phone-mask.directive';
import { BookingSlotComponent } from './booking-slot/booking-slot.component';
import { BookingAddressComponent } from './booking-address/booking-address.component';
import { UsMobileNoPipe } from '@app/_helpers/pipe/us-mobile-no.pipe';
import { SharedModule } from '@app/shared/shared.module';
import { BookingSuccessComponent } from './booking-success/booking-success.component';
import { BookingFailedComponent } from './booking-failed/booking-failed.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContractorPanelRoutingModule,
    MatDatepickerModule,
    MatCardModule,
    MatRadioModule,
    SharedModule,
  ],
  declarations: [
    BookingComponent,
    BookingSlotComponent,
    BookingAddressComponent,
    BookingSuccessComponent,
    BookingFailedComponent,
  ],
})
export class ContractorPanelModule {}
