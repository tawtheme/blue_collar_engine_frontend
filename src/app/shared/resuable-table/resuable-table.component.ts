import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resuable-table',
  templateUrl: './resuable-table.component.html',
  styleUrls: ['./resuable-table.component.scss']
})
export class ResuableTableComponent implements OnInit {
  @Input() data: any[] = [];

  sortNull() { return 0; }
  constructor() { }

  ngOnInit(): void {
  }

}
