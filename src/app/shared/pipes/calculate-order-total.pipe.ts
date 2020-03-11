import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'calculateOrderTotal'
})
export class CalculateOrderTotalPipe implements PipeTransform {
    public totalPrice: number = 0;

    transform(cartItems: any): any {
        this.totalPrice = 0;
        cartItems['orderdetails'].forEach((items) => {
            this.totalPrice += (items.price) * items.quantity;
        });

        this.totalPrice += cartItems['tax'];
        this.totalPrice += cartItems['tipAmt'];
        this.totalPrice += cartItems['deliveryFee'];
        this.totalPrice -= parseFloat(cartItems['discountApplied'].discountAmount);

        return (this.totalPrice < 0) ? 0 : this.totalPrice.toFixed(2);
    }

}
