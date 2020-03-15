import { NgFlashMessageService } from 'ng-flash-messages';
import { Country } from 'src/app/shared/countrylist';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './../../Services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MyValidators } from 'src/app/shared/Validation/externalValidator';
import { MustGreater } from 'src/app/shared/Validation/rangeValidation';

@Component({
  selector: 'app-copy-commission',
  templateUrl: './copy-commission.component.html',
  styleUrls: ['./copy-commission.component.css']
})
export class CopyCommissionComponent implements OnInit, OnDestroy {
public copyCommissionForm: any;
public key: any;
public detail: any;
public allProject: any;
public allStakeholder: any;
public countryList: any[] =  Country;
public selectedProject: any;
public selectedProjectId: any;
public selectedAgent: any;
public selectedAgentId: any;


  constructor(private formBuilder: FormBuilder, private apiService : ApiService , 
  private route: ActivatedRoute, private ngFlashMessageService: NgFlashMessageService,
  private router: Router) {
    route.params.subscribe(val => {
      this.key = this.route.snapshot.paramMap.get('id');
    });
  
  }
  ngOnInit() {
    setTimeout(() => {
      this.apiService.getCommissionDetail(this.key).subscribe( res => {
        this.detail = res.data;
        console.log(res.data);
        this.selectedProject= this.detail.projectName;
        this.selectedProjectId= this.detail.projectId;
        this.selectedAgent= this.detail.agentName;
        this.selectedAgentId= this.detail.agentId;
        console.log(this.detail.projectName);
        this.copyCommissionForm.patchValue({
         collectionType: this.detail.typeOfCollection
        })
      });
    },  500);
    setTimeout(() => {
      this.apiService.getAllProject().subscribe( res => {
        this.allProject = res.data;
        console.log(res.data);
      });
    
    }, 1500);
     setTimeout(() => {
      this.apiService.stakeHolderDetails().subscribe( res => {
        this.allStakeholder = res.data;
        console.log(res.data);
        });
    
     }, 1900);
      
    
    this.copyCommissionForm = this.formBuilder.group({
      project: ['', Validators.required],
      salesAgentId: ['', Validators.required],
      countryName: ['', Validators.required],
      payment: ['', [Validators.required, MyValidators.NumberOnly, Validators.maxLength(2)]],
      collectionType: ['', Validators.required],
      collectionFrom: ['', [Validators.required, Validators.maxLength(8), MyValidators.NumberOnly]],
      collectionTo: ['', [Validators.required, MyValidators.NumberOnly]]
       }, {
           validator: MustGreater('collectionFrom', 'collectionTo')
       });

    $(function () {
      console.log('im active');
      $('.navbar-default li.manageCommission').addClass('active');
    });
  }
onSubmit(){
  let project = this.copyCommissionForm.get('project').value;
   if( this.selectedProject == project) {
   this.selectedProject = this.selectedProject;
   this.selectedProjectId = this.selectedProjectId;
   } else {
    this.selectedProject = project.projectName;
    this.selectedProjectId = project._id;
   }
   console.log(project);
   let agent = this.copyCommissionForm.get('salesAgentId').value;
   console.log(agent);
 
   if( this.selectedAgent == agent) {
    this.selectedAgent = this.selectedAgent;
    this.selectedAgentId = this.selectedAgentId;
    } else {
     this.selectedAgent = agent.agentName;
     this.selectedAgentId = agent._id;
    }
 
  let newData= {
    projectId:this.selectedProjectId,
    agentId: this.selectedAgentId,
    projectName: this.selectedProject,
    agentName: this.selectedAgent,
    countryName: this.copyCommissionForm.get('countryName').value,
    payment: this.copyCommissionForm.get('payment').value,
    collectionFrom: (this.copyCommissionForm.get('collectionFrom').value).toString() ,
    collectionTo: (this.copyCommissionForm.get('collectionTo').value).toString(),
    // collectionType: 'this'
    collectionType: this.copyCommissionForm.get('collectionType').value
  };
  console.log(newData)
  this.apiService.addNewCommission(newData).subscribe( res => {
    console.log(res);
    if ( res.status === 200) {
      this.ngFlashMessageService.showFlashMessage({
        messages: ['Commission Copy Successfully'],
        timeout: 500
      });
      setTimeout( () => {
        this.router.navigate(['/manage-commission']);
      }, 1000);
    }
  });
}
securityQuestionOnChange(e){
  console.log("this is change", e);
}
getId(id) {
  console.log(id);
}
  get salesAgentId() {
    return this.copyCommissionForm.get('salesAgentId');
  }
  get countryName() {
    return this.copyCommissionForm.get('countryName');
  }
  get collectionFrom() {
    return this.copyCommissionForm.get('collectionFrom');
  }
  get collectionTo(){
    return this.copyCommissionForm.get('collectionTo');
  }
  get collectionType() {
    return this.copyCommissionForm.get('collectionType');
  }
  get payment() {
    return this.copyCommissionForm.get('payment');
  }
  get project() {
    return this.copyCommissionForm.get('project');
  }

  ngOnDestroy() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageCommission').removeClass('active');
    });
  }

}
