import { ChangePasswordComponent } from './../_web/login/change-password/change-password.component';
import { ForgotPasswordComponent } from './../_web/login/forgot-password/forgot-password.component';
import { SHELL_ROUTES } from './../shell/routing';
import { LoginComponent } from './../_web/login/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { ShellComponent } from '../shell/shell.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  {
    path: '',
    component: ShellComponent,
    children: SHELL_ROUTES
  }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// http://localhost:4200/#/change-password?token=a8a77d6dacbd029cf156c1648fb9e9d9