import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneMaskDirective } from '@app/_helpers/directive/phone-mask.directive';
import { UsMobileNoPipe } from '@app/_helpers/pipe/us-mobile-no.pipe';
import { MaterialModule } from 'src/material/material.module';
import { StarRatingComponent } from '@app/shared/star-rating/star-rating.component';

@NgModule({
  imports: [  
    CommonModule,    
    MaterialModule  
  ],
  exports: [
    PhoneMaskDirective,
    UsMobileNoPipe,
    StarRatingComponent
  ],
  declarations: [
    PhoneMaskDirective,
    UsMobileNoPipe,
    StarRatingComponent
  ]
})
export class SharedModule { }
