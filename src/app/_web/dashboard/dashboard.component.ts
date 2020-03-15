import { LocalstorageService } from './../../Services/localstorage.service';
import { AuthenticationService } from './../../Services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RouteLinkService } from './../../Services/route-link.service';
import { ApiService } from './../../Services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExternaljsService } from 'src/app/shared/externaljs.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public projects: any[] = [];
  public projectId: any;
  public firstLogIn: boolean;
  public question: any[] = [];
  public popUpForm: FormGroup;
  public show: any;
  public className: string;


  public blank: boolean = false;
  public image: boolean = true;

  public flag: boolean = true;
  public isSuperAdmin;
  // tslint:disable-next-line:max-line-length
  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private externaljsService: ExternaljsService,
    private localstorageService: LocalstorageService) {
    this.apiService.getAllProject().subscribe(res => {
      console.log(res);
      this.projects = res.data;
    });
  }
  ngOnInit() {
    this.isSuperAdmin = this.localstorageService.superadminLogin;

    this.flag = JSON.parse(localStorage.getItem('loginStatus'));
    console.log(this.flag);
    this.flag = this.flag === null ? true : false;
    console.log(this.flag);
    this.firstLogIn = this.authenticationService.checkPopUp();
    if ( this.firstLogIn === true && this.flag === true ) {
      this.show = 'show';
    }
    this.authenticationService.securityQuestion().subscribe(res => {
      console.log(res.data);
      this.question = res.data;
      if (res.data.length == '0') {
        this.blank = true;
      }
    });
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(currentUser.email);
    // if ( )
    //  if ( localStorage.getItem('email') == )
    this.popUpForm = new FormGroup({
      answer: new FormControl('', Validators.required),
      questionField: new FormControl('', Validators.required),
    });
  }
  onSubmit() {
    this.className = 'close2';
    const answer = this.popUpForm.get('answer').value;
    const question = this.popUpForm.get('questionField').value;
    const id = question._id;
    const data = {
      securityQuestion: id,
      securityAnswer: this.popUpForm.get('answer').value
    };
    console.log(answer, question._id);
    this.authenticationService.updateAnswer(data).subscribe(res => {
      if (res.status === 200) {
        this.flag = false;
        localStorage.setItem('loginStatus', JSON.stringify(this.flag));
        // this.firstLogIn = true;
      }
      console.log(res);
    });
  }
  setProjectId(projectId: any) {
    console.log('here is id', projectId);
    localStorage.setItem('projectId', JSON.stringify(projectId));
    this.router.navigate(['/project-insight']);
  }
  get questionField() {
    return this.popUpForm.get('questionField');
  }
  get answer() {
    return this.popUpForm.get('answer');
  }
}
