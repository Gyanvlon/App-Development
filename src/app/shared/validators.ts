import { AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
export class MyValidators {
    static UpperCaseCharacter(c: FormControl) {
        const regex = /^[A-Z]+$/;
        if (regex.test(c.value)) {
          return null;
        } else {
          return { UpperCaseCharacter: true };
        }
      }
    static CharacterOnly(c: FormControl) {
    const letters = /^[A-Za-z]+$/;
      if (letters.test(c.value)) {
        return null;
      } else {
        return {CharacterOnly: true };
         }
        }
static NumberOnly(c: FormControl) {
    const letters = /^[0-9]+$/;
      if (letters.test(c.value)) {
        return null;
      } else {
        return {NumberOnly: true };
         }
        }

static NumberLength(control: AbstractControl): ValidationErrors | null {
    if (control.value.length !== 10) {
    return {NumberLength: true};
    }
    return null;
    }
    static symbol(c: FormControl) {
        const letters = /^[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,2}$/;
          if (letters.test(c.value)) {
            return null;
          } else {
            return {symbol: true };
             }
            }
static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
        if ((control.value as string).indexOf('0') >= 0) {
        return {cannotContainSpace: true };
        }
        return null;
     }
     static firstCharacter (c: FormControl) {
        const letters = /^[a-z]+\,[0-9]{6}$/;
        if (letters.test(c.value)) {
            return null;
          } else {
            return {firstCharacter: true };
             }
            }
}
