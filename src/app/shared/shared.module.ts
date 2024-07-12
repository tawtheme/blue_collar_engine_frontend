import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneMaskDirective } from '@app/_helpers/directive/phone-mask.directive';
import { UsMobileNoPipe } from '@app/_helpers/pipe/us-mobile-no.pipe';
import { MaterialModule } from 'src/material/material.module';
import { StarRatingComponent } from '@app/shared/star-rating/star-rating.component';
import { OnlynumberDirective } from '@app/_helpers/directive/onlynumber.directive';
import { NumericDirective } from '@app/_helpers/directive/numeric.directive';

@NgModule({
  imports: [  
    CommonModule,    
    MaterialModule  
  ],
  exports: [
    PhoneMaskDirective,
    UsMobileNoPipe,
    OnlynumberDirective,
    NumericDirective,
    StarRatingComponent
  ],
  declarations: [
    PhoneMaskDirective,
    OnlynumberDirective,
    UsMobileNoPipe,
    NumericDirective,
    StarRatingComponent
  ]
})
export class SharedModule { }
