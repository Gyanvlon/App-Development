import { UserService } from './../services/user.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'calculateTax'
})
export class CalculateTaxPipe implements PipeTransform {
    constructor(
        private userService: UserService
    ) { }

    public totalPrice: number = 0;
    public totalTaxPrice: number = 0; //to display
    public taxRate: any = {};
    public discountInfo: number = 0;
    public discountJson: any;
    public establishmentArray: Array<any>;
    public est1TotalPrice: number = 0;
    public est2TotalPrice: number = 0;
    public taxInfoJson: any;

    transform(cartItems: Array<any>): any {
        this.totalPrice = 0;
        this.taxRate = this.userService.getTaxRate();
        this.discountInfo = this.userService.getDiscountInfo();
        this.discountJson = this.userService.getDiscountJson();
        this.establishmentArray = [];
        this.taxInfoJson = {};
        this.totalTaxPrice = 0;
        cartItems.forEach((items) => {
            this.totalPrice += (items.offer.salePrice) * items.quantity;



            if (typeof this.establishmentArray[items.establishmentId] != "undefined") {
                this.establishmentArray[items.establishmentId].push(items);
            } else {
                this.establishmentArray[items.establishmentId] = [];
                this.establishmentArray[items.establishmentId].push(items);
            }


            // if (this.establishmentArray.indexOf(items.establishmentId) > -1) {
            //     this.establishmentArray[items.establishmentId].push(items);
            // } else {
            //     this.establishmentArray[items.establishmentId] = [];
            //     this.establishmentArray[items.establishmentId].push(items);
            // }
        });

        for (let i in this.establishmentArray) {
            let thisTotalPrice = 0;
            let establishmentId = "";
            this.establishmentArray[i].forEach((item) => {
                establishmentId = item.offer.establishmentId;
                thisTotalPrice += (item.offer.salePrice) * item.quantity;
            })
            if (typeof this.discountJson.est1 != "undefined" && this.discountJson.est1.establishmentId == establishmentId) {
                // thisTotalPrice -= this.discountJson.est1.volumeDisc;
                // thisTotalPrice = thisTotalPrice - (this.discountJson.est1.volumeDisc + this.discountJson.est1.deposits);
                thisTotalPrice -= this.discountJson.est1.nonTaxableAmt;
                thisTotalPrice = (thisTotalPrice * this.taxRate[establishmentId]);
                this.taxInfoJson[establishmentId] = parseFloat(thisTotalPrice.toFixed(2));
                this.totalTaxPrice = this.totalTaxPrice + thisTotalPrice;
            } else if (typeof this.discountJson.est2 != "undefined" && this.discountJson.est2.establishmentId == establishmentId) {
                // thisTotalPrice -= this.discountJson.est2.volumeDisc;
                // thisTotalPrice = thisTotalPrice - (this.discountJson.est2.volumeDisc + this.discountJson.est2.deposits);
                thisTotalPrice -= this.discountJson.est2.nonTaxableAmt;
                thisTotalPrice = (thisTotalPrice * this.taxRate[establishmentId]);
                this.taxInfoJson[establishmentId] = parseFloat(thisTotalPrice.toFixed(2));;
                this.totalTaxPrice = this.totalTaxPrice + thisTotalPrice;
            }
        }
        this.totalTaxPrice = parseFloat((this.totalTaxPrice).toFixed(2));
        this.userService.setTaxPrice(this.taxInfoJson);

        return (this.totalTaxPrice < 0) ? 0 : this.totalTaxPrice.toFixed(2);
    }

}
