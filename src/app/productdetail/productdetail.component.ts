import { CategoryService } from './../services/category.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Category } from './../shared/category';
import { AddToCartService } from './../services/add-to-cart.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {
prodetail: any;
productDetail: any;
public num = 1;
para1: string;
productData: any;
categories: Category[];
count: number;
showdata: Boolean = true;
  constructor(
    private route: ActivatedRoute,
    private cartService: AddToCartService,
    private location: Location,
    private categoryService: CategoryService
  ) {
    route.params.subscribe(val => {
      this.prodetail = this.route.snapshot.paramMap.get('proid');
    // this.productDetail = this.categoryService.getProductDetail(this.prodetail);
   });
  }

  ngOnInit() {
  }
  addToCart(products) {
    // console.log(products.indexOf('id'));
    this.cartService.addToCart(products);
      this.showdata = false;
  }
  getPrice(price: any) {
    this.cartService.price += price * this.num;
    this.cartService.count += this.num;
    this.cartService.setPrice(this.cartService.price);
    this.cartService.setCount(this.cartService.count);
    }
    plus() {
     this.num += 1;
     // this.cartService.getNum(this.num);
    }
   minus() {
      this.num -= 1;
      if (this.num < 1) {
        this.showdata = false;
      }
    }
  goBack() {
    this.location.back();
  }
}
