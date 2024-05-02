import { Component, Renderer2 } from '@angular/core';

import { AuthenticationService } from './_services';
import { User, Role } from './_models';
import { LoaderService } from './_services/loader.service';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
    user?: User | null;

    constructor(private authenticationService: AuthenticationService, private loaderService: LoaderService, private renderer: Renderer2) {
        this.authenticationService.user.subscribe(x => this.user = x);
    }

    get isAdmin() {
        return this.user?.data.role === Role.Admin;
    }  

    logout() {
        this.authenticationService.logout();
    }

    ngAfterViewInit() {
        this.loaderService.httpProgress().subscribe((status: boolean) => {
          if (status) {
            this.renderer.addClass(document.body, 'cursor-loader');
          } else {
            this.renderer.removeClass(document.body, 'cursor-loader');
          }
        });
      }
}