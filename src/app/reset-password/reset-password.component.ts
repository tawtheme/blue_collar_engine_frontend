import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { ConfirmedValidator } from '@app/shared/confirmed.validator';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  userId: string = '';
  token: string = '';
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, private authenticationService: AuthenticationService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.userId = params.userId;
        this.token = params.token;
      }
      );
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],

    }, {
      validator: ConfirmedValidator('password', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.loading = true;
    var param = {
      "userId": this.userId,
      "token": this.token,
      "password": this.f.password.value,
      "confirmPassword": this.f.confirmPassword.value
    }
    this.authenticationService.resetPassword(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          //console.log(res)
          this.submitted = false;
          this.resetPasswordForm.reset();
          this._toastrService.success(res.message, 'Success');          
        },
        error: error => {
          this.loading = false;
        }
      });
  }
}
