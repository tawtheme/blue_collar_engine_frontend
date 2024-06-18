import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaxRateComponent } from './add-tax-rate.component';

describe('AddTaxRateComponent', () => {
  let component: AddTaxRateComponent;
  let fixture: ComponentFixture<AddTaxRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTaxRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaxRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
