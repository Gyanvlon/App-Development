import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStakeholdersComponent } from './edit-stakeholders.component';

describe('EditStakeholdersComponent', () => {
  let component: EditStakeholdersComponent;
  let fixture: ComponentFixture<EditStakeholdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStakeholdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStakeholdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
