import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoSimulationComponent } from './demo-simulation.component';

describe('DemoSimulationComponent', () => {
  let component: DemoSimulationComponent;
  let fixture: ComponentFixture<DemoSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
