import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminPanelRoutingModule } from './super-admin-panel-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequestDemoComponent } from './request-demo/request-demo.component';
import { ResuableTableComponent } from '../shared/resuable-table/resuable-table.component';
@NgModule({
  declarations: [
    DashboardComponent,
    RequestDemoComponent,
    ResuableTableComponent
  ],
  imports: [
    CommonModule,
    SuperAdminPanelRoutingModule
  ]
})
export class SuperAdminPanelModule { }
