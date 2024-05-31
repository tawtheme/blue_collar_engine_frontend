import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneMaskDirective } from '@app/_helpers/directive/phone-mask.directive';
import { UsMobileNoPipe } from '@app/_helpers/pipe/us-mobile-no.pipe';



@NgModule({
  imports: [    
  ],
  exports: [
    PhoneMaskDirective,
    UsMobileNoPipe
  ],
  declarations: [
    PhoneMaskDirective,
    UsMobileNoPipe
  ]
})
export class SharedModule { }
