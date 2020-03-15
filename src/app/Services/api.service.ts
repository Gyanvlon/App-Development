import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public projectId: any;
  mainUrl = 'http://52.15.144.158:3000/api/v1/';
  public stakeholderId: any;
  url = 'http://52.15.144.158:3000/api/v1/projects/get-projects';
  editurl = 'http://52.15.144.158:3000/api/v1/projects/edit-project';
  deleteurl = 'http://52.15.144.158:3000/api/v1/projects/delete-project';
  getStakeHoldersUrl = 'http://52.15.144.158:3000/api/v1/stakeholders/manage-stakeholders';
  addStakeholderUrl = 'http://52.15.144.158:3000/api/v1/stakeholders/create-stakeholder';
  getStakeholderRoleUrl = 'http://52.15.144.158:3000/api/v1/stakeholders/get-roles';
  updateStakeholderUrl = 'http://52.15.144.158:3000/api/v1/stakeholders/edit-stakeholder';
  universalMessageUrl = 'http://52.15.144.158:3000/api/v1/projects';
  newrequestUrl = 'http://52.15.144.158:3000/api/v1/supportrequests/create-request';
  deleteStakeholderUrl = 'http://52.15.144.158:3000/api/v1/stakeholders/delete-stakeholder';
  viewStakeholderUrl = 'http://52.15.144.158:3000/api/v1/stakeholders/manage-stakeholders';
  bankAccountDetailUrl = 'http://52.15.144.158:3000/api/v1/bankaccounts/get-bank-accounts';
  projectDetailStakeHoldersUrl = 'http://52.15.144.158:3000/api/v1/stakeholders/get-stakeholders-by-project';
  editBankAccountUrl = 'http://52.15.144.158:3000/api/v1/bankaccounts/edit-bank-account';
  addCommissionUrl = 'http://52.15.144.158:3000/api/v1/commission/add-commission';
  getCommissionUrl= 'http://52.15.144.158:3000/api/v1/commission/get-commission-project';
  updateCommissionUrl= 'http://52.15.144.158:3000/api/v1/commission/edit';
  getCommissionUrls= 'http://52.15.144.158:3000/api/v1/commission/get-commission';
  addBankUrl= 'http://52.15.144.158:3000/api/v1/bankaccounts/add-bank-account';
  projectDetail = new BehaviorSubject<any>({});
  setProjectDetail(projectDetail) {
    console.log(projectDetail);
    this.projectDetail.next(projectDetail);
  }
  constructor(private http: HttpClient) {
  }
  addStakeholder(imgfile, stakeholderName, email, projects, payInfo): Observable<any> {
    console.log('this new data', email, imgfile, projects, stakeholderName);
    const data = new FormData();
    data.append('stakeholderImage', imgfile);
    data.append('stakeholderName', stakeholderName);
    data.append('email', email);
    data.append('projects', projects);
    data.append('paymentInformation', payInfo);
    console.log('here is stakeholder data', data);
    return this.http.post(`${this.addStakeholderUrl}`, data);
  }
  getStakeholderRole(): Observable<any> {
    return this.http.get(`${this.getStakeholderRoleUrl}`);
  }
  stakeHolderDetails(): Observable<any> {
    return this.http.get<any>(`${this.getStakeHoldersUrl}`);
  }
  deleteStakeholder(id): Observable<any> {
    console.log(`${this.deleteStakeholderUrl}/${id}`);
    return this.http.put<any>(`${this.deleteStakeholderUrl}/${id}`, {});
  }
  getId(id) {
    this.projectId = id;
  }
  updateStakeholder(name, image, email, project, payInfo): Observable<any> {
    const data = new FormData();
    console.log(email, image);
    console.log(name, image, project, email, payInfo);
    data.append('stakeholderName', name);
    data.append('email', email);
    data.append('stakeholderImage', image);
    data.append('projects', project);
    data.append('paymentInformation', payInfo);
    console.log('here is stakeholder data', data);
    return this.http.put(`${this.updateStakeholderUrl}/${this.projectId}`, data);
  }
  stakeholderProfile(id: any): Observable<any> {
    console.log(id);
    return this.http.get(`${this.viewStakeholderUrl}/${id}`);
  }
  getDisplayProjectDetails(id: any): Observable<any> {
    return this.http.get<any>(`${this.url + '/' + id}`);
  }
  bankAccountDetail(id): Observable<any> {
    return this.http.get(`${this.bankAccountDetailUrl}/${id}`);
  }
  AddBankDetail(data): Observable<any> {
    console.log(JSON.stringify(data));
    console.log(typeof data);

    return this.http.post(`${this.addBankUrl}`, data);
  }
  editbankDetail(bankDetail): Observable<any> {
    console.log(bankDetail);
    let stakeholder = JSON.parse(localStorage.getItem('currentUser'));
    let id = stakeholder.userId;
    console.log('here is update datta ', bankDetail);
    console.log('here is update datta ', typeof bankDetail);

    return this.http.put(`${this.editBankAccountUrl}/${id}`, JSON.parse(bankDetail));
  }
  addNewCommission(data): Observable<any> {
    return this.http.post(`${this.addCommissionUrl}`, data);
  }
  getCommission(id): Observable<any> {
    console.log(id);
    console.log(`${this.getCommissionUrl}/${id}`);
    return this.http.get(`${this.getCommissionUrl}/${id}`);
  }
  update(data): Observable<any> {
    console.log(typeof data);
    return this.http.post(`${this.updateCommissionUrl}`, data);
  }
  getCommissionDetail(key): Observable<any> {
    return this.http.get(`${this.getCommissionUrls}/${key}`);
  }
  getAccountByProjecId(id): Observable <any> {
    return this.http.get(`${this.mainUrl}bankaccounts/get-bank-accounts-one/${id}`);
  }
  listOfTransaction(id : any): Observable <any> {
   let  projectId =  { projectId: id};
   return this.http.post(`${this.mainUrl}distributor/get-distributor-transaction-list`, projectId) 
  }
 moneyDistribution(id :any): Observable <any> {
  let  projectId =  { projectId: id};
   return this.http.post(`${this.mainUrl}payments/money-distribution-by-project`, projectId)
 } 
  // projectList(id): Observable <any> {
  //   return this.http.get(`${this.mainUrl}stakeholders/get-stakeholders-by-project/${id}`)
  // }
  //  // addStakeholder(Data): Observable<any> {
  //   console.log('here is data for post', Data);
  //   return this.http.post(`${this.addStakeholderUrl}`, Data);
  // }
  // getStakeholderRole(): Observable<any> {
  //   return this.http.get(`${this.getStakeholderRoleUrl}`);
  // }
  // stakeHolderDetails(): Observable<any> {
  //   return this.http.get<any>(`${this.getStakeHoldersUrl}`);
  // }
  // updateStakeholder(): Observable<any> {
  //   return this.http.put(`${this.updateStakeholderUrl}`, {});
  // }
  // getDisplayProjectDetails(id: any): Observable<any> {
  //   return this.http.get<any>(`${this.url + '/' + id}`);
  // }

  getAllProject(): Observable<any> {
    return this.http.get<any>(`${this.url}`);
  }
  setProjectID(Id: any) {
    console.log(Id);
    this.projectId = Id;
  }
  getProjecttDetail(id): Observable<any> {
    console.log(this.projectId);
    console.log(`${this.url}/${id}`);
    return this.http.get<any>(`${this.url}/${id}`);
  }

  EditProjectDetails(projectDescription, startDate, pressAndArticles, projectId, projectImageData): Observable<any> {
    console.log(projectDescription, startDate, pressAndArticles, projectId, projectImageData);
    // Form Data for image upload to api
    console.log(projectImageData);
    const EditProjectDataForApi = new FormData();
    console.log(EditProjectDataForApi);
    EditProjectDataForApi.append('projectImage', projectImageData);
    EditProjectDataForApi.append('projectDescription', projectDescription);
    EditProjectDataForApi.append('startDate', startDate);
    EditProjectDataForApi.append('pressAndArticles', pressAndArticles);

    console.log('formData', EditProjectDataForApi);
    // console.log(projectDescription, startDate, pressAndArticles, projectId, projectImageData);
    return this.http.put<any>(`${this.editurl}/${projectId}`, EditProjectDataForApi);
  }
  deleteProject(id): Observable<any> {
    return this.http.put<any>(`${this.deleteurl}/${id}`, '');
  }

  getUniversalMessage(id, message): Observable<any> {
    console.log(message);
    return this.http.post<any>(`${this.universalMessageUrl}/${id}/universal-message`, message);
  }

  editCama(camaFile, projectId): Observable<any> {
    const camaDocument = new FormData();
    camaDocument.append('camaDocument', camaFile);
    return this.http.put<any>(`${this.editurl}/${projectId}`, camaDocument);
  }

  newRequest(requestSubject, project, requestDescription, date, requestId): Observable<any> {
    console.log(requestSubject, project, requestDescription, date, requestId);
    return this.http.post<any>(`${this.newrequestUrl}`, { requestSubject, project, requestDescription, date, requestId });

  }
  projectDetailStakeholders(projectId) {
    console.log(projectId);
    return this.http.get<any>(`${this.projectDetailStakeHoldersUrl}/${projectId.trim()}`);

  }

  getAllSupportRequestsForProject(projectId, type): Observable<any> {
    return this.http.get<any>(`${this.mainUrl}supportrequests/get-requests-by-project/${projectId}?status=${type}`);
  }

  addNewComment(requestId, description): Observable<any> {
    return this.http.post<any>(`${this.mainUrl}supportrequests/add-comment`, { requestId, description });
  }
  resolveIssues(requestId): Observable<any> {
    return this.http.put<any>(`${this.mainUrl}supportrequests/edit-request/${requestId}`, {});
  }

  camatermByProject(requestId): Observable<any> {
    return this.http.get<any>(`${this.mainUrl}camaterm/query-camaterm-by-projectid/${requestId}`);
  }

  getProjectPhase(requestId): Observable<any> {
    return this.http.get<any>(`${this.mainUrl}projects/get-phase-project/${requestId}`);
  }

  getStakeholderList(requestId): Observable<any> {
    return this.http.get<any>(`${this.mainUrl}stakeholders/get-all-stakeholders-of-project/${requestId}`);
  }

  addCamaTerm(data) {
    return this.http.post<any>(`${this.mainUrl}camaterm/create-new-camaterm`, data);
  }

  getStakeHolderRolesByStakeholdersSelected(projectId, stakeholderId) {
    console.log(projectId);
    console.log(stakeholderId);
    // let data = {

    //   projectId,
    //   stakeholderId
    // }

    return this.http.post<any>(`${this.mainUrl}stakeholders/get-stakeholder-roles-of-project`, { projectId, stakeholderId });
  }

  addCamaTermsDetails(projectId) {
    return this.http.get<any>(`${this.mainUrl}camaterm/query-camaterm/${projectId}`);
  }

}
