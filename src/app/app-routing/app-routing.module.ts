import { ProductdetailComponent } from './../productdetail/productdetail.component';
import { CheckoutComponent } from './../checkout/checkout.component';
import { AddCartComponent } from './../add-cart/add-cart.component';
import { SubCategoryComponent } from './../sub-category/sub-category.component';
import { ProductListComponent } from './../product-list/product-list.component';
import { HomeComponent } from './../home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: AddCartComponent},
  { path: 'cart/:checkout', component: CheckoutComponent},
  { path: ':cat', component: SubCategoryComponent},
  { path: ':cat/:categorylist/:id', component: ProductListComponent},
  { path: ':cat/:categorylist/:id/:proid', component: ProductdetailComponent}
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
