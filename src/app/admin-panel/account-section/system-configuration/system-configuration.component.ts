import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/confirm-dialog/confirm-dialog/confirm-dialog.component';
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
  isEditDisabled: boolean = true;
  isShowHideBtn: boolean = false;
  invoiceTermConditionForm!: FormGroup;
  constructor(private _accountSettingService: AccountSettingService, private formBuilder: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog) {

  }
  ngOnInit() {
    this.configurationForm = this.formBuilder.group({
      id: [0, null],
      secretKey: ['', [Validators.required, Validators.maxLength(500)]],
      publishableKey: ['', [Validators.required, Validators.maxLength(500)]],
      isActive: [true, null],
      secretKeyMask: [null, null],
      publishableKeyMask: [null, null]
    });

    this.invoiceTermConditionForm = this.formBuilder.group({
      termsConditionId: 0,
      type: ['IT', null],
      termAndConditionDetail: this.formBuilder.array([])
    });
    this.get();
    this.bindTermConditions();
  }

  termAndConditionDetail(): FormArray {
    return this.invoiceTermConditionForm.get("termAndConditionDetail") as FormArray
  }

  newTermCondition(): FormGroup {
    return this.formBuilder.group({
      termsConditionId: 0,
      description: ['', [Validators.required]],
      termsConditionDetailId: 0
    })
  }

  addNewTermCondition() {
    this.termAndConditionDetail().push(this.newTermCondition());
  }

  removeTermCondition(i: number) {
    const message = `Are you sure you want to delete?`;
    const dialogData = new ConfirmDialogModel("Confirmation", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.termAndConditionDetail().removeAt(i);
      }
      else {
        return;
      }
    });
  }

  onSubmitTermCondition() {
    this.submitted = true;
    if (this.invoiceTermConditionForm.invalid) {
      return;
    }
    let param = this.invoiceTermConditionForm.value as any;
    param = { ...param, ...{ type: 'IT' } };
    //console.log(param)
    this._accountSettingService.addUpdateTermsConditions(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this._snackBar.open(res.message,'Close');
        },
        error: () => {

        }
      });
  }

  bindTermConditions() {
    this._accountSettingService.getTermsConditions('IT')
      .pipe(first())
      .subscribe({
        next: (res) => {
          //console.log(res.data)
          this.termAndConditionDetail().clear();
          if (res.data != null) {
            res.data.termAndConditionDetail.forEach((t: { batches: any[]; }) => {
              var _termCondition: FormGroup = this.newTermCondition();
              this.termAndConditionDetail().push(_termCondition);
            });
            this.invoiceTermConditionForm.patchValue(res.data);
            //console.log(this.invoiceTermConditionForm.value)
          }
        },
        error: () => {
        }
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.configurationForm.controls; }

  onSubmit() {
    this.submitted = true;
    var param = this.configurationForm.getRawValue();
    if (this.configurationForm.invalid) {
      return;
    }
    //////console.log(param)
    this.loading = true;
    this._accountSettingService.addUpdateStripeConfiguration(param)
      .subscribe({
        next: (res) => {
          this.submitted = false;
          this._snackBar.open(res.message,'Close');
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
          if (res.data != null) {
            this.isEditDisabled = true;
            this.configurationForm.controls['secretKeyMask'].disable();
            this.configurationForm.controls['publishableKeyMask'].disable();
          }
          else {
            this.isEditDisabled = false;
          }

        },
        error: error => {
        }
      });
  }

  editConfiguration() {
    this.isEditDisabled = false;
    this.isShowHideBtn = true;
  }

  hideConfiguration() {
    this.isEditDisabled = true;
  }
}
