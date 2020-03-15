import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholdersDetailsComponent } from './stakeholders-details.component';

describe('StakeholdersDetailsComponent', () => {
  let component: StakeholdersDetailsComponent;
  let fixture: ComponentFixture<StakeholdersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholdersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholdersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
