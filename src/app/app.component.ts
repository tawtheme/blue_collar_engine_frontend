import {
  Component,
  HostListener,
  Renderer2,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { AuthenticationService } from './_services';
import { Router, NavigationEnd, Event } from '@angular/router';
import { User, Role } from './_models';
import { LoaderService } from './_services/loader.service';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent implements AfterViewInit {
  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(e: KeyboardEvent) {
  //   ////console.log(e)
  //   if (e.key === 'F12') {
  //     return false;
  //   }
  //   if (e.ctrlKey && e.shiftKey && e.key === "I") {
  //     return false;
  //   }
  //   if (e.ctrlKey && e.shiftKey && e.key === "C") {
  //     return false;
  //   }
  //   if (e.ctrlKey && e.shiftKey && e.key === "J") {
  //     return false;
  //   }
  //   if (e.ctrlKey && e.key == "U") {
  //     return false;
  //   }
  //   return true;
  // }
  user?: User | null;
  loading: boolean = false;
  constructor(
    private authenticationService: AuthenticationService,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
    // document.addEventListener('contextmenu', function(e) {
    //   e.preventDefault();
    // });
  }

  get isAdmin() {
    return this.user?.data.role === Role.Admin;
  }

  logout() {
    this.authenticationService.logout();
  }

  ngAfterViewInit() {
    //this.loading = true;
    this.loaderService.httpProgress().subscribe((status: boolean) => {
      if (status) {
        this.loading = true;
        //this.renderer.addClass(document.body, 'cursor-loader');
      } else {
        this.loading = false;
        //this.renderer.removeClass(document.body, 'cursor-loader');
      }
    });
  }
}
