import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStakeholderByProjectComponent } from './view-stakeholder-by-project.component';

describe('ViewStakeholderByProjectComponent', () => {
  let component: ViewStakeholderByProjectComponent;
  let fixture: ComponentFixture<ViewStakeholderByProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStakeholderByProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStakeholderByProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
