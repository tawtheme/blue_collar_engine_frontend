import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {

  constructor(private _route: Router) { }

  ngOnInit(): void {
  }

  redirectToBooking() {
    this._route.navigate(['/admin/create-booking']);
  }
}
