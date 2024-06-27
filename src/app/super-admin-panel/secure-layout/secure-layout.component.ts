import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-secure-layout',
  templateUrl: './secure-layout.component.html',
  styleUrls: ['./secure-layout.component.scss']
})
export class SecureLayoutComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private _route: Router) {
    let getLink = window.location.href;
    //console.log('window.location.href :' + getLink)
    const { hostname } = new URL(getLink);
    var subdomain = hostname.split(".")[0];
    //console.log(subdomain)
    if (subdomain != environment.baseUrlHostName) {
      this._route.navigate(['/booking']);
    }
  }

  ngOnInit(): void {
  }


  logout() {
    this.authenticationService.logout();
  }


}
