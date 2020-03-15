import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalMessageComponent } from './universal-message.component';

describe('UniversalMessageComponent', () => {
  let component: UniversalMessageComponent;
  let fixture: ComponentFixture<UniversalMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversalMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversalMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
