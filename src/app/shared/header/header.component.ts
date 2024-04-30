import { Component, OnInit } from '@angular/core';
import { Role, User } from '@app/_models';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user?: User | null;
  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe(x => this.user = x);
  }

  ngOnInit(): void { }

  get isAdmin() {
    return this.user?.data.role === Role.Admin;
  }

  logout() {
    this.authenticationService.logout();
  }
}
