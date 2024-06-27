import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';

@Component({
  selector: 'app-system-configuration',
  templateUrl: './system-configuration.component.html',
  styleUrls: ['./system-configuration.component.scss']
})
export class SystemConfigurationComponent {
  configurationForm!: FormGroup;
  submitted = false;
  loading = false;
  constructor(private _accountSettingService: AccountSettingService, private formBuilder: FormBuilder, private _toastrService: ToastrService) {

  }
  ngOnInit() {
    this.configurationForm = this.formBuilder.group({
      id: [0, null],
      secretKey: ['', [Validators.required, Validators.maxLength(500)]],
      publishableKey: ['', [Validators.required, Validators.maxLength(500)]],
      isActive: [true, null]
    });
    this.get();
  }
  // convenience getter for easy access to form fields
  get f() { return this.configurationForm.controls; }

  onSubmit() {
    this.submitted = true;
    var param = this.configurationForm.getRawValue();
    if (this.configurationForm.invalid) {
      return;
    }
    this.loading = true;
    this._accountSettingService.addUpdateStripeConfiguration(param)
      .subscribe({
        next: (res) => {
          this.submitted = false;
          this._toastrService.success(res.message, 'Success');
        },
        error: (e) => {
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  get() {
    this._accountSettingService.getStripeConfiguration()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.configurationForm.patchValue(res.data);
        },
        error: error => {
        }
      });
  }
}
