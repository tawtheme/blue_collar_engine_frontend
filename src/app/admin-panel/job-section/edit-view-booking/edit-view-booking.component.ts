import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TenantService } from '@app/_services/secure-panel/tenant.service';
import { BookingService } from '@app/_services/admin-panel/booking/booking.service';
import { first } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-view-booking',
  templateUrl: './edit-view-booking.component.html',
  styleUrls: ['./edit-view-booking.component.scss']
})
export class EditViewBookingComponent {
  bookingInfo: any;
  _value: number = 0;
  _step: number = 1;
  _min: number = 0;
  _max: number = Infinity;
  _wrap: boolean = false;
  loading = false;
  assignTeam: any = [];
  selectedValues: any = [];
  basePath: string = environment.apiUrl;
  bookingIsJobFinished: boolean = false;
  bookingInvoiceCreated: boolean = false;
  isEnableEdit: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<EditViewBookingComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any, private _tenantService: TenantService, private _dialog: MatDialog, private _bookingService: BookingService, private _toastrService: ToastrService, private _router: Router
  ) { }

  ngOnInit() {
    this.bookingInfo = this.data.bookingInfo;
    this.isEnableEdit = this.data.isEnableEdit;
    console.log(this.bookingInfo)
    if (this.bookingInfo.categories.length > 0) {
      this.bookingInfo.categories.forEach(function (service: any) {
        if (service.products.length > 0) {
          service.products[0].imagePath = environment.apiUrl + '/' + service.products[0].imagePath;
        }
      })
    }
    this.bindAssignTeamList();

    this._bookingService.bookingStepData.subscribe(res => {
      if (res != null) {
        //console.log(res)
        this.bookingIsJobFinished = res.isJobFinished;
        this.bookingInvoiceCreated = res.invoiceCreatedDate == null ? false : true
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  bindAssignTeamList() {
    this._bookingService.getBookingAssignTeam(0)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.assignTeam = res.data;
          ////console.log(this.assignTeam)
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  selectionChange(event: {
    isUserInput: any; source: { value: any; selected: any };
  }) {
    if (event.isUserInput) {
      if (event.source.selected === true) {
        this.selectedValues.push(event.source.value)
      } else {
        let index = this.selectedValues.indexOf(event.source.value);
        this.selectedValues.splice(index, 1);
      }
    }
    //console.log(this.selectedValues)
  }

  save() {
    if (this.selectedValues.length == 0) {
      this._toastrService.error("Please assign atleast one team member", "Error");
      return;
    }
    else {
      var _param = {
        bookingId: this.bookingInfo.bookingId,
        TeamUserIdList: this.selectedValues
      }
      this._bookingService.assignTeamMember(_param)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.loading = false;
            this._toastrService.success(res.message, 'Success');
            this.cancel();
            this._bookingService.bookingTeamMemberAssign.next(true);
          },
          error: error => {
            this.loading = false;
          }
        });
    }
  }

  redirectToInvoice(bookingId: number) {
    //console.log(bookingId)
    this._router.navigate(['/admin/create-invoice'], { queryParams: { bookingId: bookingId } });
    this.cancel();
  }

}
