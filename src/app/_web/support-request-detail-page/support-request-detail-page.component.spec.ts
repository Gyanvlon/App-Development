import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportRequestDetailPageComponent } from './support-request-detail-page.component';

describe('SupportRequestDetailPageComponent', () => {
  let component: SupportRequestDetailPageComponent;
  let fixture: ComponentFixture<SupportRequestDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportRequestDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportRequestDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
