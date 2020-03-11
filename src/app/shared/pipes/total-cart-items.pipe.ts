import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'totalCartItems'
})
export class TotalCartItemsPipe implements PipeTransform {
    public totalItems: number = 0
    transform(cartItems: Array<any>, args?: any): any {
        this.totalItems = 0;
        cartItems.forEach((items) => {
            this.totalItems += parseInt(items.quantity);
        });
        return this.totalItems;
    }

}
