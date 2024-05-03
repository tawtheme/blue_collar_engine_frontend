import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderHeaderComponent } from './calender-header.component';

describe('CalenderHeaderComponent', () => {
  let component: CalenderHeaderComponent;
  let fixture: ComponentFixture<CalenderHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalenderHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
