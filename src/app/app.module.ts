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
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HeaderComponent } from './shared/header/header.component';
import { BookingComponent } from './admin-panel/booking-section/booking/booking.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CreateCustomerComponent } from './admin-panel/shared/create-customer/create-customer.component';
import { LoaderService } from './_services/loader.service';
import { LoaderInterceptor } from './_helpers/loader.interceptor';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 15000, // 30 seconds
            closeButton: true,
            progressBar: true,
        }),
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        UnauthorizedComponent,
        LayoutComponent,
        SecureLayoutComponent,
        ForgetPasswordComponent,
        OnlineRequestDemoComponent,
        ResetPasswordComponent,
        HeaderComponent

    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        LoaderService,
        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
