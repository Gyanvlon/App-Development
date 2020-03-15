import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommissionComponent } from './add-commission.component';

describe('AddCommissionComponent', () => {
  let component: AddCommissionComponent;
  let fixture: ComponentFixture<AddCommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
