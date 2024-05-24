import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { PagenotfoundComponent } from '@app/pagenotfound/pagenotfound.component';
import { ContractorAuthGuard } from '@app/_helpers/contractor-auth.guard';


const routes: Routes = [
  {
    path: '',
    component: BookingComponent,
    children: [
      {
        path: '',
        component: BookingComponent,
        pathMatch: 'full',
      },
      {
        path: 'online-form',
        component: BookingComponent
      }],
    canActivate: [ContractorAuthGuard]
  },
  { path: '**', component: PagenotfoundComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractorPanelRoutingModule { }



