import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }
  createInvoice(){
    this._router.navigate(['/admin/create-invoice'])
  }
}
