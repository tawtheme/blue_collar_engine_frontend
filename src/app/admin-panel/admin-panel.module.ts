import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { LayoutComponent } from './layout/layout.component';
import { JobsComponent } from './jobs/jobs.component';
import { EstimateInvoiceComponent } from './estimate-invoice/estimate-invoice.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SchedulerComponent,
    JobsComponent,
    EstimateInvoiceComponent,
    LayoutComponent,
    CustomersComponent,
    CustomerDetailsComponent,
  ],
  imports: [CommonModule, AdminPanelRoutingModule],
})
export class AdminPanelModule {}
