import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResuableTableComponent } from './resuable-table.component';

describe('ResuableTableComponent', () => {
  let component: ResuableTableComponent;
  let fixture: ComponentFixture<ResuableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResuableTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResuableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
