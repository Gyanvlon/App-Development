import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyDistributionComponent } from './money-distribution.component';

describe('MoneyDistributionComponent', () => {
  let component: MoneyDistributionComponent;
  let fixture: ComponentFixture<MoneyDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoneyDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
