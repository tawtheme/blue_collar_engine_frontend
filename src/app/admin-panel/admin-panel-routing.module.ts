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
import { ServiceListComponent } from './price-book-section/service/service-list/service-list.component';
import { MyProfileComponent } from './profile-section/my-profile/my-profile.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'customer',
        component: CustomerComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'customer-detail',
        component: CustomerDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'scheduler',
        component: SchedulerComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'jobs',
        component: JobsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'create-job',
        component: CreateJobComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'estimate',
        component: EstimateComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'create-estimate',
        component: CreateEstimateComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invoice',
        component: InvoiceComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'create-invoice',
        component: CreateInvoiceComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'price-book',
        component: ServiceListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-profile',
        component: MyProfileComponent,
        canActivate: [AuthGuard]
      },
    ],
    data: { roles: [Role.Admin] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule { }
