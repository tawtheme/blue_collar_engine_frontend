import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneMaskDirective } from '@app/_helpers/directive/phone-mask.directive';
import { UsMobileNoPipe } from '@app/_helpers/pipe/us-mobile-no.pipe';
import { MaterialModule } from 'src/material/material.module';
import { StarRatingComponent } from '@app/shared/star-rating/star-rating.component';
import { OnlynumberDirective } from '@app/_helpers/directive/onlynumber.directive';
import { NumericDirective } from '@app/_helpers/directive/numeric.directive';
import { FaqsComponent } from './faqs/faqs.component';
import { CtaSectionComponent } from './cta-section/cta-section.component';
import { NewsAndBlogsComponent } from './news-and-blogs/news-and-blogs.component';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [CommonModule, MaterialModule, PerfectScrollbarModule],
  exports: [
    PhoneMaskDirective,
    UsMobileNoPipe,
    OnlynumberDirective,
    NumericDirective,
    StarRatingComponent,
    FaqsComponent,
    CtaSectionComponent,
    NewsAndBlogsComponent,
    PerfectScrollbarModule
  ],
  declarations: [
    PhoneMaskDirective,
    OnlynumberDirective,
    UsMobileNoPipe,
    NumericDirective,
    StarRatingComponent,
    FaqsComponent,
    CtaSectionComponent,
    NewsAndBlogsComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule {}
