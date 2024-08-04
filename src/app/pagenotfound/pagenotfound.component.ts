import { Component } from '@angular/core';
import {Location} from '@angular/common';
@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PagenotfoundComponent {
  constructor(private _location: Location) 
  {}

  backToPrevious(){
    this._location.back();
  }
}
