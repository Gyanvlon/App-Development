import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './../../../Services/api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment'; // to formt data from api
import { MyValidators } from 'src/app/shared/Validation/externalValidator';
import { NgFlashMessageService } from 'ng-flash-messages';
@Component({
  selector: 'app-edit-stakeholders',
  templateUrl: './edit-stakeholders.component.html',
  styleUrls: ['./edit-stakeholders.component.css']
})
export class EditStakeholdersComponent implements OnInit , OnDestroy{
  public  editStakeholderForm: FormGroup;
  public imageSrc: any = '/assets/img/prf-img.png';
  public  newForm: any[] = [];
  public  stakeholderRole: any[] = [];
  public  file: File;
  public  dataForm: any[] = [];
  public  projects: any;
  public  roleData: any[] = [];
  public  payInfo: any[] = [];
  public  id: any;
  public  roleId: any;
  public  projectName: any;
  public  Role: any;
  public  stakeholderId: any;
  public  projectDetail: any;
  public stakehodlerDetail: any;
  public project: any;
  public roles: any;
  public payinfo: any;
  public Date: any;
  public dropdownList = [];
  public selectedItems = [];
  public dropdownSettings = {};
  public stakeholderImages: any;
  public detail: any;
  public projeccID: any;
  public typeOfInvest: any;
  public accountDetail: any;
  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
    // tslint:disable-next-line:align
             private formBuilder: FormBuilder,
              private ngFlashMessageService: NgFlashMessageService,
              private router: Router) {
    route.params.subscribe(val => {
      this.stakeholderId = this.route.snapshot.paramMap.get('id');
    });
    this.apiService.getId(this.stakeholderId);
  }
  ngOnInit() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageStakeholders').addClass('active');
    });
    this.apiService.bankAccountDetail(this.stakeholderId).subscribe(res => {
    this.accountDetail = res.data;
      console.log(this.accountDetail);
    });
    this.apiService.stakeholderProfile(this.stakeholderId).subscribe( res => {
      console.log(res.data);
      this.stakehodlerDetail = res.data;
      let project = res.data.projects;
      this.payInfo = res.data.paymentInformation;
      console.log(this.payInfo);
      this.roles = project.map(({ role }) => role );
      this.selectedItems = this.roles[0];
      this.detail = project.map(({ projectId }) => projectId );
      this.projeccID = this.detail[0]._id;
      console.log('here is  role alldfdsafasf', this.roles);
      console.log('here is  role all', this.projeccID);
      console.log('here is proDetail', project);
      console.log('here is proDeta]]]izsdfdsafasl', this.selectedItems);

      // this.stakeholderImages = this.stakehodlerDetail.stakeholderImage;
      this.payInfo = this.stakehodlerDetail.paymentInformation;
      this.typeOfInvest = this.payInfo[0].typeOfInvestment;
      this.projectDetail = this.stakehodlerDetail.projects;
      this.project = this.projectDetail[0].projectId;
      console.log(this.projectDetail[0].projectId);
      this.Date = moment(this.payInfo[0].date).format('YYYY/MM/DD');
      this.roles = this.projectDetail[0].role;
      console.log('here is all details', this.stakehodlerDetail);
      console.log(this.role);
      console.log(this.typeOfInvest);
      let img = res.data.stakeholderImage;
      if (img === null ) {
        this.stakeholderImages = this.imageSrc;
      } else {
        this.stakeholderImages = img;
      }
    });
    this.apiService.getAllProject().subscribe( res => {
      // console.log(res);
      this.projects = res.data;
      // console.log(this.projects);
    });
    this.apiService.getStakeholderRole().subscribe(res => {
      // console.log(res);
      this.dropdownList = this.stakeholderRole = res.data;
      //  console.log(this.stakeholderRole);
    });
    this.editStakeholderForm = this.formBuilder.group({
      email: ['', Validators.required],
      stakeholderName: ['', Validators.required],
      addToProject: ['', Validators.required],
      role: ['', Validators.required],
      purposeOfInvetment: ['', Validators.required],
      date: ['', Validators.required],
      amount: ['', [Validators.required, MyValidators.NumberOnly]],
      interestRate: ['', [Validators.required, MyValidators.NumberOnly]],
    });
    this.selectedItems = [ ];
    console.log(this.selectedItems);
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'role',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
  }
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
      const reader = new FileReader();
      reader.onload = e => this.stakeholderImages = reader.result;
      reader.readAsDataURL(this.file);
    }
}

  onItemSelect(item: any) {
  }
  onSubmit() {
    const project = this.editStakeholderForm.get('addToProject').value;
    const email = this.editStakeholderForm.get('email').value;
    let  pay = this.editStakeholderForm.get('purposeOfInvetment').value;
    let typeOfInvestment = pay === undefined ? this.typeOfInvest : pay;
    const id = project === undefined ? this.projeccID : project;
    console.log('project', typeOfInvestment);
    console.log('project', id);
    // this.projectName = project.projectName;
    const stakeholersRole = this.editStakeholderForm.get('role').value;
    let roleId = stakeholersRole.map(({ _id }) => _id );
    console.log('roleidsdfsdfsfd', roleId);
    const stakeholderName = this.editStakeholderForm.get('stakeholderName').value;
    const projects = JSON.stringify([{
      role: roleId,
      projectId: id
    }]);
    const paymentInformation = JSON.stringify([{
      projectId: id,
      typeOfInvestment: this.editStakeholderForm.get('purposeOfInvetment').value,
      date: this.editStakeholderForm.get('date').value,
      interestRate: this.editStakeholderForm.get('interestRate').value,
      amount: this.editStakeholderForm.get('amount').value
    }]);
    console.log(this.file);
    console.log(stakeholderName, this.file === undefined ? null : this.file, email, projects, paymentInformation);
    // tslint:disable-next-line:max-line-length
    this.apiService.updateStakeholder(stakeholderName, this.file === undefined ? null : this.file, email, projects, paymentInformation).subscribe( res => {
      console.log(res);
      if ( res.status === 200 ) {
        this.ngFlashMessageService.showFlashMessage({
          messages: ['stakeholder detail data update successfully'],
          timeout: 1000,
        });
        setTimeout(() => {
          this.router.navigate(['/manage-stakeholders']);
        }, 1000);
      }
    });
  }
  get stakeholderName() {
    return this.editStakeholderForm.get('stakeholderName');
  }
  get addToProject() {
    return this.editStakeholderForm.get('addToProject');
  }
  get role() {
    return this.editStakeholderForm.get('role');
  }
  get purposeOfInvetment() {
    return this.editStakeholderForm.get('purposeOfInvetment');
  }
  get date() {
    return this.editStakeholderForm.get('date');
  }
  get interestRate() {
    return this.editStakeholderForm.get('interestRate');
  }
  get amount() {
    return this.editStakeholderForm.get('amount');
  }
  ngOnDestroy() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageStakeholders').removeClass('active');
    });
  }
}
