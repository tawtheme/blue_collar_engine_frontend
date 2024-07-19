// // src/app/services/mcustomscrollbar.service.ts
// import { Injectable } from '@angular/core';
// declare var $: any;

// @Injectable({
//   providedIn: 'root',
// })
// export class MCustomScrollbarService {
//   constructor() {}

//   initializeMCustomScrollbar(selector: string) {
//     $(document).ready(() => {
//       $(selector).mCustomScrollbar({
//         theme: 'minimal-dark',
//         scrollInertia: 150,
//         axis: 'y',
//         mouseWheel: { enable: true },
//         autoHideScrollbar: true,
//         advanced: { updateOnContentResize: true },
//       });
//     });
//   }
// }

import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class MCustomScrollbarService {
  constructor() {}

  applyCustomScrollbar(selectors: string | string[]) {
    $(document).ready(() => {
      if (Array.isArray(selectors)) {
        selectors.forEach((selector) => {
          this.initializeScrollbar(selector);
        });
      } else {
        this.initializeScrollbar(selectors);
      }
    });
  }

  private initializeScrollbar(selector: string) {
    $(selector).each(function (this: HTMLElement) {
      console.log(`Initializing scrollbar for: ${selector}`);
      if (!$(this).hasClass('mCustomScrollbar')) {
        $(this).mCustomScrollbar({
          theme: 'minimal-dark',
          scrollInertia: 150,
          axis: 'y',
          mouseWheel: { enable: true },
          autoHideScrollbar: true,
          advanced: { updateOnContentResize: true },
        });
      } else {
        console.log(`Scrollbar already initialized for: ${selector}`);
      }
    });
  }
}
