import { Component, ElementRef, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AccountSettingService } from '@app/_services/admin-panel/Tenant/account-setting.service';
import { MasterService } from '@app/_services/master.service';
import { environment } from '@environments/environment';
import { first } from 'rxjs';

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
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageEvent: PageEvent | undefined;
  
  constructor(private _accountSettingService: AccountSettingService) {

  }
  ngOnInit() {
    var _param = {
      "id": 0,
      "pageNumber": 1,
      "pageSize": this.pageSize,
      "searchStr": "",
    }
    this.getAllUsers(_param);
    this._accountSettingService.userAdded.subscribe(res => {
      if (res) {
        this.getAllUsers(_param);
      }
    });
  }

  getAllUsers(param: any) {
    this.loading = true;
    this._accountSettingService.getAllUsers(param)
      .subscribe({
        next: (res: { data: any[]; }) => {
          this.users = res.data;
          this.users.forEach(res => {
            res.profileImagePath = this.apiBaseUrl + res.profileImagePath
          })
          this.loading = false;
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

  onPageChanged(e: any) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    var _param = {
      "id": 0,
      "pageNumber": e.pageIndex + 1,
      "pageSize": e.pageSize,
      "searchStr": ""
    }
    this.getAllUsers(_param);
  }  
}
