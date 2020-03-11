import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatictDataEntryComponent } from './statict-data-entry.component';

describe('StatictDataEntryComponent', () => {
  let component: StatictDataEntryComponent;
  let fixture: ComponentFixture<StatictDataEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatictDataEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatictDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
