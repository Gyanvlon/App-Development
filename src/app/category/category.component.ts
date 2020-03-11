import { Location } from '@angular/common';
import { CategoryService } from './../services/category.service';
import { Category } from './../shared/category';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
show: Boolean = true;
categories: Category[] = [];
category = [];
para1: any;
productData: any;
constructor(private route: ActivatedRoute,
private categoryService: CategoryService,
private location: Location) {
  // tslint:disable-next-line:no-unused-expression
  this.categoryService.visible = true;
}
  ngOnInit() {
    this.categoryService.getCategories().subscribe(categories =>  this.categories = categories);
  // this.categoryService.getCategories().subscribe(categories => console.log(categories));
  }
goBack() {
  this.location.back();
}
}



