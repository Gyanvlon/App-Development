import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public categoryService: CategoryService    ) {
    // tslint:disable-next-line:no-unused-expression
    this.categoryService.visible = true;
  }

  ngOnInit() {
  }

}
