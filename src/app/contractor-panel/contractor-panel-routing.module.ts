import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { PagenotfoundComponent } from '@app/pagenotfound/pagenotfound.component';
import { ContractorAuthGuard } from '@app/_helpers/contractor-auth.guard';
import { BookingSuccessComponent } from './booking-success/booking-success.component';
import { BookingFailedComponent } from './booking-failed/booking-failed.component';

const routes: Routes = [
  {
    path: '',
    component: BookingComponent,
    canActivate: [ContractorAuthGuard],
    children: [
      {
        path: 'online-form',
        component: BookingComponent,
        pathMatch: 'full',
        // canActivate: [ContractorAuthGuard]
      },
    ],
  },
  {
    path: 'booking-success',
    component: BookingSuccessComponent,
    pathMatch: 'full',
  },
  {
    path: 'booking-failed',
    component: BookingFailedComponent,
    pathMatch: 'full',
  },
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractorPanelRoutingModule {}
