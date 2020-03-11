import { CategoryService } from './../services/category.service';
import { AddToCartService } from './../services/add-to-cart.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-cart',
  templateUrl: './add-cart.component.html',
  styleUrls: ['./add-cart.component.css']
})
export class AddCartComponent implements OnInit {
  products: any [];
  totalprice: any;
  counts: any;
  count = 1;
 buttons = [];
 test: any;
constructor(private route: ActivatedRoute, private cartService: AddToCartService, private location: Location,
  public categoryService: CategoryService) {
    // tslint:disable-next-line:no-unused-expression
    categoryService.visible = false;

}
  ngOnInit() {
    this.products = this.cartService.getProduct();
    this.totalprice = this.cartService.getPrices();
    this.counts = this.cartService.getCounts();
  }
  Update () {
   const UpdatePrice = this.totalprice;
  // console.log(UpdatePrice);
   const UpdateCounts = this.counts;
   // console.log(UpdateCounts);
   this.cartService.getUpdateCart(UpdatePrice, UpdateCounts);
  }
  Plus(price, i) {
    this.products[i].element += 1;
    this.counts += 1;
    this.products[i].prices = price * this.products[i].element;
    this.totalprice = this.totalprice + price;
    if ( this.products[i].element > 0) {
      this.buttons[i] = false;
      this.Update();
    }
  }
  Minus(price, i) {
    this.products[i].element -= 1;
   this.counts -= 1;
   if ( this.products[i].element < 1) {
    this.buttons[i] = true;
   }
   this.products[i].prices = price * this.products[i].element;
   this.totalprice = this.totalprice - price;
   this.Update();
  }
  delete(i) {
  this.counts = this.counts - this.products[i].element;
  this.totalprice = this.totalprice - this.products[i].prices;
  this.cartService.remove(i);
  this.Update();
  }
  clear() {
    this.counts = 0;
    this.totalprice = 0;
    this.products = [];
    this.cartService.clear();
    this.Update();
  }
  goBack() {
    this.location.back();
  }
}
