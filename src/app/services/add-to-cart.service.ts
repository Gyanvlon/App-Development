import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AddToCartService {
  price = 0;
  count = 0;
  product: any [];
  prices: any;
  counts: any;
  Num: any;
 duplicate: any;
 updateCont: any;
 updateTotalPrice: any;
 serviceInput = [];
  constructor() {
  this.product = [];
   }
  getProduct() {
    return this.product;
   }
  addToCart(products: any) {
    this.prices = products.element * products.price;
     // console.log(this.prices);
    products.prices = this.prices;
    // console.log(products);
    this.product.push(products);
    }
    setPrice(price: any) {
      this.prices = price;
    }
    getPrices() {
     return this.prices;
    }
    setCount(count: any) {
    this.counts = count;
    }
    getCounts() {
     return this.counts;
    }
    getUpdateCart(UpdatePrice, UpdateCounts) {
      this.updateCont = UpdateCounts;
      this.updateTotalPrice = UpdatePrice;
    }
    setUpdateCount() {
     return this.updateCont;
    }
    setUpdatePrice() {
      return this.updateTotalPrice;
     }
    remove(index: number) {
      if (index > -1) {
          this.product.splice(index, 1);
      }
   }
  clear() {
  return this.product = [];
   console.log(this.product);
  }
  }
