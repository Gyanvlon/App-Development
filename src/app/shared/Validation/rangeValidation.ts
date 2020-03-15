import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MustGreater(firstValue: string, secondValue: string) {
    return (formGroup: FormGroup) => {
        const val1 = formGroup.controls[firstValue];
        const val2 = formGroup.controls[secondValue];
        // console.log('here is control',val1.value);
        // console.log('here is repeat',val2.value);

        if (val2.errors && !val2.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (val1.value+1 > val2.value) {
            val2.setErrors({ mustMatch: true });
        } else {
            val2.setErrors(null);
        }
    }
}
