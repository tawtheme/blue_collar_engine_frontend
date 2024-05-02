import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { LayoutComponent } from './layout/layout.component';
import { JobsComponent } from './jobs/jobs.component';
import { EstimateInvoiceComponent } from './estimate-invoice/estimate-invoice.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerComponent } from './customer/customer.component';

import { InvoiceComponent } from './invoice/invoice.component';
import { EstimateComponent } from './estimate/estimate.component';
import { CreateEstimateComponent } from './create-estimate/create-estimate.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { CreateJobComponent } from './create-job/create-job.component';
import { CreateCustomerComponent } from './shared/create-customer/create-customer.component';
import { ResuableTableComponent } from '@app/shared/resuable-table/resuable-table.component';
import { TagModelClass } from 'ngx-chips/core/tag-model';
import { TagInputModule } from 'ngx-chips';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateCustomerAddressComponent } from './shared/create-customer-address/create-customer-address.component';
import { PaginationComponent } from '@app/shared/Pagination/pagination.component';
import { AddressBookComponent } from './shared/address-book/address-book.component';
import { EditAddressComponent } from './shared/edit-address/edit-address.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SchedulerComponent,
    JobsComponent,
    EstimateInvoiceComponent,
    CustomerComponent,
    CustomerDetailsComponent,
    InvoiceComponent,
    EstimateComponent,
    CreateEstimateComponent,
    CreateInvoiceComponent,
    CreateJobComponent,
    CreateCustomerComponent,
    CreateCustomerAddressComponent,
    PaginationComponent,
    AddressBookComponent,
    EditAddressComponent
  ],
  imports: [CommonModule, AdminPanelRoutingModule, TagInputModule, ReactiveFormsModule,]
})
export class AdminPanelModule {}
