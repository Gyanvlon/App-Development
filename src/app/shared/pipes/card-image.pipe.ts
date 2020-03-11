import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cardImage'
})
export class CardImagePipe implements PipeTransform {

    transform(cardType: any, args?: any): any {
        return this.getImagepath(cardType);
    }

    getImagepath(cardType) {
        let imagePath: string = "";
        switch (cardType) {
            case "Visa": imagePath = "assets/images/card_visa.png";
                break;
            case "JCB": imagePath = "assets/images/card_jcb.png";
                break;
            case "Diners Club": imagePath = "assets/images/card_diners.png";
                break;
            case "Discover": imagePath = "assets/images/card_discover.png";
                break;
            case "American Express": imagePath = "assets/images/card_americanexpress.png";
                break;
            case "MasterCard": imagePath = "assets/images/card_mastercard.png";
                break;
            default: imagePath = "assets/images/card_visa.png";
                break;
        }
        return imagePath;
    }

}
