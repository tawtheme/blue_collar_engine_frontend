import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestDemoComponent } from './view-request-demo.component';

describe('ViewRequestDemoComponent', () => {
  let component: ViewRequestDemoComponent;
  let fixture: ComponentFixture<ViewRequestDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRequestDemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRequestDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
