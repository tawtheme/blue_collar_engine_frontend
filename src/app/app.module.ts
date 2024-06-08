import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';

import { LoginComponent } from './login';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { LayoutComponent } from './admin-panel/layout/layout.component';
import { SecureLayoutComponent } from './super-admin-panel/secure-layout/secure-layout.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { OnlineRequestDemoComponent } from './online-request-demo/online-request-demo.component';
import { HeaderComponent } from './shared/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoaderService } from './_services/loader.service';
import { LoaderInterceptor } from './_helpers/loader.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MaterialModule } from '../material/material.module';
import * as moment from 'moment';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FrontendLayoutComponent } from './shared/frontend-layout/frontend-layout.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { PhoneMaskDirective } from './_helpers/directive/phone-mask.directive';
import { UsMobileNoPipe } from './_helpers/pipe/us-mobile-no.pipe';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingInterceptor } from './_helpers/loading.interceptor';
Date.prototype.toISOString = function () {
    return moment(this).format("YYYY-MM-DDTHH:mm:ss");
}
@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 5000, // 10 seconds
            closeButton: true,
            progressBar: true,
        }),
        NgbModule,
        MaterialModule,
        JwtModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        UnauthorizedComponent,
        LayoutComponent,
        SecureLayoutComponent,
        ForgetPasswordComponent,
        OnlineRequestDemoComponent,
        HeaderComponent,
        ResetPasswordComponent,
        ConfirmDialogComponent,
        HomePageComponent,
        FrontendLayoutComponent,
        PagenotfoundComponent,
        SpinnerComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        //{  provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService,
        LoaderService,
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
