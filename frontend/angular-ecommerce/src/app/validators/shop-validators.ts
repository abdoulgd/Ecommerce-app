import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {

    // Whitespace validator
    static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
        const value = control.value?.trim();

        // Check if string only contains whitespace
        if ((control.value != null) && value.length === 0) {

            // invalid, return rrror object 
            return { 'notOnlyWhitespace': true };
        }

        // valid, return null
        return null;
    }
}

// Validators for checkout form
export const CHECKOUT_VALIDATORS = {
    // customer
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    EMAIL_PATTERN: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,

    // shipping and billing address
    MIN_ADDRESS_LENGTH: 5,
    MAX_ADDRESS_LENGTH: 50,
    MIN_CITY_LENGTH: 2,
    MAX_CITY_LENGTH: 50,
    ZIP_CODE_PATTERN: /^[0-9]{5}(-[0-9]{4})?$/,

    // credit card
    //CREDIT-CARD_PATTERN: /^[0-9]{16}$/,
  } as const; // Rend les valeurs immuables (optionnel)