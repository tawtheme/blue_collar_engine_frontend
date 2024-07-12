import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent {
  @Input('rating') rating: number = 3;
  @Input('starCount') starCount: number = 5;
  @Input('color') color: string = 'accent';
  @Input('customDisable') customDisable: boolean = true;
  @Output() ratingUpdated = new EventEmitter();

  snackBarDuration: number = 2000;
  ratingArr: number[] = [];

  constructor(private snackBar: MatSnackBar) {
    
  }


  ngOnInit() {
    //////console.log("a "+this.starCount)
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
    //console.log(this.customDisable)
  }
  onClick(rating: number) {
    //////console.log(rating)
    // this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
    //   duration: this.snackBarDuration
    // });
    this.ratingUpdated.emit(rating);
    return false;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

}
export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}
