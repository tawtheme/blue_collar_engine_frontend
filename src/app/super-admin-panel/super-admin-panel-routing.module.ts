import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '@app/_helpers';
import { Role } from '@app/_models';
import { RequestDemoComponent } from './request-demo/request-demo.component';
import { SecureLayoutComponent } from './secure-layout/secure-layout.component';

const routes: Routes = [
  {
    path: '',
    component: SecureLayoutComponent,
    children:[
      {
        path:'dashboard',
        component:DashboardComponent,
        pathMatch: 'full'
      },
      {
        path: 'request-demo',
        component: RequestDemoComponent       
      }     
    ],
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin] }
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminPanelRoutingModule { }
