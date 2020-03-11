import { AddToCartService } from './services/add-to-cart.service';
import { CategoryService } from './services/category.service';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CategoryComponent } from './category/category.component';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { CommonModule } from '@angular/common';
import { AddCartComponent } from './add-cart/add-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchPipe } from './search/search.pipe';
import { FormsModule } from '@angular/forms';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    HomeComponent,
    ProductListComponent,
    SubCategoryComponent,
    AddCartComponent,
    CheckoutComponent,
    SearchPipe,
    ProductdetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [CategoryService, AddToCartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
