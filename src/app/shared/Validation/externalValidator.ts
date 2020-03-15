import { AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
export class MyValidators {
    static NumberOnly(c: FormControl) {
        const letters = /^[0-9]+$/;
        if (letters.test(c.value)) {
           return null;
           } else {
            return {NumberOnly: true };
             }
        }
      
    }
  