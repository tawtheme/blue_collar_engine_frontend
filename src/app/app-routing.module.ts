import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { Role } from './_models';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { OnlineRequestDemoComponent } from './online-request-demo/online-request-demo.component';
const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'secure-panel',
        loadChildren: () => import('./super-admin-panel/super-admin-panel.module').then(m => m.SuperAdminPanelModule)
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin-panel/admin-panel-routing.module').then(m => m.AdminPanelRoutingModule)
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'forget-password',
        component: ForgetPasswordComponent
    },
    {
        path: 'unauthorized',
        component: UnauthorizedComponent
    },
    {
        path: 'online-request-demo',
        component: OnlineRequestDemoComponent
    },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
