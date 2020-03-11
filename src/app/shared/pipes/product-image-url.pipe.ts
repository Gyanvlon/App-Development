import { Pipe, PipeTransform } from '@angular/core';
import { API_URL, BUCKET_NAME } from '../../constants/constants';

@Pipe({
    name: 'productImageUrl'
})
export class ProductImageUrlPipe implements PipeTransform {

    public imageUrl: string = "";

    transform(product: any): any {
        let path = product && product['productPhoto'] && product['productPhoto'].file ?
            `${API_URL}storages/${BUCKET_NAME}/download/${product['productPhoto'].file.filename}` :
            this.generateDefaultImage(product);
        return path;
    }

    generateDefaultImage(product: any): string {
        return `${API_URL}storages/${BUCKET_NAME}/download/placeholder-small.png`;

    }

}
