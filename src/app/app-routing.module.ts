import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { OnlineRequestDemoComponent } from './online-request-demo/online-request-demo.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FrontendLayoutComponent } from './shared/frontend-layout/frontend-layout.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

const routes: Routes = [
  {
    path: '',
    component: FrontendLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
        pathMatch: 'full',
      },
      {
        path: 'online-request-demo',
        component: OnlineRequestDemoComponent,
      }
    ]
  },
  {
    path: 'booking',
    loadChildren: () =>
      import('./contractor-panel/contractor-panel.module').then(
        (m) => m.ContractorPanelModule
      )
  },
  {
    path: 'secure-panel',
    loadChildren: () =>
      import('./super-admin-panel/super-admin-panel.module').then(
        (m) => m.SuperAdminPanelModule
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin-panel/admin-panel.module').then(
        (m) => m.AdminPanelModule
      ),
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
