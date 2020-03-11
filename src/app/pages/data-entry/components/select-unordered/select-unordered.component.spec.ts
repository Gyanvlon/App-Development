import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUnorderedComponent } from './select-unordered.component';

describe('SelectUnorderedComponent', () => {
  let component: SelectUnorderedComponent;
  let fixture: ComponentFixture<SelectUnorderedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectUnorderedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUnorderedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
