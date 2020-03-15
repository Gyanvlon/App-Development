import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderRootComponent } from './stakeholder-root.component';

describe('StakeholderRootComponent', () => {
  let component: StakeholderRootComponent;
  let fixture: ComponentFixture<StakeholderRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
