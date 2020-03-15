import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCamaTermComponent } from './view-cama-term.component';

describe('ViewCamaTermComponent', () => {
  let component: ViewCamaTermComponent;
  let fixture: ComponentFixture<ViewCamaTermComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCamaTermComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCamaTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
