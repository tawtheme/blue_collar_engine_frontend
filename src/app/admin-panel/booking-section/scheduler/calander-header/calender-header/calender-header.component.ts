import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calender-header',
  templateUrl: './calender-header.component.html',
  styleUrls: ['./calender-header.component.scss']
})

export class CalenderHeaderComponent {

  @Input()
  view!: CalendarView;

  @Input()
  viewDate!: Date;

  @Input() locale: string = 'en';

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;

}

