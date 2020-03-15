import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyCommissionComponent } from './copy-commission.component';

describe('CopyCommissionComponent', () => {
  let component: CopyCommissionComponent;
  let fixture: ComponentFixture<CopyCommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
