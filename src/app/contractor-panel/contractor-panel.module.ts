import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractorPanelRoutingModule } from './contractor-panel-routing.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import { BookingComponent } from './booking/booking.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({ 
  imports: [
    CommonModule,
    FormsModule,      
    ReactiveFormsModule,
    ContractorPanelRoutingModule,
    MatDatepickerModule,
    MatCardModule,
    MatRadioModule
  ],
  declarations: [
    BookingComponent
  ],
})
export class ContractorPanelModule { }
