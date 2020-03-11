import { Location } from '@angular/common';
import { CategoryService } from './../services/category.service';
import { Component, OnInit } from '@angular/core';
import { Category } from './../shared/category';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {
 categories: any;
 public para: string;
  data: any [];
  constructor(private route: ActivatedRoute, private categoryService: CategoryService,
     private location: Location) {
    route.params.subscribe(val => {
      this.para = this.route.snapshot.paramMap.get('cat');
         console.log(this.para);
     this.data = this.categoryService.getSubCatData(this.para);
      });
// tslint:disable-next-line:no-unused-expression
 this.categoryService.visible = true;
  }
  ngOnInit() {
    console.log(this.categories);
 // this.categoryService.getSubCatData(this.para).subscribe(subCatData => {this.categories = subCatData; console.log(subCatData); });
  }
  goBack(): void {
    this.location.back();
  }
}
