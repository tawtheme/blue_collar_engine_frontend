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
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { OnlineBookingSystemComponent } from './online-booking-system/online-booking-system.component';
import { BookingSystemComponent } from './booking-system/booking-system.component';
import { EstimateComponent } from './estimate/estimate.component';

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
      },
      {
        path: 'page/invoice',
        component: InvoiceComponent,
      },
      {
        path: 'page/estimate',
        component: EstimateComponent,
      },
      {
        path: 'page/online-booking-system',
        component: OnlineBookingSystemComponent,
      },
      {
        path: 'page/booking-system',
        component: BookingSystemComponent,
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
      },
      {
        path: 'terms-of-service',
        component: TermsOfServiceComponent,
      },
      {
        path: 'about-us',
        component: AboutUsComponent,
      },
    ],
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

  {
    path: 'booking',
    loadChildren: () =>
      import('./contractor-panel/contractor-panel.module').then(
        (m) => m.ContractorPanelModule
      ),
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
    path: 'payment-success',
    component: PaymentSuccessComponent,
  },
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
