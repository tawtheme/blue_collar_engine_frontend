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
import { AccountSettingComponent } from './account-section/account-setting/account-setting.component';
import { TeamDetailsComponent } from './account-section/team-management/team-details/team-details.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
      {
        path: 'customer',
        component: CustomerComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
      {
        path: 'customer-detail',
        component: CustomerDetailsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
      {
        path: 'scheduler',
        component: SchedulerComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
      {
        path: 'bookings',
        component: JobsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
      {
        path: 'create-job',
        component: CreateJobComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
      {
        path: 'estimate',
        component: EstimateComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
      {
        path: 'create-estimate',
        component: CreateEstimateComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
      {
        path: 'invoice',
        component: InvoiceComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
      {
        path: 'create-invoice',
        component: CreateInvoiceComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
      {
        path: 'price-book',
        component: ServiceListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
      {
        path: 'account-setting',
        component: AccountSettingComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
      {
        path: 'team-details',
        component: TeamDetailsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
      },
    ],
    data: { roles: [Role.Admin] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule {}
