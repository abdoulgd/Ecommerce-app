import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CHECKOUT_VALIDATORS, ShopValidators } from '../../validators/shop-validators';

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

  readonly checkoutFormGroup = this.formBuilder.group({
    customer: this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required, 
        Validators.minLength(CHECKOUT_VALIDATORS.MIN_NAME_LENGTH),
        ShopValidators.notOnlyWhitespace
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(CHECKOUT_VALIDATORS.MIN_NAME_LENGTH),
        ShopValidators.notOnlyWhitespace
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(CHECKOUT_VALIDATORS.EMAIL_PATTERN)
      ]) 
    }),
    shippingAddress: this.formBuilder.group({
      country: new FormControl('', [Validators.required]),
      street: new FormControl('', [
        Validators.required,
        Validators.minLength(CHECKOUT_VALIDATORS.MIN_ADDRESS_LENGTH),
        ShopValidators.notOnlyWhitespace
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.minLength(CHECKOUT_VALIDATORS.MIN_ADDRESS_LENGTH),
        ShopValidators.notOnlyWhitespace
      ]),
      state: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [
        Validators.required,
        Validators.pattern(CHECKOUT_VALIDATORS.ZIP_CODE_PATTERN),
        ShopValidators.notOnlyWhitespace
      ]),
    }),
    billingAddress: this.formBuilder.group({
      country: new FormControl('', [Validators.required]),
      street: new FormControl('', [
        Validators.required,
        Validators.minLength(CHECKOUT_VALIDATORS.MIN_ADDRESS_LENGTH),
        ShopValidators.notOnlyWhitespace
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.minLength(CHECKOUT_VALIDATORS.MIN_ADDRESS_LENGTH),
        ShopValidators.notOnlyWhitespace
      ]),
      state: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [
        Validators.required,
        Validators.pattern(CHECKOUT_VALIDATORS.ZIP_CODE_PATTERN),
        ShopValidators.notOnlyWhitespace
      ]),
    }),
    creditCard: this.formBuilder.group({
      cardType: new FormControl('', [Validators.required]),
      nameOnCard: new FormControl('', [
        Validators.required,
        Validators.minLength(CHECKOUT_VALIDATORS.MIN_NAME_LENGTH),
        ShopValidators.notOnlyWhitespace
      ]),
      cardNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{16}')
      ]),
      securityCode: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{3}'),
      ]),
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

  // getter methods
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer')!.get('lastName'); }
  get email() { return this.checkoutFormGroup.get('customer')!.get('email'); }

  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress')!.get('country'); }
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress')!.get('street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress')!.get('city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress')!.get('state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress')!.get('zipCode'); }

  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress')!.get('country'); }
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress')!.get('street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress')!.get('city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress')!.get('state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress')!.get('zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard')!.get('cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard')!.get('nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard')!.get('cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard')!.get('securityCode'); }
  get creditCardExpirationMonth() { return this.checkoutFormGroup.get('creditCard')!.get('expirationMonth'); }
  get creditCardExpirationYear() { return this.checkoutFormGroup.get('creditCard')!.get('expirationYear'); }

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

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

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
