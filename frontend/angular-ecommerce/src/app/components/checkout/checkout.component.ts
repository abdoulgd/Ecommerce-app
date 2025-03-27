import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  readonly formBuilder = inject(FormBuilder);
  readonly formService = inject(FormService);

  readonly totalPrice: number = 0;
  readonly totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = []; 

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

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
    this.checkoutFormGroup;
    this.getCreditCardMonths();
    this.getCreditCardYears();
    this.getCountries(); 
  }

  // populate credit card months
  getCreditCardMonths() {
    const startMonth: number = new Date().getMonth() + 1;
    console.log('startMonth: ' + startMonth);

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  // populate credit card years
  getCreditCardYears() {
    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log('Retrieved credit card years: ' + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
  }

  // populate countries
  getCountries() {
    this.formService.getCountries().subscribe(
      data => {
        console.log('Retrieved countries: ' + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.formService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  copyShippingAddressToBillingAddress(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      this.checkoutFormGroup.controls.billingAddress
        .patchValue(this.checkoutFormGroup.controls.shippingAddress.value);

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();

      // bug fix for states
      this.billingAddressStates = []; 
    }
  }
 
  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')!.value); // ! est un opérateur de non-null assertion
    console.log(`The email address is ${this.checkoutFormGroup.get('customer')!.value.email}`);

    console.log(`The shipping address country is ${this.checkoutFormGroup?.get('shippingAddress')!.value.country }`);
    console.log(`The shipping address state is ${this.checkoutFormGroup.get('shippingAddress')?.value.state}`);
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup!.value.expirationYear);

    // if the current year equals the selected year, then start with the current month
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

}
