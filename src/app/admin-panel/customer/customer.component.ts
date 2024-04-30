import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TagInputModule],

})
export class CustomerComponent implements OnInit {

  customerForm!: FormGroup;
  loading = false;
  submitted = false;
  count_user_click = 0;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      fname: ['', Validators.required, Validators.maxLength(50)],
      lname: ['', Validators.required, Validators.maxLength(50)],
      companyName: ['', Validators.maxLength(200)],
      contacts: this.formBuilder.array([]),
      emailAddress: ['', Validators.required, Validators.maxLength(200)],
      address: ['', Validators.required, Validators.maxLength(500)],
      state: ['', Validators.required, Validators.maxLength(50)],
      city: ['', Validators.required, Validators.maxLength(50)],
      zipCode: ['', Validators.required, Validators.maxLength(10)],
      IsDefaultBillingAddress: [true],
      tags: ['', Validators.required, Validators.maxLength(500)],
      status: ['A', null],
    });
  }

  contacts(): FormArray {
    return this.customerForm.get("contacts") as FormArray
  }

  newcontact(): FormGroup {
    return this.formBuilder.group({
      contact: ['', Validators.required]
    })
  }

  addMoreContact() {
    this.contacts().push(this.newcontact());
  }

  removeContact(i: number) {
    this.contacts().removeAt(i);
  }

  // convenience getter for easy access to form fields
  get f() { return this.customerForm.controls; }



  onSubmit() {
    this.submitted = true;
    if (this.customerForm.invalid) {
      return;
    }
    console.log(this.customerForm.value);
    this.loading = true;
  }

}
