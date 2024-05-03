import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  createJob() {
    this._router.navigate(['/admin/create-job']);
  }
}
