import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';
import { Role, User } from '@app/_models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    user: User;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService, private snackBar: MatSnackBar
        
    ) {
        ////debugger
        // redirect to home if already logged in
        if (this.authenticationService.userValue) {
            this.router.navigate(['/login']);
        }
        this.user = <User>this.authenticationService.userValue;
       

    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
            password: ['', [Validators.required]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.user = <any>this.authenticationService.userValue;
                    this.loading = false;
                    if (this.user.data.role == Role.SuperAdmin) {
                        this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/secure-panel');
                    }
                    if (this.user.data.role == Role.Admin) {
                        this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/admin');
                    }
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }
}

export class UsernameValidator {  
    static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {  
        if((control.value as string).indexOf(' ') >= 0){  
            return {cannotContainSpace: true}  
        }      
        return null;  
    }  
}  
