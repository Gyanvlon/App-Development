import { MyValidators } from './../../../shared/Validation/externalValidator';
import { Project } from './../../../shared/model/project.model';
import { ApiService } from './../../../Services/api.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-stakeholders',
  templateUrl: './add-stakeholders.component.html',
  styleUrls: ['./add-stakeholders.component.css']
})
export class AddStakeholdersComponent implements OnInit, OnDestroy {
public imageSrc: any = '/assets/img/prf-img.png';
public addStakeholderForm: FormGroup;
public newForm: any[] = [];
public stakeholderRole: any[] = [];
public file: File;
public dataForm: any[] = [];
public projects: any;
public roleData: any[] = [];
public payInfo: any[] = [];
public id: any;
public roleId: any;
public projectName: any;
public Role: any;
public dropdownList = [];
public selectedItems = [];
public dropdownSettings = {};
public stakeholderData: any;
public stakeholderRoleId: any[] = [];
public projectIds: any[] = [];
public formSubmit: boolean = false;
public Form: FormGroup;
  // tslint:disable-next-line:max-line-length
  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private ngFlashMessageService: NgFlashMessageService, private router: Router) {
  }
  ngOnInit() {
    // this.Form = this.formBuilder.group({
    //   published: true,
    //   credentials: this.formBuilder.array([]),
    // });
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageStakeholders').addClass('active');
    });
    // this.file = this.imageSrc;
    this.selectedItems = [ ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'role',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
    this.apiService.getAllProject().subscribe( res => {
      this.projects = res.data;
      console.log(this.projects);
    });
    this.apiService.getStakeholderRole().subscribe( res => {
     this.stakeholderRole = res.data;
     this.dropdownList = this.stakeholderRole;
     console.log('here new role', this.stakeholderRole);
   });
    this.addStakeholderForm = this.formBuilder.group({
      email: ['', Validators.required],
      stakeholderName: ['', Validators.required],
      addToProject: ['', Validators.required],
      role: ['', Validators.required],
    });
  }
  // addCreds() {
  //   const creds = this.Form.controls.credentials as FormArray;
  //   creds.push(this.formBuilder.group({
  //     role: '',
  //     addToProject: '',
  //   }));
  // }
  imgUpload(event) {
    let ext = $('#file').val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
      this.ngFlashMessageService.showFlashMessage({
            messages: ['Invalid image format'],
            timeout: 2000,
            type: 'danger'
          });
     } else {
    this.file = event.target.files[0];
    console.log(this.file);
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(this.file);
    }
}
  onItemSelect(item: any) {
  }

  onSubmit() {
    if ( !this.addStakeholderForm.valid) {
      this.formSubmit = true;
    }
    this.formSubmit = false;
    const project = this.addStakeholderForm.get('addToProject').value;
    const id = project._id;
    console.log(this.projectIds);
    this.projectName = project.projectName;
    const stakeholersRole = this.addStakeholderForm.get('role').value;
    let roleId = stakeholersRole.map(({ _id }) => _id );
    let name = this.addStakeholderForm.get('stakeholderName').value;
    let emailId = this.addStakeholderForm.get('email').value;
    let roles = [{
     role: roleId,
     projectId: id
   }];
    let payInformation = [{
            projectId: id,
          }];
// concate value
    let  role = JSON.stringify(this.roleData.concat(roles));
    let payInfo = JSON.stringify(this.payInfo.concat(payInformation));
  this.apiService.addStakeholder(this.file === undefined ? null : this.file,
      name, emailId, role, payInfo ).subscribe( res => {
       console.log(res);
       if ( res.status === 200) {
       console.log(res.status);
       this.ngFlashMessageService.showFlashMessage({
          messages: ['Stakeholder Added Successfully'],
          timeout: 1000,
        });
       setTimeout(() => {
          this.router.navigate(['/manage-stakeholders']);
        }, 1000);
       }
     },
     error  => {
      this.ngFlashMessageService.showFlashMessage({
        messages: [error],
        timeout: 5000,
        type: 'danger'
      });
      console.log('here is error', error);
     });
  }
  addForm() {
    if ( !this.addStakeholderForm.valid) {
      this.formSubmit = true;
    }
    this.formSubmit = false;
    const project = this.addStakeholderForm.get('addToProject').value;
    this.id = project._id;
    console.log('here project id added', this.projectIds);
    console.log(this.id);
    console.log(project.projectName);

    this.projectName = project.projectName;
    const stakeholersRole = this.addStakeholderForm.get('role').value;
    let roles = stakeholersRole.map(({ role }) => role );
    let roleId = stakeholersRole.map(({ _id }) => _id );
    console.log(roleId, roles);
    const data = {
              role: roles,
              addToProject: this.projectName,
              
    };
    const proData = {
          role: roleId,
          projectId: this.id,
        };
    const payData = {
          projectId: this.id,
        };
    this.stakeholderRoleId.push(roleId);
    this.roleData.push(proData);
    this.payInfo.push(payData);
    this.newForm.push(data);
    console.log('here role id added ', this.stakeholderRoleId);
    this.addStakeholderForm.controls.amount.reset();
    this.addStakeholderForm.controls.interestRate.reset();
    this.addStakeholderForm.controls.role.reset();
  }
  showData() {
    console.log(this.newForm);
  }
  removeForm(index) {
    this.newForm.splice(index);
  }
// for validation
  get email() {
    return this.addStakeholderForm.get('email');
  }
  get stakeholderName() {
    return this.addStakeholderForm.get('stakeholderName');
  }
  get addToProject() {
    return this.addStakeholderForm.get('addToProject');
  }
  get role() {
    return this.addStakeholderForm.get('role');
  }
  
  ngOnDestroy(){
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageStakeholders').removeClass('active');
    });
  }
}
