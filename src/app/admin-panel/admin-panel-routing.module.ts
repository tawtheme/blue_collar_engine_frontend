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

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children:[
      {
        path:'',
        component:DashboardComponent,
        pathMatch: 'full'
      },
      {
        path: 'customer',
        component: CustomerComponent       
      },
      {
        path: 'customer-detail',
        component: CustomerDetailsComponent       
      },
      {
        path: 'scheduler',
        component: SchedulerComponent       
      },
      {
        path: 'jobs',
        component: JobsComponent       
      },
      {
        path: 'estimate-invoice',
        component: EstimateInvoiceComponent       
      }
    ],
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
