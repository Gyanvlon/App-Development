import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'calculatePointsEarned'
})
export class CalculatePointsEarnedPipe implements PipeTransform {
    public totalItems: number = 0
    transform(cartItems: Array<any>, args?: any): any {
        this.totalItems = 0;
        cartItems.forEach((items) => {
            this.totalItems += items.quantity;
        });
        return this.totalItems * 10;
    }

}
