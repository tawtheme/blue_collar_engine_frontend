import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {


  constructor(private _route: Router) { 
    let getLink = window.location.href;
   // ////////console.log('window.location.href :' + getLink)

    const { hostname } = new URL(getLink);
    var subdomain = hostname.split(".")[0];
    //////////console.log(subdomain)
    if (subdomain != environment.baseUrlHostName) {
      this._route.navigate(['/booking']);
    }
  }

  ngOnInit(): void {
  }


 
}
