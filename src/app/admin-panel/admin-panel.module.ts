import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchedulerComponent } from './booking-section/scheduler/scheduler.component';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCustomerAddressComponent } from './shared/create-customer-address/create-customer-address.component';
import { PaginationComponent } from '../shared/Pagination/pagination.component';
import { AddressBookComponent } from './shared/address-book/address-book.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalenderHeaderComponent } from './booking-section/scheduler/calander-header/calender-header/calender-header.component';
import { CategoryListComponent } from './price-book-section/category/category-list/category-list.component';
import { CategoryAddUpdateComponent } from './price-book-section/category/category-add-update/category-add-update.component';
import { ServiceListComponent } from './price-book-section/service/service-list/service-list.component';
import { AddUpdateServiceComponent } from './price-book-section/service/add-update-service/add-update-service.component';
import { AddNewAddressComponent } from './account-section/contractor-address-book/add-new-address/add-new-address.component';
import { AddTaxRateComponent } from './account-section/tax/add-tax-rate/add-tax-rate.component';
import { SharedModule } from '@app/shared/shared.module';
import { EditViewBookingComponent } from './job-section/edit-view-booking/edit-view-booking.component';
import { IncrementInputComponent } from './shared/increment-input/increment-input.component';

import { MaterialModule } from 'src/material/material.module';
import { BookingStepComponent } from './job-section/booking-step/booking-step.component';
import { BookingStepDashboardComponent } from './job-section/booking-step-dashboard/booking-step-dashboard.component';
import { AccountSettingComponent } from './account-section/account-setting/account-setting.component';
import { BusinessHoursComponent } from './account-section/business-hours/business-hours.component';
import { NotificationComponent } from './account-section/notification/notification.component';
import { SecurityComponent } from './account-section/security/security.component';
import { TaxComponent } from './account-section/tax/tax.component';
import { MyProfileComponent } from './account-section/my-profile/my-profile.component';
import { ContractorAddressBookComponent } from './account-section/contractor-address-book/contractor-address-book.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminPanelRoutingModule,
    TagInputModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    SharedModule,
    MaterialModule
  ],
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
    CalenderHeaderComponent,
    CategoryListComponent,
    CategoryAddUpdateComponent,
    ServiceListComponent,
    AddUpdateServiceComponent,
    AddNewAddressComponent,
    AddTaxRateComponent,
    EditViewBookingComponent,
    IncrementInputComponent,
    BookingStepComponent,
    BookingStepDashboardComponent,
    AccountSettingComponent,
    BusinessHoursComponent,
    NotificationComponent,
    SecurityComponent,
    TaxComponent,
    AddTaxRateComponent,
    MyProfileComponent,
    ContractorAddressBookComponent
  ],

})
export class AdminPanelModule { }
