import { UserService } from './../services/user.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'calculateSavedPrice'
})
export class CalculateSavedPricePipe implements PipeTransform {

    public savedPrice: number = 0;
    public discountInfo: number = this.userService.getDiscountInfo();
    constructor(
        private userService: UserService
    ) { }

    transform(cartItems: Array<any>): any {
        this.discountInfo = this.userService.getDiscountInfo();
        this.savedPrice = 0;
        // cartItems.forEach((items) => {
        //     this.savedPrice += parseFloat(((items.offer.originalPrice - items.offer.salePrice) * items.quantity).toFixed(2));
        // });
        if (this.discountInfo) {
            this.savedPrice += this.discountInfo;
        }
        return this.savedPrice.toFixed(2);
    }

}
