import { ApiService } from './../../Services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'; // to formt data from api
import { NgFlashMessageService } from 'ng-flash-messages';
import { Country } from '../../shared/countrylist';



@Component({
  selector: 'app-add-cama-terms',
  templateUrl: './add-cama-terms.component.html',
  styleUrls: ['./add-cama-terms.component.css']
})
export class AddCamaTermsComponent implements OnInit {

  public typeOfInvestment: any[] = [];
  public projectId: any;
  public Loan = [];
  public roles: any[] = [];
  public camatermForm: FormGroup;
  public projectPhases: any;
  public stakeholders: any;
  public formSubmit: any;
  public interestRate: any[] = [];
  public duration: any[] = [];
  public percentage;
  public amount;
  public initialInvestment;
  public isDiabled: boolean = false;
  public interestCalc;
  public stakeholdersList;
  public stakeholdersRoleList;
  public cummulativeInterestField;
  public sakeholderId;
  public sakeholderName;
  public countryList: any[] = Country;
  public minimumCollections;
  public naChecked = false;
  // public selected = 'Foreign Sales';

  constructor(public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private ngFlashMessageService: NgFlashMessageService) {
    route.params.subscribe(val => {
      this.projectId = this.route.snapshot.paramMap.get('id');
      // console.log(this.projectId);
      this.getProjectPhase();
      this.getStakeholderList();
    });
  }

  getProjectPhase() {
    this.apiService.getProjectPhase(this.projectId).subscribe(res => {
      this.projectPhases = res.data;
      // console.log(this.projectPhases);
    });
  }

  getStakeholderList() {
    this.apiService.projectDetailStakeholders(this.projectId).subscribe(res => {
      this.stakeholders = res.data;
      console.log(this.stakeholders);
    })
  }
  ngOnInit() {

    this.typeOfInvestment = [
      { option: 'Loan' },
      { option: 'Deferment' },
      { option: 'Legal Fees' },
      { option: 'Investment Premium' },
      { option: 'Turnaround Reimbursement' },
      { option: 'Completion Guarantor Advacnes' },
      { option: 'Other' },
    ];

    this.roles = [
      { option: 'Investor' },
      { option: 'Producer' },
      { option: 'Agency' },
      { option: 'Talent' },
      { option: 'Production Company' },
      { option: 'Business Manager' },
      { option: 'Strategic Partner' },
      { option: 'Debt Loan' },
      { option: 'Investment Manager' },
      { option: 'Super-Admin' },
      { option: 'Admin' }
    ];

    this.camatermForm = this.formBuilder.group({
      interest: ['', Validators.required],
      for: ['', Validators.required],
      TypeOfInvestments: ['', Validators.required],
      termName: ['', Validators.required],
      priority: ['', Validators.required],
      stakeholder: ['', Validators.required],
      role: ['', Validators.required],
      country: ['', Validators.required],
      date: ['', Validators.required],
      collection: ['', Validators.required],
      minCollection: ['', Validators.required],
      loanIssueDate: ['', Validators.required],
      cummulativeInterest: ['', Validators.required],
      defermentAmount: ['', Validators.required],
      investment: ['', Validators.required],
      loanInterestRate: ['', Validators.required],
      loanfor: ['', Validators.required],
      legalFeesAmount: ['', Validators.required],
      investmentPremiumPercent: ['', Validators.required],
      investmentPremiumAmount: ['', Validators.required],
      turnaroundReimbursementAmount: ['', Validators.required],
      guarantorPerecent: ['', Validators.required],
      otherAmount: ['', Validators.required],
      otherPercent: ['', Validators.required],
      otherFinalAmount: ['', Validators.required],
      typCollection: ['', Validators.required],
      defermentPayment: ['', Validators.required]
    });

    this.onChanges();
  }
  valueChanged() {
    if ($('.na').is(":checked")) {
      this.naChecked = true;
      this.camatermForm.get('minCollection').disable();
      this.camatermForm.get('minCollection').reset();
    }
    else {
      this.naChecked = false;
      this.camatermForm.get('minCollection').enable();
      this.minimumCollections = (this.camatermForm.get('minCollection').value).toString();
    }
  }
  cummInterestChange() {

    if ($('.cummInt').is(":checked")) {
      this.cummulativeInterestField = true;
    }
    else {
      this.cummulativeInterestField = false;
    }

  }
  addButtonClick(): void { // Adding item from pressAndArticle html to ts
    let val1 = this.camatermForm.get('interest').value;
    let val2 = this.camatermForm.get('for').value;
    this.interestRate.push(val1);
    this.duration.push(val2);
    console.log(this.interestRate);
    console.log(this.duration);
    const item = {
      interest: this.camatermForm.get('interest').value,
      for: this.camatermForm.get('for').value
    };
    console.log(item);
    this.Loan.push(item);
    console.log(this.Loan);
    this.camatermForm.controls.interest.reset();
    this.camatermForm.controls.for.reset();
  }
  removeButtonClick(index) { // removing item from pressAndArticles on the event form HTML
    console.log(index);
    this.Loan.splice(index, 1);
  }
  getRole(event) {
    console.log(event.value);
    this.sakeholderId = event.value._id;
    this.sakeholderName = event.value.stakeholderName;
    // console.log(data);
    // let id = (data[1]);
    console.log(this.sakeholderId);
    this.apiService.getStakeHolderRolesByStakeholdersSelected(this.projectId, this.sakeholderId).subscribe(res => {
      console.log(res);
      this.stakeholdersRoleList = res.data;
      console.log(this.stakeholdersRoleList);
    });
  }

  onSubmit() {

    if (!this.camatermForm.valid) {
      this.formSubmit = true;
    }
    this.formSubmit = false;

    let projectId = this.projectId;
    let termName = this.camatermForm.get('termName').value;
    let priority = this.camatermForm.get('priority').value;
    let stakeholder = this.camatermForm.get('stakeholder').value;
    let investmentType = this.camatermForm.get('TypeOfInvestments').value;
    let interestRate = this.interestRate;
    let typeOfCollections = this.camatermForm.get('typCollection').value;
    let country = this.camatermForm.get('country').value;



    let stakeholderName = this.sakeholderName;
    let stakeholderId = this.sakeholderId;
    console.log(stakeholderName);
    // console.log('investmentType', investmentType);
    // PAYMENT

    let role = (this.camatermForm.get('role').value);
    let camaIssueDate = moment(this.camatermForm.get('date').value).format('MM/DD/YYYY');
    let issueDate = moment(this.camatermForm.get('loanIssueDate').value).format('MM/DD/YYYY');
    let duration = this.duration;
    let cummulativeInterest = this.camatermForm.get('cummulativeInterest').value;

    console.log(camaIssueDate);
    let percentage = this.percentage;
    let amount = this.amount;
    let initialInvestment = this.initialInvestment;
    let minimumCollections = this.minimumCollections;
    console.log(initialInvestment);
    let data = {
      projectId,
      stakeholderId,
      termName,
      priority,
      stakeholderName,
      investmentType,
      interestRate,
      minimumCollections,
      typeOfCollections,
      country,
      role,
      camaIssueDate,
      issueDate,
      duration,
      cummulativeInterest,
      percentage,
      amount,
      initialInvestment
    };
    console.log(data);
    if (termName == ' ' || priority == ' ' || stakeholderName == ' ' || role == ''
      || country == '' || camaIssueDate == ''
      || typeOfCollections == '' || minimumCollections == ''
      || investmentType == undefined) {

      window.scroll(0, 0);
      this.ngFlashMessageService.showFlashMessage({
        messages: ["Fields can't be empty"],
        timeout: 1000,
        type: 'danger'
      });
    }
    else {
      console.log('in else')
      let selectedType = this.camatermForm.get('TypeOfInvestments').value;

      if (selectedType == 'Loan') {
        let int = this.camatermForm.get('interest').value;
        let rate = this.camatermForm.get('for').value;
        console.log('loan');
        if (this.initialInvestment == '' || issueDate == 'Invalid date'
          || int == ''
          || rate == '') {
          window.scroll(0, 0);
          this.ngFlashMessageService.showFlashMessage({
            messages: ["Loan's Fields can't be empty"],
            timeout: 1000,
            type: 'danger'
          });
          if (this.camatermForm.get('interest').value == '' || this.camatermForm.get('for').value == '') {
            window.scroll(0, 0);
            this.ngFlashMessageService.showFlashMessage({
              messages: ["Interest and Rate Fields can't be empty"],
              timeout: 1000,
              type: 'danger'
            });
          }
          else {

            let val1 = this.camatermForm.get('interest').value;
            let val2 = this.camatermForm.get('for').value;
            this.interestRate.push(val1);
            this.duration.push(val2);
            console.log('in else API');
          }
          if (this.cummulativeInterestField == true) {
            if (cummulativeInterest == '') {
              window.scroll(0, 0);
              this.ngFlashMessageService.showFlashMessage({
                messages: ["Cummutative Interest Rate Field can't be empty"],
                timeout: 1000,
                type: 'danger'
              });
            }
          }
        }
        else {
          //Add API
          this.apiService.addCamaTerm(data).subscribe(res => {
            console.log(res.data);
            this.stakeholdersList = res.data;

            if (res.status == 200) {
              this.ngFlashMessageService.showFlashMessage({
                messages: ['Stakeholder Added Successfully'],
                timeout: 1000,
              });
              setTimeout(() => {
                this.router.navigate(['/view-cama-terms/' + this.projectId]);
              }, 1000);
            }
          },
            error => {
              window.scrollTo(0, 0);
              this.ngFlashMessageService.showFlashMessage({
                messages: [error],
                timeout: 5000,
                type: 'danger'
              });
            });
        }
      }
      else if (selectedType == 'Deferment') {
        if ((this.percentage == undefined || this.percentage == '')  && (this.amount == undefined || this.amount == '' )) {
          window.scrollTo(0, 0);
          this.ngFlashMessageService.showFlashMessage({
            messages: ['Payment OR Amount field, one should be filled'],
            timeout: 5000,
            type: 'danger'
          });
        }
        else {
          //Add API
          this.apiService.addCamaTerm(data).subscribe(res => {
            console.log(res.data);
            this.stakeholdersList = res.data;

            if (res.status == 200) {
              this.ngFlashMessageService.showFlashMessage({
                messages: ['Stakeholder Added Successfully'],
                timeout: 1000,
              });
              setTimeout(() => {
                this.router.navigate(['/view-cama-terms/' + this.projectId]);
              }, 1000);
            }
          },
            error => {
              window.scrollTo(0, 0);
              this.ngFlashMessageService.showFlashMessage({
                messages: [error],
                timeout: 5000,
                type: 'danger'
              });
            });
        }
      }

      else if (selectedType == 'Legal Fees') {
        if (this.amount == undefined || this.amount == '') {
          window.scrollTo(0, 0);
          this.ngFlashMessageService.showFlashMessage({
            messages: ['Amount field should be filled'],
            timeout: 5000,
            type: 'danger'
          });
        }
        else {
          //Add API
          this.apiService.addCamaTerm(data).subscribe(res => {
            console.log(res.data);
            this.stakeholdersList = res.data;

            if (res.status == 200) {
              this.ngFlashMessageService.showFlashMessage({
                messages: ['Stakeholder Added Successfully'],
                timeout: 1000,
              });
              setTimeout(() => {
                this.router.navigate(['/view-cama-terms/' + this.projectId]);
              }, 1000);
            }
          },
            error => {
              window.scrollTo(0, 0);
              this.ngFlashMessageService.showFlashMessage({
                messages: [error],
                timeout: 5000,
                type: 'danger'
              });
            });
        }
      }

      else if (selectedType == 'Investment Premium') {
        if ((this.initialInvestment == undefined || this.initialInvestment == '') || (this.percentage == undefined || this.percentage == '')) {
          window.scrollTo(0, 0);
          this.ngFlashMessageService.showFlashMessage({
            messages: ['Percentage & Amount field, should be filled'],
            timeout: 5000,
            type: 'danger'
          });
        }
        else {
          //Add API
          this.apiService.addCamaTerm(data).subscribe(res => {
            console.log(res.data);
            this.stakeholdersList = res.data;

            if (res.status == 200) {
              this.ngFlashMessageService.showFlashMessage({
                messages: ['Stakeholder Added Successfully'],
                timeout: 1000,
              });
              setTimeout(() => {
                this.router.navigate(['/view-cama-terms/' + this.projectId]);
              }, 1000);
            }
          },
            error => {
              window.scrollTo(0, 0);
              this.ngFlashMessageService.showFlashMessage({
                messages: [error],
                timeout: 5000,
                type: 'danger'
              });
            });
        }
      }

      else if (selectedType == 'Turnaround Reimbursement') {
        if (this.amount == undefined || this.amount == '') {
          window.scrollTo(0, 0);
          this.ngFlashMessageService.showFlashMessage({
            messages: ['Amount field should be filled'],
            timeout: 5000,
            type: 'danger'
          });
        }
        else {
          //Add API
          this.apiService.addCamaTerm(data).subscribe(res => {
            console.log(res.data);
            this.stakeholdersList = res.data;

            if (res.status == 200) {
              this.ngFlashMessageService.showFlashMessage({
                messages: ['Stakeholder Added Successfully'],
                timeout: 1000,
              });
              setTimeout(() => {
                this.router.navigate(['/view-cama-terms/' + this.projectId]);
              }, 1000);
            }
          },
            error => {
              window.scrollTo(0, 0);
              this.ngFlashMessageService.showFlashMessage({
                messages: [error],
                timeout: 5000,
                type: 'danger'
              });
            });
        }
      }

      else if (selectedType == 'Completion Guarantor Advacnes') {
        if (this.percentage == undefined || this.percentage == '') {
          window.scrollTo(0, 0);
          this.ngFlashMessageService.showFlashMessage({
            messages: ['Percentage field should be filled'],
            timeout: 5000,
            type: 'danger'
          });
        }
        else {
          //Add API
          this.apiService.addCamaTerm(data).subscribe(res => {
            console.log(res.data);
            this.stakeholdersList = res.data;

            if (res.status == 200) {
              this.ngFlashMessageService.showFlashMessage({
                messages: ['Stakeholder Added Successfully'],
                timeout: 1000,
              });
              setTimeout(() => {
                this.router.navigate(['/view-cama-terms/' + this.projectId]);
              }, 1000);
            }
          },
            error => {
              window.scrollTo(0, 0);
              this.ngFlashMessageService.showFlashMessage({
                messages: [error],
                timeout: 5000,
                type: 'danger'
              });
            });
        }
      }

      else if (selectedType == 'Other') {
        if (((this.percentage == undefined || this.percentage == '') || (this.initialInvestment == undefined || this.initialInvestment == '')) && (this.amount == undefined || this.amount == '')) {
          window.scrollTo(0, 0);
          this.ngFlashMessageService.showFlashMessage({
            messages: ['Either Percentage & Amount field should be filled OR Amount field should be filled'],
            timeout: 5000,
            type: 'danger'
          });
        }
        else {
          //Add API
          this.apiService.addCamaTerm(data).subscribe(res => {
            console.log(res.data);
            this.stakeholdersList = res.data;

            if (res.status == 200) {
              this.ngFlashMessageService.showFlashMessage({
                messages: ['Stakeholder Added Successfully'],
                timeout: 1000,
              });
              setTimeout(() => {
                this.router.navigate(['/view-cama-terms/' + this.projectId]);
              }, 1000);
            }
          },
            error => {
              window.scrollTo(0, 0);
              this.ngFlashMessageService.showFlashMessage({
                messages: [error],
                timeout: 5000,
                type: 'danger'
              });
            });
        }
      }
    }
  }

  onChanges() {
    this.interestCalc = 0.00;
    this.camatermForm.get('cummulativeInterest').valueChanges.subscribe(interest => {
      this.interestCalc = interest / 365;
      this.interestCalc = parseFloat(this.interestCalc).toFixed(2);
      console.log(this.interestCalc);
    });

    this.camatermForm.get('for').disable();
    this.camatermForm.get('loanIssueDate').disable();
    // this.camatermForm.get('cummulativeInterest').disable();
    this.camatermForm.get('defermentAmount').disable();
    this.camatermForm.get('investment').disable();
    this.camatermForm.get('loanInterestRate').disable();
    this.camatermForm.get('loanfor').disable();
    this.camatermForm.get('interest').disable();
    this.camatermForm.get('legalFeesAmount').disable();
    this.camatermForm.get('investmentPremiumPercent').disable();
    this.camatermForm.get('investmentPremiumAmount').disable();
    this.camatermForm.get('turnaroundReimbursementAmount').disable();
    this.camatermForm.get('guarantorPerecent').disable();
    this.camatermForm.get('otherAmount').disable();
    this.camatermForm.get('otherPercent').disable();
    this.camatermForm.get('otherFinalAmount').disable();
    if (this.naChecked != true) {
      this.camatermForm.get('minCollection').valueChanges.subscribe(selectedType => {
        if (this.naChecked != true) {
          this.minimumCollections = (this.camatermForm.get('minCollection').value).toString();
        }
      });
    }
    this.camatermForm.get('TypeOfInvestments').valueChanges.subscribe(selectedType => {
      console.log(selectedType);

      if (selectedType == 'Loan') {
        console.log('loan');
        this.camatermForm.get('investment').enable();
        this.camatermForm.get('loanInterestRate').enable();
        this.camatermForm.get('loanfor').enable();
        this.camatermForm.get('interest').enable();
        this.camatermForm.get('for').enable();
        this.camatermForm.get('loanIssueDate').enable();
      }

      else if (selectedType == 'Deferment') {
        this.camatermForm.get('defermentAmount').enable();
      }

      else if (selectedType == 'Legal Fees') {
        this.camatermForm.get('legalFeesAmount').enable();
      }

      else if (selectedType == 'Investment Premium') {
        this.camatermForm.get('investmentPremiumPercent').enable();
        this.camatermForm.get('investmentPremiumAmount').enable();
      }

      else if (selectedType == 'Turnaround Reimbursement') {
        this.camatermForm.get('turnaroundReimbursementAmount').enable();
      }

      else if (selectedType == 'Completion Guarantor Advacnes') {
        this.camatermForm.get('guarantorPerecent').enable();
      }

      else if (selectedType == 'Other') {
        this.camatermForm.get('otherAmount').enable();
        this.camatermForm.get('otherPercent').enable();
        this.camatermForm.get('otherFinalAmount').enable();
      }
    });

    this.camatermForm.get('investmentPremiumPercent').valueChanges.subscribe(pay => {
      this.percentage = pay.toString();
    });

    this.camatermForm.get('guarantorPerecent').valueChanges.subscribe(pay => {
      this.percentage = pay.toString();
    });

    this.camatermForm.get('otherPercent').valueChanges.subscribe(pay => {
      this.percentage = pay.toString();
    });

    this.camatermForm.get('defermentPayment').valueChanges.subscribe(pay => {
      console.log(pay);
      this.percentage = pay.toString();
    });

    // AMOUNT
    this.camatermForm.get('defermentAmount').valueChanges.subscribe(amount => {
      console.log(amount);
      this.amount = amount.toString();
    });
    this.camatermForm.get('investment').valueChanges.subscribe(amount => {
      console.log(amount);
      this.initialInvestment = amount.toString();
    });
    this.camatermForm.get('legalFeesAmount').valueChanges.subscribe(amount => {
      this.amount = amount.toString();
    });

    this.camatermForm.get('investmentPremiumAmount').valueChanges.subscribe(amount => {
      this.initialInvestment = amount.toString();
    });

    this.camatermForm.get('turnaroundReimbursementAmount').valueChanges.subscribe(amount => {
      this.amount = amount.toString();
    });

    this.camatermForm.get('otherAmount').valueChanges.subscribe(amount => {
      this.initialInvestment = amount.toString();
    });

    this.camatermForm.get('otherFinalAmount').valueChanges.subscribe(amount => {
      this.amount = amount.toString();
    });
  }
  get for() {
    return this.camatermForm.get('for');
  }
  get TypeOfInvestments() {
    return this.camatermForm.get('TypeOfInvestments');
  }
  get termName() {
    return this.camatermForm.get('termName');
  }
  get priority() {
    return this.camatermForm.get('priority');
  }
  get stakeholder() {
    return this.camatermForm.get('stakeholder');
  }
  get role() {
    return this.camatermForm.get('role');
  }
  get country() {
    return this.camatermForm.get('country');
  }
  get date() {
    return this.camatermForm.get('date');
  }
  get collection() {
    return this.camatermForm.get('collection');
  }
  get minCollection() {
    return this.camatermForm.get('minCollection');
  }
  get loanIssueDate() {
    return this.camatermForm.get('loanIssueDate');
  }
  get cummulativeInterest() {
    return this.camatermForm.get('cummulativeInterest');
  }
  get defermentAmount() {
    return this.camatermForm.get('defermentAmount');
  }
  get investment() {
    return this.camatermForm.get('investment');
  }
  get loanInterestRate() {
    return this.camatermForm.get('loanInterestRate');
  }
  get loanfor() {
    return this.camatermForm.get('loanfor');
  }
  get interest() {
    return this.camatermForm.get('interest');
  }
  get legalFeesAmount() {
    return this.camatermForm.get('legalFeesAmount');
  }
  get investmentPremiumPercent() {
    return this.camatermForm.get('investmentPremiumPercent');
  }
  get investmentPremiumAmount() {
    return this.camatermForm.get('investmentPremiumAmount');
  }
  get turnaroundReimbursementAmount() {
    return this.camatermForm.get('turnaroundReimbursementAmount');
  }
  get guarantorPerecent() {
    return this.camatermForm.get('guarantorPerecent');
  }
  get otherAmount() {
    return this.camatermForm.get('otherAmount');
  }
  get otherPercent() {
    return this.camatermForm.get('otherPercent');
  }
  get otherFinalAmount() {
    return this.camatermForm.get('otherFinalAmount');
  }
  get typCollection() {
    return this.camatermForm.get('typCollection');
  }
  get defermentPayment() {
    return this.camatermForm.get('defermentPayment');
  }
}
