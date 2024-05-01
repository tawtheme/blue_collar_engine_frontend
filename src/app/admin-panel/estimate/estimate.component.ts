import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.scss']
})
export class EstimateComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }
  createEstimate(){
    this._router.navigate(['/admin/create-estimate'])
  }
}
