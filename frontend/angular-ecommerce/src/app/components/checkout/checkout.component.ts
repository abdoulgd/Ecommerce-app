import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CHECKOUT_VALIDATORS, ShopValidators } from '../../validators/shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { Customer } from '../../common/customer';
import { Address } from '../../common/address';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly formService: FormService = inject(FormService);
  private readonly cartService: CartService = inject(CartService);
  private readonly checkoutService: CheckoutService = inject(CheckoutService);
  private readonly router: Router = inject(Router);

  totalPrice: number = 0;
  totalQuantity: number = 0;

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

    this.reviewCartDetails();
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

  // suscribe to cartService totalQuantity and totalPrice
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
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

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order(this.totalPrice, this.totalQuantity);

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // long way
    /*let orderItemsLong: OrderItem[] = [];
    for (let i = 0; i < cartItems.length; i++) {
      orderItemsLong[i] = new OrderItem(cartItems[i]);
    }*/

    // short way of doing the same thingy
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase - customer - order and orderItems
    let purchase = new Purchase(
      this.checkoutFormGroup.controls['customer'].value as Customer,
      this.checkoutFormGroup.controls['shippingAddress'].value as Address,
      this.checkoutFormGroup.controls['billingAddress'].value as Address,
      order,
      orderItems
    );

    // populate purchase - shipping address
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // call REST API via the checkoutService
    this.checkoutService.placeOrder( purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

        // reset cart
        this.resetCart();
      },
      error: err => {alert(`There was an error: ${err.message}`);}
    });
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    
    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl('/products');
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
