import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineRequestDemoComponent } from './online-request-demo.component';

describe('OnlineRequestDemoComponent', () => {
  let component: OnlineRequestDemoComponent;
  let fixture: ComponentFixture<OnlineRequestDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineRequestDemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineRequestDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
