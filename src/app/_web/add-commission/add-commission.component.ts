import { MustGreater } from 'src/app/shared/Validation/rangeValidation';
import { MyValidators } from 'src/app/shared/Validation/externalValidator';
import { NgFlashMessageService } from 'ng-flash-messages';
import { ApiService } from './../../Services/api.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Country } from 'src/app/shared/countrylist';

@Component({
  selector: 'app-add-commission',
  templateUrl: './add-commission.component.html',
  styleUrls: ['./add-commission.component.css']
})
export class AddCommissionComponent implements OnInit , OnDestroy {
public p: any;
public allProject: any;
public allStakeholder: any;
public addCommissionForm: FormGroup;
public countryList: any[] = Country;
  constructor( private router: Router,
               private formBuilder: FormBuilder,
               private apiService: ApiService,
               private ngFlashMessageService: NgFlashMessageService ) {
    $(function() {
      console.log('im active');
      $('.navbar-default li.manageCommission').addClass('active');
    });
  }
  ngOnInit() {
    this.apiService.getAllProject().subscribe( res => {
      this.allProject = res.data;
      console.log(res.data);
    });
    this.apiService.stakeHolderDetails().subscribe( res => {
    this.allStakeholder = res.data;
    console.log(res.data);
    });
    this.addCommissionForm = this.formBuilder.group({
     project: ['', Validators.required],
     salesAgentId: ['', Validators.required],
     countryName: ['', Validators.required],
     payment: ['', [Validators.required, MyValidators.NumberOnly,Validators.maxLength(2)]],
    //  collectionFrom: ['', Validators.required],
    //  collectionTo: ['', Validators.required],
     collectionType: ['', Validators.required],
     collectionFrom: ['', [Validators.required, Validators.maxLength(8), MyValidators.NumberOnly]],
     collectionTo: ['', [Validators.required, MyValidators.NumberOnly]]
      }, {
          validator: MustGreater('collectionFrom', 'collectionTo')
      });

    $(function() {
      console.log('im active');
      $('.navbar-default li.manageCommission').addClass('active');
    });
  }

  ngOnDestroy() {
    $(function() {
      console.log('im active');
      $('.navbar-default li.manageCommission').removeClass('active');
    });


}
onSubmit() {
  let salesAgent =  this.addCommissionForm.get('salesAgentId').value;
  let project = this.addCommissionForm.get('project').value;
  let AgentId =salesAgent._id;
  let Agent = salesAgent.stakeholderName;
  let newData= {
    agentId: AgentId,
    agentName: Agent,
    projectId: project._id,
    projectName: project.projectName,
    countryName: this.addCommissionForm.get('countryName').value,
    payment: this.addCommissionForm.get('payment').value,
    collectionFrom: this.addCommissionForm.get('collectionFrom').value ,
    collectionTo: this.addCommissionForm.get('collectionTo').value,
    collectionType: this.addCommissionForm.get('collectionType').value
  };
  console.log(newData);
  this.apiService.addNewCommission(newData).subscribe( res => {
    console.log(res);
    if ( res.status === 200) {
      this.ngFlashMessageService.showFlashMessage({
        messages: ['Commission Added Successfully'],
        timeout: 500
      });
      setTimeout( () => {
        this.router.navigate(['/manage-commission']);
      }, 1000);
    }
  });
}

// validators

get salesAgentId() {
  return this.addCommissionForm.get('salesAgentId');
}
get countryName() {
  return this.addCommissionForm.get('countryName');
}
get collectionFrom() {
  return this.addCommissionForm.get('collectionFrom');
}
get collectionTo(){
  return this.addCommissionForm.get('collectionTo');
}
get collectionType() {
  return this.addCommissionForm.get('collectionType');
}
get payment() {
  return this.addCommissionForm.get('payment');
}
get project() {
  return this.addCommissionForm.get('project');
}
}
