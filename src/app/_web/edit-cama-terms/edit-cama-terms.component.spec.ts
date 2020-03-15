import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCamaTermsComponent } from './edit-cama-terms.component';

describe('EditCamaTermsComponent', () => {
  let component: EditCamaTermsComponent;
  let fixture: ComponentFixture<EditCamaTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCamaTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCamaTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
