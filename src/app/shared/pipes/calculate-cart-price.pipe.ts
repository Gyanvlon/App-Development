import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'calculateCartPrice'
})
export class CalculateCartPricePipe implements PipeTransform {

    transform(value: any, quantity: number): any {
        console.log("value", value);
        return parseFloat((value * quantity).toFixed(2))
    }

}
