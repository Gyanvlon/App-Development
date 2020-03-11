import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatictDataEntryViewComponent } from './statict-data-entry-view.component';

describe('StatictDataEntryViewComponent', () => {
  let component: StatictDataEntryViewComponent;
  let fixture: ComponentFixture<StatictDataEntryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatictDataEntryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatictDataEntryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
