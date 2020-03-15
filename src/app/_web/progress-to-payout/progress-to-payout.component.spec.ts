import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressToPayoutComponent } from './progress-to-payout.component';

describe('ProgressToPayoutComponent', () => {
  let component: ProgressToPayoutComponent;
  let fixture: ComponentFixture<ProgressToPayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressToPayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressToPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
