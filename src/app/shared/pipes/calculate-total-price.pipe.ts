import { UserService } from './../services/user.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'calculateTotalPrice',
    pure: false
})
export class CalculateTotalPricePipe implements PipeTransform {
    constructor(
        private userService: UserService
    ) { }

    public totalPrice: number = 0;
    public totalTaxPrice: number = 0; //to display
    public totalPriceForTax: number = 0;
    public taxRate: any = 0;
    public discountInfo: number = 0;
    public discountJson: any;
    public deliveryFees: number = 0;
    public tipAmount: any = 0;
    public establishmentArray: Array<any>;
    public taxInfoJson: any;

    transform(cartItems: Array<any>): any {
        this.taxRate = this.userService.getTaxRate();
        this.discountInfo = this.userService.getDiscountInfo();
        this.discountJson = this.userService.getDiscountJson();
        this.deliveryFees = this.userService.getDeliveryFee();
        this.tipAmount = this.userService.getTipAmount();
        this.establishmentArray = [];
        this.taxInfoJson = {};
        this.totalPrice = 0;
        this.totalTaxPrice = 0;

        cartItems.forEach((items) => {
            this.totalPrice += (items.offer.salePrice) * items.quantity;
            if (typeof this.establishmentArray[items.establishmentId] != "undefined") {
                this.establishmentArray[items.establishmentId].push(items);
            } else {
                this.establishmentArray[items.establishmentId] = [];
                this.establishmentArray[items.establishmentId].push(items);
            }
        });

        for (let i in this.establishmentArray) {
            let totalPriceForTax = 0;
            let establishmentId = "";
            this.establishmentArray[i].forEach((item) => {
                establishmentId = item.offer.establishmentId;
                totalPriceForTax += (item.offer.salePrice) * item.quantity;
            })
            if (typeof this.discountJson.est1 != "undefined" && this.discountJson.est1.establishmentId == establishmentId) {
                // totalPriceForTax -= this.discountJson.est1.volumeDisc;
                // totalPriceForTax = totalPriceForTax - this.discountJson.est1.volumeDisc - this.discountJson.est1.deposits;
                totalPriceForTax -= this.discountJson.est1.nonTaxableAmt;
                totalPriceForTax = (totalPriceForTax * this.taxRate[establishmentId]);
                this.taxInfoJson[establishmentId] = parseFloat(totalPriceForTax.toFixed(2));
                this.totalTaxPrice += totalPriceForTax;
            } else if (typeof this.discountJson.est2 != "undefined" && this.discountJson.est2.establishmentId == establishmentId) {
                // totalPriceForTax -= this.discountJson.est2.volumeDisc;
                // totalPriceForTax = totalPriceForTax - this.discountJson.est2.volumeDisc - this.discountJson.est2.deposits;
                totalPriceForTax -= this.discountJson.est2.nonTaxableAmt;
                totalPriceForTax = (totalPriceForTax * this.taxRate[establishmentId]);
                this.taxInfoJson[establishmentId] = parseFloat(totalPriceForTax.toFixed(2));;
                this.totalTaxPrice += totalPriceForTax;
            }
        }

        if (this.discountInfo) {
            this.totalPrice -= this.discountInfo;
        }

        this.totalPrice += parseFloat(this.totalTaxPrice.toFixed(2));

        if (this.deliveryFees) {
            this.totalPrice += this.deliveryFees;
        }

        if (this.tipAmount) {
            this.totalPrice += parseFloat(this.tipAmount);
        }

        return (this.totalPrice < 0) ? 0 : (Math.round(this.totalPrice * 100 + Number.EPSILON) / 100).toFixed(2);
    }

}
