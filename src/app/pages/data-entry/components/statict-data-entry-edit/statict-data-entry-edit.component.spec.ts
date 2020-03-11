import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatictDataEntryEditComponent } from './statict-data-entry-edit.component';

describe('StatictDataEntryEditComponent', () => {
  let component: StatictDataEntryEditComponent;
  let fixture: ComponentFixture<StatictDataEntryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatictDataEntryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatictDataEntryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
