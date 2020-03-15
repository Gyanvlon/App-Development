import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsRootComponent } from './projects-root.component';

describe('ProjectsRootComponent', () => {
  let component: ProjectsRootComponent;
  let fixture: ComponentFixture<ProjectsRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
