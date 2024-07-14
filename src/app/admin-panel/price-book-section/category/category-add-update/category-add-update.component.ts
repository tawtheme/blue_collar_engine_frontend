import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategoryService } from '@app/_services/admin-panel/category/category.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';

@Component({
  selector: 'app-category-add-update',
  templateUrl: './category-add-update.component.html',
  styleUrls: ['./category-add-update.component.scss']
})
export class CategoryAddUpdateComponent {
  @Input() items?: any;
  categoryForm!: FormGroup;
  loading = false;
  submitted = false;
  @ViewChild('customerCancelEle') customerCancelEle!: ElementRef<HTMLElement>;
  constructor(private formBuilder: FormBuilder, private _categoryService: CategoryService, private _router: Router, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      categoryId: [0, null],
      name: ['', [Validators.required]],
      description: ['', null],
      status: ['A', null]
    });
  }

  ngOnChanges() {
    if (this.items == null) {
      this.categoryForm.reset();
      this.categoryForm.controls['categoryId'].setValue(0);
      this.categoryForm.controls['status'].setValue('A');
      return;
    }
    else {
      this.categoryForm.patchValue(this.items);
    }

  }
  // convenience getter for easy access to form fields
  get f() { return this.categoryForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.categoryForm.invalid) {
      return;
    }
    let param = this.categoryForm.value as any;
    //////console.log(param);
    this.loading = true;
    this._categoryService.addUpdate(param)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.loading = false;
          //////console.log(res)
          let el: HTMLElement = this.customerCancelEle.nativeElement;
          el.click();
          this._snackBar.open(res.message,'Close');
          this._categoryService.categoryAdded.next(true);
        },
        error: error => {
          this.loading = false;
        }
      });
  }
}
