import { ApiService } from './../../Services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-simulation',
  templateUrl: './demo-simulation.component.html',
  styleUrls: ['./demo-simulation.component.css']
})
export class DemoSimulationComponent implements OnInit {

  public userType: any[] = [];
  public demoSimulationForm: FormGroup;
  public projectId;
  public projectPhases;
  public allProjectsData;
  public stakeholderRole;


  constructor(private formBuilder: FormBuilder, public apiService: ApiService) {

  }

  ngOnInit() {

    this.userType = [
      { option: 'Sales Agent' },
      { option: 'Stakeholder' }
    ];
    this.demoSimulationForm = this.formBuilder.group({
      userType: ['', Validators.required],
      phase: ['', Validators.required],
      role: ['', Validators.required],
      projects: ['', Validators.required]

    });
    this.onChanges();
    this.allProjects();
    this.getRoles();
    setTimeout(() => {
      this.demoSimulationForm.get('phase').disable();
      this.demoSimulationForm.get('role').disable();
    }, 1000);
  }

  onChanges() {

    this.demoSimulationForm.get('userType').valueChanges.subscribe(selectedType => {
      console.log(selectedType);
      if (selectedType == 'Sales Agent') {
        this.demoSimulationForm.get('phase').reset();
        this.demoSimulationForm.get('role').reset();
        this.demoSimulationForm.get('phase').disable();
        this.demoSimulationForm.get('role').disable();
      } else {
        this.demoSimulationForm.get('phase').enable();
        this.demoSimulationForm.get('role').enable();
      }
    });
  }
  allProjects() {
    this.apiService.getAllProject().subscribe(res => {
      this.allProjectsData = res.data;
      console.log(this.allProjectsData);
    });
  }
  getProjectPhase(id) {
    console.log(id);
    this.apiService.getProjectPhase(id).subscribe(res => {
      this.projectPhases = res.data;
      console.log(this.projectPhases);
    });
  }
  projectSelected(event) {
    console.log(event.target.value);
    let data = ((event.target.value).split(':'));
    let id = (data[1]);
    this.getProjectPhase(id.trim());
  }
  getRoles() {
    this.apiService.getStakeholderRole().subscribe(res => {
      this.stakeholderRole = res.data;
      console.log('here new role', this.stakeholderRole);
    });
  }
  get phase() {
    return this.demoSimulationForm.get('phase');
  }
  get role() {
    return this.demoSimulationForm.get('role');
  }
  get projects() {
    return this.demoSimulationForm.get('projects');
  }

}
