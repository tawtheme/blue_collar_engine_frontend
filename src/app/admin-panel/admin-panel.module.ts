import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchedulerComponent } from './booking-section/scheduler/scheduler.component';
import { LayoutComponent } from './layout/layout.component';
import { JobsComponent } from './job-section/jobs/jobs.component';
import { CustomerDetailsComponent } from './customer-section/customer-details/customer-details.component';
import { CustomerComponent } from './customer-section/customer/customer.component';

import { InvoiceComponent } from './invoice-section/invoice/invoice.component';
import { EstimateComponent } from './estimate-section/estimate/estimate.component';
import { CreateEstimateComponent } from './estimate-section/create-estimate/create-estimate.component';
import { CreateInvoiceComponent } from './invoice-section/create-invoice/create-invoice.component';
import { CreateJobComponent } from './job-section/create-job/create-job.component';
import { CreateCustomerComponent } from './shared/create-customer/create-customer.component';
import { TagInputModule } from 'ngx-chips';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateCustomerAddressComponent } from './shared/create-customer-address/create-customer-address.component';
import { PaginationComponent } from '@app/shared/Pagination/pagination.component';
import { AddressBookComponent } from './shared/address-book/address-book.component';
import { BookingComponent } from './booking-section/booking/booking.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SchedulerComponent,
    JobsComponent,
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
    BookingComponent
  ],
  imports: [CommonModule, AdminPanelRoutingModule, TagInputModule, ReactiveFormsModule]
})
export class AdminPanelModule { }
