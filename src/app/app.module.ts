import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ManageProjectComponent } from './_web/manage-project/manage-project.component';
import { AddCamaTermsComponent } from './_web/add-cama-terms/add-cama-terms.component';
import { EditCamaComponent } from './_web/edit-cama/edit-cama.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { ApiService } from './Services/api.service';
import { AuthenticationService } from './Services/authentication.service';
import { EditBankAccountDetailsComponent } from './_web/edit-bank-account-details/edit-bank-account-details.component';
import { BankAccountDetailsComponent } from './_web/bank-account-details/bank-account-details.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './_web/login/login/login.component';
import { ManageCommissionComponent } from './_web/manage-commission/manage-commission.component';
import { ProfileComponent } from './_web/profile/profile.component';
import { ChangePasswordComponent } from './_web/login/change-password/change-password.component';
import { NavbarComponent } from './_web/navbar/navbar.component';
import { NotificationSettingComponent } from './_web/notification-setting/notification-setting.component';
import { ForgotPasswordComponent } from './_web/login/forgot-password/forgot-password.component';
import { HomeComponent } from './_web/home/home.component';
import { EditProfileComponent } from './_web/edit-profile/edit-profile.component';
import { MessageBoxComponent } from './_web/message-box/message-box.component';
import { AddCommissionComponent } from './_web/add-commission/add-commission.component';
import { EditCommissionComponent } from './_web/edit-commission/edit-commission.component';
import { CopyCommissionComponent } from './_web/copy-commission/copy-commission.component';
import { DashboardComponent } from './_web/dashboard/dashboard.component';
import { PaymentCnbAccountComponent } from './_web/payment-cnb-account/payment-cnb-account.component';
import { SupportRequestListingPageComponent } from './_web/support-request-listing-page/support-request-listing-page.component';
import { CamaContractsComponent } from './_web/cama-contracts/cama-contracts.component';
import { DeleteProjectComponent } from './_web/delete-project/delete-project.component';
import { ProgressToPayoutComponent } from './_web/progress-to-payout/progress-to-payout.component';
import { NewRequestComponent } from './_web/new-request/new-request.component';
import { ProjectInsightsComponent } from './_web/project-insights/project-insights.component';
import { GrossRevenueComponent } from './_web/gross-revenue/gross-revenue.component';
import { SalesIncomeComponent } from './_web/sales-income/sales-income.component';
import { TheatricalStatisticComponent } from './_web/theatrical-statistic/theatrical-statistic.component';
import { SalesGraphComponent } from './_web/sales-graph/sales-graph.component';
import { SalesDistributionComponent } from './_web/sales-distribution/sales-distribution.component';
import { GlobalSalesReportComponent } from './_web/global-sales-report/global-sales-report.component';
import { MoneyPaidComponent } from './_web/money-paid/money-paid.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ShellComponent } from './shell/shell.component';
import { JwtInterceptor } from './shared/jwt.interceptor';
import { ErrorInterceptor } from './shared/error.interceptor';
import { ViewCamaTermComponent } from './_web/view-cama-term/view-cama-term.component';
import { DemoSimulationComponent } from './_web/demo-simulation/demo-simulation.component';
import { ViewStatusComponent } from './_web/view-status/view-status.component';
import { CommonModule } from '@angular/common';
import { EditProjectComponent } from './_web/edit-project/edit-project.component';
import { ProjectDetailsComponent } from './_web/project-details/project-details.component';
import { UniversalMessageComponent } from './_web/universal-message/universal-message.component';
import { ProjectsRootComponent } from './_web/projects-root/projects-root.component';
import { SupportRequestDetailPageComponent } from './_web/support-request-detail-page/support-request-detail-page.component';
import { VerifyCollectionComponent } from './_web/verify-collection/verify-collection.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { ViewStakeholderByProjectComponent } from './_web/view-stakeholder-by-project/view-stakeholder-by-project.component';
import { ManageStakeholdersComponent } from './_web/manage-stakeholder/manage-stakeholders/manage-stakeholders.component';
import { StakeholdersAccountComponent } from './_web/manage-stakeholder/stakeholders-account/stakeholders-account.component';
import { StakeholdersDetailsComponent } from './_web/manage-stakeholder/stakeholders-details/stakeholders-details.component';
import { AddStakeholdersComponent } from './_web/manage-stakeholder/add-stakeholders/add-stakeholders.component';
import { ProjectStakeholdersComponent } from './_web/manage-stakeholder/project-stakeholders/project-stakeholders.component';
import { EditStakeholdersComponent } from './_web/manage-stakeholder/edit-stakeholders/edit-stakeholders.component';
import { StakeholderRootComponent } from './_web/manage-stakeholder/stakeholder-root/stakeholder-root.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { ManageStakeholderModule } from './_web/manage-stakeholder/manage-stakeholder.module';
import { SearchPipePipe } from './search-pipe.pipe';
import { EditCamaTermsComponent } from './_web/edit-cama-terms/edit-cama-terms.component';
import { AddBankAccountComponent } from './add-bank-account/add-bank-account.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MoneyDistributionComponent } from './money-distribution/money-distribution.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ManageCommissionComponent,
    ProfileComponent,
    ChangePasswordComponent,
    NavbarComponent,
    NotificationSettingComponent,
    ForgotPasswordComponent,
    HomeComponent,
    EditProfileComponent,
    MessageBoxComponent,
    AddCommissionComponent,
    EditCommissionComponent,
    CopyCommissionComponent,
    DashboardComponent,
    PaymentCnbAccountComponent,
    BankAccountDetailsComponent,
    SupportRequestListingPageComponent,
    CamaContractsComponent,
    DeleteProjectComponent,
    EditBankAccountDetailsComponent,
    NewRequestComponent,
    ProgressToPayoutComponent,
    ProjectInsightsComponent,
    GrossRevenueComponent,
    SalesIncomeComponent,
    TheatricalStatisticComponent,
    SalesGraphComponent,
    GlobalSalesReportComponent,
    SalesDistributionComponent,
    MoneyPaidComponent,
    ShellComponent,
    EditCamaComponent,
    AddCamaTermsComponent,
    ViewCamaTermComponent,
    DemoSimulationComponent,
    ViewStatusComponent,
    EditProjectComponent,
    DeleteProjectComponent,
    ManageProjectComponent,
    ProjectDetailsComponent,
    UniversalMessageComponent,
    ProjectsRootComponent,
    ProjectsRootComponent,
    SupportRequestDetailPageComponent,
    VerifyCollectionComponent,
    NewProjectComponent,
    ViewStakeholderByProjectComponent,
    ManageStakeholdersComponent,
    StakeholdersAccountComponent,
    StakeholdersDetailsComponent,
    AddStakeholdersComponent,
    ProjectStakeholdersComponent,
    EditStakeholdersComponent,
    StakeholderRootComponent,
    SearchPipePipe,
    EditCamaTermsComponent,
    AddBankAccountComponent,
    MoneyDistributionComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgFlashMessagesModule.forRoot(),
    NgxPaginationModule,
    // ManageStakeholderModule,
     NgMultiSelectDropDownModule.forRoot(),

    NgxPaginationModule,
    NgxSpinnerModule
  ],
  providers: [ApiService, AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
