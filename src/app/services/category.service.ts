
import { Injectable } from '@angular/core';
import { Categories } from '../shared/root';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import { Category } from '../shared/category';
@Injectable({
  providedIn: 'root'
})
 export class CategoryService {
   url = 'http://localhost:3000/category';
   urls: any;
  visible: Boolean = true;
  Productdata: any;
  productDetail: any;
  product: any[];
  constructor( private http: HttpClient) { }
  getCategories(): Observable<Category[]> {
    return  of(Categories).delay(1);
  }
getSubCatData(cat) {
 this.Productdata = Categories[0][cat];
   return (Categories[0][cat]);
}
getProductData( id: string) {
 // this.productDetail = this.Productdata[id];
  return (this.Productdata[id].product);
}
// getProductDetail( proid: Number) {
//   // const test = this.productDetail.product;
//   // const arr = test.filter(x => x.id == proid);
//   // return arr;
// }
}
