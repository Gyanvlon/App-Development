import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'calculateSubtotal'
})
export class CalculateSubtotalPipe implements PipeTransform {

    public subtotalPrice: number = 0;

    transform(cartItems: Array<any>, type: string = "offer"): any {
        this.subtotalPrice = 0;
        if (type == "order") {
            cartItems.forEach((items) => {
                this.subtotalPrice += (items.price) * items.quantity;
            });
        } else {
            cartItems.forEach((items) => {
                this.subtotalPrice += (items.offer.salePrice) * items.quantity;
            });
        }

        return (this.subtotalPrice < 0) ? 0 : this.subtotalPrice.toFixed(2);
    }

}
