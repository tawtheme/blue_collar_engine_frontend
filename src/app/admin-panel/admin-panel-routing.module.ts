import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '@app/_helpers';
import { Role } from '@app/_models';
import { SchedulerComponent } from './booking-section/scheduler/scheduler.component';
import { LayoutComponent } from './layout/layout.component';
import { JobsComponent } from './job-section/jobs/jobs.component';
import { CustomerComponent } from './customer-section/customer/customer.component';
import { CustomerDetailsComponent } from './customer-section/customer-details/customer-details.component';

import { InvoiceComponent } from './invoice-section/invoice/invoice.component';
import { CreateEstimateComponent } from './estimate-section/create-estimate/create-estimate.component';
import { CreateInvoiceComponent } from './invoice-section/create-invoice/create-invoice.component';
import { CreateJobComponent } from './job-section/create-job/create-job.component';
import { EstimateComponent } from './estimate-section/estimate/estimate.component';
import { BookingComponent } from './booking-section/booking/booking.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full',
      },
      {
        path: 'customer',
        component: CustomerComponent,
      },
      {
        path: 'customer-detail',
        component: CustomerDetailsComponent
      },
      {
        path: 'scheduler',
        component: SchedulerComponent,
      },
      {
        path: 'jobs',
        component: JobsComponent,
      },
      {
        path: 'create-job',
        component: CreateJobComponent,
      },
      {
        path: 'estimate',
        component: EstimateComponent,
      },
      {
        path: 'create-estimate',
        component: CreateEstimateComponent,
      },
      {
        path: 'invoice',
        component: InvoiceComponent,
      },
      {
        path: 'create-invoice',
        component: CreateInvoiceComponent,
      },
      {
        path: 'create-booking',
        component: BookingComponent,
      },
    ],
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule { }
