import { CategoryService } from './../services/category.service';
import { MyValidators } from './../shared/validators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  Form = new FormGroup({
    FullName: new FormControl('', [Validators.required, MyValidators.CharacterOnly, MyValidators.UpperCaseCharacter]),
     MobileNo: new FormControl('', [MyValidators.NumberLength, MyValidators.NumberOnly, MyValidators.cannotContainSpace]),
     Email: new FormControl('', [Validators.required, MyValidators.symbol, MyValidators.cannotContainSpace]),
      Address: new FormControl('', [Validators.required, MyValidators.firstCharacter])
  });
  constructor(public categoryService: CategoryService    ) {
    // tslint:disable-next-line:no-unused-expression
    this.categoryService.visible = false;

  }

  ngOnInit() {
  }
get FullName() {
return this.Form.get('FullName');
}
get MobileNo() {
  return this.Form.get('MobileNo');
  }
  get Email() {
    return this.Form.get('Email');
    }
    get Address() {
      return this.Form.get('Address');
      }
}
