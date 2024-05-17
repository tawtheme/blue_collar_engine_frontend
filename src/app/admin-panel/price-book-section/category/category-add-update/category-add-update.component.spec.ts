import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAddUpdateComponent } from './category-add-update.component';

describe('CategoryAddUpdateComponent', () => {
  let component: CategoryAddUpdateComponent;
  let fixture: ComponentFixture<CategoryAddUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryAddUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
