import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminPanelRoutingModule } from './super-admin-panel-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequestDemoComponent } from './request-demo/request-demo.component';

@NgModule({
  declarations: [
    DashboardComponent,
    RequestDemoComponent
  ],
  imports: [
    CommonModule,
    SuperAdminPanelRoutingModule
  ]
})
export class SuperAdminPanelModule { }
