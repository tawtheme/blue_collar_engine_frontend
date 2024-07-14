import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent {
  changePasswordForm!: FormGroup;
  submitted = false;
  loading = false;
  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;
  constructor(private _accountSettingService: AccountSettingService, private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(20), Validators.pattern(this.passwordRegex)])],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: ConfirmPasswordValidator('newPassword', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.changePasswordForm.controls; }

  ngOnChanges() {

  }

  onSubmit() {
    this.submitted = true;
    var param = this.changePasswordForm.value;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.loading = true;
    this._accountSettingService.changePassword(param)
      .subscribe({
        next: (res) => {
          this.submitted = false;
          this._snackBar.open(res.message,'Close');
          this.authenticationService.logout();
          this.router.navigate(['/login']);          
        },
        error: (e) => {
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
  
}

export function ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    let control = formGroup.controls[controlName];
    let matchingControl = formGroup.controls[matchingControlName]
    if (
      matchingControl.errors &&
      !matchingControl.errors.confirmPasswordValidator
    ) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmPasswordValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}