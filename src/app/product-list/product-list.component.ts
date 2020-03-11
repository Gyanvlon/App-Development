import { AddToCartService } from './../services/add-to-cart.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from './../services/category.service';
import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
para1: string;
productData: any;
input = [];
num = 1;
count: any;
buttons = [];
updateCount: any;
updatePrice: any;
totCount: any = 0;
totPrice: any = 0;

constructor( private categoryService: CategoryService,
   private route: ActivatedRoute,
   private location: Location,
   private cartService: AddToCartService) {
    route.params.subscribe(val => {
      this.para1 = this.route.snapshot.paramMap.get('id');
     this.productData = this.categoryService.getProductData(this.para1);
      this.buttons = Array(this.productData.length).fill(false);
       this.input = Array(this.productData.length).fill(1);
       categoryService.visible = true;
   });
  }
  ngOnInit() {
   this.updateCount = this.cartService.setUpdateCount();
   this.updatePrice = this.cartService.setUpdatePrice();
   // console.log(this.updateCount);
     // console.log(this.updatePrice);
   this.totCount = this.updateCount;
   this.totPrice = this.updatePrice;
  }
  addToCart(products, i) {
    products.element = this.num;
    this.cartService.addToCart(products);
    this.buttons[i] = true;
  }
  getPrice(price: any) {
   this.totPrice = this.cartService.price += price * this.num;
   this.totCount = this.cartService.count += this.num;
   // this.cartService.count = this.updateCount;
   // this.cartService.price = this.updatePrice;
    this.cartService.setPrice(this.cartService.price);
    this.cartService.setCount(this.cartService.count);
    }
plus(i) {
this.num = this.input [i] += 1;
if ( this.num > 0) {
  this.buttons[i] = false;
}
}
minus(i) {
    this.num = this.input [i] -= 1;
    if ( this.num < 1) {
    this.buttons[i] = true;
  }
}
  goBack(): void {
    this.location.back();
  }
  }
