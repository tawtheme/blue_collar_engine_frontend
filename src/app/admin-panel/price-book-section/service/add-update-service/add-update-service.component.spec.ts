import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateServiceComponent } from './add-update-service.component';

describe('AddUpdateServiceComponent', () => {
  let component: AddUpdateServiceComponent;
  let fixture: ComponentFixture<AddUpdateServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
