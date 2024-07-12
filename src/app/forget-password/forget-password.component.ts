import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { first } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  @ViewChild('resetSuccess') resetSuccessEle!: ElementRef<HTMLElement>;
  @ViewChild('submitForgetPassword') submitForgetPasswordEle!: ElementRef<HTMLElement>;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.forgetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.forgetPasswordForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.forgetPassword(this.f.email.value)
      .subscribe((res) => {
        this.loading = false;
        //////console.log(res)
        this.submitted = false;
        this.forgetPasswordForm.reset();

        let el: HTMLElement = this.resetSuccessEle.nativeElement;
        el.click();
      });
  }

  resendResetPassword() {
    let el: HTMLElement = this.submitForgetPasswordEle.nativeElement;
    // el.click();
  }
  dismissModal() {
    let el: HTMLElement = this.resetSuccessEle.nativeElement;
    el.click();
    this.router.navigate(['/login']);
  }

}
