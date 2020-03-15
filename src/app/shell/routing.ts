import { AddBankAccountComponent } from './../add-bank-account/add-bank-account.component';
import { EditCamaTermsComponent } from './../_web/edit-cama-terms/edit-cama-terms.component';
import { ViewStakeholderByProjectComponent } from './../_web/view-stakeholder-by-project/view-stakeholder-by-project.component';
import { ViewCamaTermComponent } from './../_web/view-cama-term/view-cama-term.component';
import { UniversalMessageComponent } from './../_web/universal-message/universal-message.component';
import { AddCamaTermsComponent } from './../_web/add-cama-terms/add-cama-terms.component';
import { MoneyPaidComponent } from './../_web/money-paid/money-paid.component';
import { GlobalSalesReportComponent } from './../_web/global-sales-report/global-sales-report.component';
import { SalesGraphComponent } from './../_web/sales-graph/sales-graph.component';
import { TheatricalStatisticComponent } from './../_web/theatrical-statistic/theatrical-statistic.component';
import { SalesIncomeComponent } from './../_web/sales-income/sales-income.component';
import { GrossRevenueComponent } from './../_web/gross-revenue/gross-revenue.component';
import { ProgressToPayoutComponent } from './../_web/progress-to-payout/progress-to-payout.component';
import { ProjectInsightsComponent } from './../_web/project-insights/project-insights.component';
import { NewRequestComponent } from './../_web/new-request/new-request.component';
import { EditBankAccountDetailsComponent } from './../_web/edit-bank-account-details/edit-bank-account-details.component';
import { EditProjectComponent } from '../_web/edit-project/edit-project.component';
import { DeleteProjectComponent } from './../_web/delete-project/delete-project.component';
import { ProjectDetailsComponent } from '../_web/project-details/project-details.component';
import { CamaContractsComponent } from './../_web/cama-contracts/cama-contracts.component';
import { SupportRequestListingPageComponent } from './../_web/support-request-listing-page/support-request-listing-page.component';
import { BankAccountDetailsComponent } from './../_web/bank-account-details/bank-account-details.component';
import { ManageProjectComponent } from '../_web/manage-project/manage-project.component';
import { PaymentCnbAccountComponent } from './../_web/payment-cnb-account/payment-cnb-account.component';
import { CopyCommissionComponent } from './../_web/copy-commission/copy-commission.component';
import { EditCommissionComponent } from './../_web/edit-commission/edit-commission.component';
import { AddCommissionComponent } from './../_web/add-commission/add-commission.component';
import { ManageCommissionComponent } from './../_web/manage-commission/manage-commission.component';
import { NotificationSettingComponent } from './../_web/notification-setting/notification-setting.component';
import { EditProfileComponent } from './../_web/edit-profile/edit-profile.component';
import { ProfileComponent } from './../_web/profile/profile.component';
import { MessageBoxComponent } from './../_web/message-box/message-box.component';
import { Routes } from '@angular/router';
import { DashboardComponent } from './../_web/dashboard/dashboard.component';
import { SalesDistributionComponent } from './../_web/sales-distribution/sales-distribution.component';
import { DemoSimulationComponent } from '../_web/demo-simulation/demo-simulation.component';
import { AuthGuard } from '../_guard/auth.guard';
import { ViewStatusComponent } from '../_web/view-status/view-status.component';
import { EditCamaComponent } from '../_web/edit-cama/edit-cama.component';
import { SupportRequestDetailPageComponent } from '../_web/support-request-detail-page/support-request-detail-page.component';
import { VerifyCollectionComponent } from '../_web/verify-collection/verify-collection.component';

import { AddStakeholdersComponent } from '../_web/manage-stakeholder/add-stakeholders/add-stakeholders.component';
import { StakeholdersAccountComponent } from '../_web/manage-stakeholder/stakeholders-account/stakeholders-account.component';
import { StakeholdersDetailsComponent } from '../_web/manage-stakeholder/stakeholders-details/stakeholders-details.component';
import { EditStakeholdersComponent } from '../_web/manage-stakeholder/edit-stakeholders/edit-stakeholders.component';
import { ProjectStakeholdersComponent } from '../_web/manage-stakeholder/project-stakeholders/project-stakeholders.component';
import { ManageStakeholdersComponent } from '../_web/manage-stakeholder/manage-stakeholders/manage-stakeholders.component';

export const SHELL_ROUTES: Routes = [
    // tslint:disable-next-line:max-line-length

   /// { path: 'manage-stakeholders', loadChildren: 'src/app/_web/manage-stakeholder/manage-stakeholder.module#ManageStakeholderModule' },
   {
    path: 'manage-stakeholders', component: ManageStakeholdersComponent,canActivate: [AuthGuard]
    },
   {
        path: 'add-stakeholders', component: AddStakeholdersComponent,canActivate: [AuthGuard]
     },
     {
       path: 'stakeholders-account', component: StakeholdersAccountComponent,canActivate: [AuthGuard]
     },
     {
       path: 'stakeholders-details/:id', component: StakeholdersDetailsComponent,canActivate: [AuthGuard]
     },
     {
       path: 'edit-stakeholders/:id', component: EditStakeholdersComponent,canActivate: [AuthGuard]
     },
     {
       path: 'project-stakeholders', component: ProjectStakeholdersComponent,canActivate: [AuthGuard]
     },
    // { path: 'manage-projects', loadChildren: 'src/app/_web/manage-projects/manage-projects.module#ManageProjectsModule' },
    { path: 'add-cama-terms/:id', component: AddCamaTermsComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'message-box', component: MessageBoxComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthGuard] },
    { path: 'notification-setting', component: NotificationSettingComponent, canActivate: [AuthGuard] },
    { path: 'manage-commission', component: ManageCommissionComponent, canActivate: [AuthGuard] },
    { path: 'add-commission', component: AddCommissionComponent, canActivate: [AuthGuard] },
    { path: 'edit-commission/:id', component: EditCommissionComponent, canActivate: [AuthGuard] },
    { path: 'copy-commission/:id', component: CopyCommissionComponent, canActivate: [AuthGuard] },
    { path: 'payment-cnb-account', component: PaymentCnbAccountComponent, canActivate: [AuthGuard] },
    { path: 'bank-account-details', component: BankAccountDetailsComponent, canActivate: [AuthGuard] },
    { path: 'support-request-listing-page', component: SupportRequestListingPageComponent, canActivate: [AuthGuard] },
    { path: 'cama-contracts', component: CamaContractsComponent, canActivate: [AuthGuard] },
    { path: 'delete-project/:id', component: DeleteProjectComponent, canActivate: [AuthGuard] },
    { path: 'edit-bank-account-details', component: EditBankAccountDetailsComponent, canActivate: [AuthGuard] },
    { path: 'new-request', component: NewRequestComponent, canActivate: [AuthGuard] },
    { path: 'project-insight', component: ProjectInsightsComponent, canActivate: [AuthGuard] },
    { path: 'progress-to-payout', component: ProgressToPayoutComponent, canActivate: [AuthGuard] },
    { path: 'gross-revenue', component: GrossRevenueComponent, canActivate: [AuthGuard] },
    { path: 'sales-income', component: SalesIncomeComponent, canActivate: [AuthGuard] },
    { path: 'theatrical-statistic', component: TheatricalStatisticComponent, canActivate: [AuthGuard] },
    { path: 'sales-graph', component: SalesGraphComponent, canActivate: [AuthGuard] },
    { path: 'global-sales-report', component: GlobalSalesReportComponent, canActivate: [AuthGuard] },
    { path: 'sales-distribution', component: SalesDistributionComponent, canActivate: [AuthGuard] },
    { path: 'money-paid', component: MoneyPaidComponent, canActivate: [AuthGuard] },
    { path: 'demo-simulation', component: DemoSimulationComponent, canActivate: [AuthGuard] },
    { path: 'view-status', component: ViewStatusComponent, canActivate: [AuthGuard] },
    { path: 'add-bank-account', component: AddBankAccountComponent, canActivate: [AuthGuard] },

    {
        path: 'edit-project/:id', component: EditProjectComponent, canActivate: [AuthGuard],

    },
    {
        path: 'project-details/:id', component: ProjectDetailsComponent, canActivate: [AuthGuard]
    },
    {
        path: 'manage-projects', component: ManageProjectComponent, canActivate: [AuthGuard]
    },
    {
        path: 'universal-message/:id', component: UniversalMessageComponent, canActivate: [AuthGuard]
    },
    {
        path: 'edit-cama/:id', component: EditCamaComponent, canActivate: [AuthGuard]
    },
    {
        path: 'view-cama-terms/:id', component: ViewCamaTermComponent, canActivate: [AuthGuard]
    },
    {
        path: 'support-request-detail-page/:id/:type', component: SupportRequestDetailPageComponent   , canActivate: [AuthGuard]
    },
    {
        path: 'verify-collection', component: VerifyCollectionComponent , canActivate: [AuthGuard]
    },
    {
        path: 'view-stakeholder-by-project/:id', component: ViewStakeholderByProjectComponent , canActivate: [AuthGuard]
    },
    {
        path: 'edit-cama-terms/:projectid/:camatermid', component: EditCamaTermsComponent , canActivate: [AuthGuard]
    },
    {
        path: 'money-distribution', component: EditCamaTermsComponent , canActivate: [AuthGuard]
    }
    // {
    //     path: 'stakeholders-details/:id', component: StakeholdersDetailsComponent , canActivate: [AuthGuard]
    // },
];
