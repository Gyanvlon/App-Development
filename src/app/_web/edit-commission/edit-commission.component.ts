import { Country } from 'src/app/shared/countrylist';
import { NgFlashMessageService } from 'ng-flash-messages';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from './../../Services/api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MyValidators } from 'src/app/shared/Validation/externalValidator';
import { MustGreater } from 'src/app/shared/Validation/rangeValidation';

@Component({
  selector: 'app-edit-commission',
  templateUrl: './edit-commission.component.html',
  styleUrls: ['./edit-commission.component.css']
})
export class EditCommissionComponent implements OnInit, OnDestroy {
public key: any;
public editCommissionForm: FormGroup;
public detail: any;
public countryList = Country;
public allProject: any;
public allStakeholder: any;
public country: any[]= [];
public opt1: any;
public opt2: any;

  constructor(private apiService: ApiService, 
    private ngFlashMessageService: NgFlashMessageService, private router: Router,
     private formBuilder: FormBuilder, private route: ActivatedRoute) {
      route.params.subscribe(val => {
        this.key = this.route.snapshot.paramMap.get('id');
      });
    
  }
  ngOnInit() {
  
    this.apiService.getCommissionDetail(this.key).subscribe( res => {
       this.detail = res.data;
       this.country = this.detail.countryName
       console.log(this.country, this.detail.typeOfCollection)
       this.editCommissionForm.patchValue({
        collectionType: this.detail.typeOfCollection
       })
    //    $(document).ready(function(){
    //     $(".check-male").click(function(){
    //         $("#male").prop("checked", true);
    //     });
    //     $(".check-female").click(function(){
    //         $("#female").prop("checked", true);
    //     });
    // });
      //  if( this.detail.typeOfCollection == 'Foreign Sales') {
      //    this.opt1 = 'checked';
      //   console.log('if', this.opt1);
      //  } else {
      //    this.opt2 = 'checked';
      //    console.log('else', this.opt2);
      //  }
      console.log(res.data);
     });
   
    this.editCommissionForm = this.formBuilder.group({
      project: ['', Validators.required],
      salesAgentId: ['', Validators.required],
      countryName: ['', Validators.required],
      payment: ['', [Validators.required, MyValidators.NumberOnly, Validators.maxLength(2)]],
      // collectionFrom: ['', [Validators.required, MyValidators.NumberOnly]],
      // collectionTo: ['', [Validators.required, MyValidators.NumberOnly]],
      collectionType: ['', Validators.required],
      collectionFrom: ['', [Validators.required, Validators.maxLength(8), MyValidators.NumberOnly]],
      collectionTo: ['', [Validators.required, MyValidators.NumberOnly]]
      }, {
          validator: MustGreater('collectionFrom', 'collectionTo')
      });
    $(function () {
      $('.navbar-default li.manageCommission').addClass('active');
    });
  }
  onSubmit() {
    let newData= {
      key: this.key,
      projectId: this.detail.projectId,
      agentId: this.detail.agentId,
      projectName: this.editCommissionForm.get('project').value,
      agentName: this.editCommissionForm.get('salesAgentId').value,
      countryName: this.editCommissionForm.get('countryName').value,
      payment: this.editCommissionForm.get('payment').value,
      collectionFrom: (this.editCommissionForm.get('collectionFrom').value).toString() ,
      collectionTo: (this.editCommissionForm.get('collectionTo').value).toString(),
      // collectionType: 'this'
      collectionType: this.editCommissionForm.get('collectionType').value
    };
    console.log(newData);
    this.apiService.update(newData).subscribe( res => {
      console.log(res);
      if ( res.status === 200) {
        this.ngFlashMessageService.showFlashMessage({
          messages: ['Commission Update successfully'],
          timeout: 500
        });
        setTimeout( () => {
          this.router.navigate(['/manage-commission']);
        }, 1000);
      }
    });
  }
  ngOnDestroy() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageCommission').removeClass('active');
    });
  }
  get salesAgentId() {
    return this.editCommissionForm.get('salesAgentId');
  }
  get countryName() {
    return this.editCommissionForm.get('countryName');
  }
  get collectionFrom() {
    return this.editCommissionForm.get('collectionFrom');
  }
  get collectionTo(){
    return this.editCommissionForm.get('collectionTo');
  }
  get collectionType() {
    return this.editCommissionForm.get('collectionType');
  }
  get payment() {
    return this.editCommissionForm.get('payment');
  }
  get project() {
    return this.editCommissionForm.get('project');
  }

}
