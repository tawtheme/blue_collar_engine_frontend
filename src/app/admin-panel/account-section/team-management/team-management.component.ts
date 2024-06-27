import { Component, ElementRef, ViewChild } from '@angular/core';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss']
})
export class TeamManagementComponent {
  users: any[] = [];
  userInfo: any;
  loading: boolean = false;
  @ViewChild('addUserCancelEle') addUserCancelEle!: ElementRef<HTMLElement>;
  apiBaseUrl: string = environment.apiUrl + '/';
  constructor(private _accountSettingService: AccountSettingService) {

  }

  ngOnInit() {
    this.getAllUsers();
    this._accountSettingService.userAdded.subscribe(res => {
      if (res) {
        this.getAllUsers();
      }
    });
  }

  getAllUsers() {
    this.loading = true;
    this._accountSettingService.getAllUsers()
      .subscribe({
        next: (res: { data: any[]; }) => {
          this.users = res.data;
          this.users.forEach(res => {
            res.profileImagePath = this.apiBaseUrl + res.profileImagePath
          })
          this.loading = false;
          //console.log(this.users)
        }
      });
  }

  editUser(userInfo: any) {
    this.userInfo = userInfo;
    let el: HTMLElement = this.addUserCancelEle.nativeElement;
    el.click();
  }

  addNewUser() {
    this.userInfo = null;
    let el: HTMLElement = this.addUserCancelEle.nativeElement;
    el.click();
  }

  onChange(ev: any) {
    if (ev.checked) {
      ev.source.checked = false;
    }
    else {
      ev.source.checked = true;
    }
  }
}
