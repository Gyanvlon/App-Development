import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClientService } from '../../../../core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  @Input() objectRefference: any;
  @Input() valueAttribute: any;
  @Input() valueType: any;
  @Input() description: any;
  @Input() placeholder: any;
  @Input() attributeValue: any;
  @Input() type: any;
  @Input() editing = false;

  @Output() valueUpdate: EventEmitter<any> = new EventEmitter<any>();
  loading = false;
  loadingError = false;
  showPicker: boolean;
  top = '0';
  left = '0';
  selectionInputSettings = {
    valueField: 'code',
    textField: 'name',
    multipleSelection: false
  };
  items: Array<string> = [];
  value: any = {};
  isInvalid = false;
  attributtNew;
  errorMessage: string;

  constructor(private http: HttpClientService) {
    this.showPicker = false;
  }

  ngOnInit() {
    if (this.attributeValue) {
      if (this.attributeValue.value === '') {
        this.attributtNew = true;
      } else {
        this.attributtNew = false;
      }
      if (this.attributeValue.attribute.optionSet) {
        this.attributeValue.attribute.optionSet.options.forEach(option => {
          if (this.attributeValue.attribute.name === 'Project') {
            this.items.push(option.name + '(' + option.code + ')');
          } else {
            this.items.push(option.code);
          }

          if (option.code === this.attributeValue.value) {
            if (this.attributeValue.attribute.name === 'Project') {
              this.value.id = option.name + '(' + option.code + ')';
              this.value.text = option.name + '(' + option.code + ')';
            } else {
              this.value.id = this.attributeValue.value;
              this.value.text = option.code;
            }
          }
        });
      }
    }
  }
  save() {
    this.loading = true;
    const dataObject = {};
    dataObject[this.valueAttribute] = this.objectRefference[
      this.valueAttribute
    ];
    this.http
      .put(
        'organisationUnits/' +
          this.objectRefference.id +
          '/' +
          this.valueAttribute,
        dataObject
      )
      .subscribe(
        (data: any) => {
          const userData = data;
          this.editing = false;
        },
        error => {
          this.editing = false;
          this.loading = false;
          this.loadingError = error;
        }
      );
  }

  public selected(value: any): void {
    if (this.attributeValue.attribute.name === 'Project') {
      this.attributeValue.value = value.id.replace(/\(\w+(\s(\w+))+\)/i, '');
    } else {
      this.attributeValue.value = value.id;
    }
  }

  public dateChanged(event) {
    this.attributeValue.value = event.jsdate.toISOString();
  }
  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  public typed(value: any): void {
    console.log('New search input: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

  valueSelected(event) {
    this.attributeValue.value = event;
    this.valueUpdate.emit(this.attributeValue);
  }
  positiveIntegerZero(event, text) {
    this.isInvalid = false;
    if (event < 0) {
      this.attributeValue.value = ('' + event).replace('-', '');
      this.isInvalid = true;
      this.errorMessage =
        'The value entered is not a positive integer or zero.';
    } else if (event == null) {
      this.isInvalid = true;
      this.attributeValue.value = '';
      this.errorMessage =
        'The value entered is not a positive integer or zero.';
    } else {
      if (this.attributeValue.attribute.action) {
        if (
          this.attributeValue.attribute.action.min &&
          !this.attributeValue.attribute.action.max
        ) {
          this.isInvalid = event < this.attributeValue.attribute.action.min;
          this.errorMessage = `The value should be greater than or equal to ${
            this.attributeValue.attribute.action.min
          }.`;
        } else if (
          !this.attributeValue.attribute.action.min &&
          this.attributeValue.attribute.action.max
        ) {
          this.isInvalid = event > this.attributeValue.attribute.action.max;
          this.errorMessage = `The value should be less than or equal to ${
            this.attributeValue.attribute.action.max
          }.`;
        } else {
          this.isInvalid =
            event < this.attributeValue.attribute.action.min ||
            event > this.attributeValue.attribute.action.max;
          this.errorMessage = `The value should be greater than or equal to ${
            this.attributeValue.attribute.action.min
          } and less than or equal to ${
            this.attributeValue.attribute.action.max
          }.`;
        }
      }
    }
  }
}
