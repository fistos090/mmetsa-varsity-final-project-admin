import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from 'src/app/bakery/admin-login/admin-login.component';
import { OpenAdminAccountComponent } from 'src/app/bakery/open-admin-account/open-admin-account.component';
import { AdminHomeComponent } from 'src/app/bakery/admin-home/admin-home.component';
import { AuthGuard } from 'src/app/bakery/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin-login',
    pathMatch: 'full'
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent
  }
  ,
  {
    path: 'open-admin-account',
    component: OpenAdminAccountComponent
  },
  {
    path: 'admin-home',
    canActivate: [AuthGuard],
    component: AdminHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
