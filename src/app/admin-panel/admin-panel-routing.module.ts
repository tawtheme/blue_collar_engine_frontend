import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '@app/_helpers';
import { Role } from '@app/_models';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { LayoutComponent } from './layout/layout.component';
import { JobsComponent } from './jobs/jobs.component';
import { EstimateInvoiceComponent } from './estimate-invoice/estimate-invoice.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { EstimateComponent } from './estimate/estimate.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CreateEstimateComponent } from './create-estimate/create-estimate.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { CreateJobComponent } from './create-job/create-job.component';

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
        component: CustomerDetailsComponent,
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
    ],
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule {}
