import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminPanelRoutingModule } from './super-admin-panel-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResuableTableComponent } from '../shared/resuable-table/resuable-table.component';
import { PaginationComponent } from '@app/shared/Pagination/pagination.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ViewRequestDemoComponent } from './view-request-demo/view-request-demo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestDemoComponent } from './request-demo/list/request-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SuperAdminPanelRoutingModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  declarations: [
    DashboardComponent,
    RequestDemoComponent,
    ResuableTableComponent,
    ViewRequestDemoComponent    
  ]
})
export class SuperAdminPanelModule { }
