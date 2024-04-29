import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { LayoutComponent } from './layout/layout.component';
import { JobsComponent } from './jobs/jobs.component';
import { EstimateInvoiceComponent } from './estimate-invoice/estimate-invoice.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SchedulerComponent,
    JobsComponent,
    EstimateInvoiceComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    AdminPanelRoutingModule
  ] 
})
export class AdminPanelModule { }
