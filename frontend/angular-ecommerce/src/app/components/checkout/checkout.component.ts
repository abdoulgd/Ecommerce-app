import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  readonly formBuilder = inject(FormBuilder);

  readonly totalPrice: number = 0;
  readonly totalQuantity: number = 0;

  readonly  checkoutFormGroup = this.formBuilder.group({
    customer: this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''] 
    }),
    shippingAddress: this.formBuilder.group({
      country: [''],
      street: [''],
      city: [''],
      state: [''],
      zipCode: ['']
    }),
    billingAddress: this.formBuilder.group({
      country: [''],
      street: [''],
      city: [''],
      state: [''],
      zipCode: ['']
    }),
    creditCard: this.formBuilder.group({
      cardType: [''],
      nameOnCard: [''],
      cardNumber: [''],
      securityCode: [''],
      expirationMonth: [''],
      expirationYear: ['']
    })
 });

  ngOnInit() {
    this.checkoutFormGroup
  }

  copyShippingAddressToBillingAddress(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      this.checkoutFormGroup.controls.billingAddress
        .patchValue(this.checkoutFormGroup.controls.shippingAddress.value);
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }
 
  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')!.value); // ! est un opérateur de non-null assertion
    console.log(`The email address is ${this.checkoutFormGroup.get('customer')!.value.email}`);
  }

}
