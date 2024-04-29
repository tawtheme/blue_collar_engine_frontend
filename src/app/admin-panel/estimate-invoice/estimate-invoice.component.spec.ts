import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateInvoiceComponent } from './estimate-invoice.component';

describe('EstimateInvoiceComponent', () => {
  let component: EstimateInvoiceComponent;
  let fixture: ComponentFixture<EstimateInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimateInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimateInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
