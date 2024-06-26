import { Component, Input, OnInit, HostListener } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-frontend-layout',
  templateUrl: './frontend-layout.component.html',
  styleUrls: ['./frontend-layout.component.scss'],
})
export class FrontendLayoutComponent {
  constructor(private _route: Router) {
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
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach((item) => {
      item.addEventListener('show.bs.collapse', () => {
        accordionItems.forEach((i) => i.classList.remove('opened'));
        item.classList.add('opened');
      });
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const mainHeader = document.querySelector('.main-header');
    if (window.scrollY > 50) {
      mainHeader?.classList.add('sticky-active');
    } else {
      mainHeader?.classList.remove('sticky-active');
    }
  }
}
