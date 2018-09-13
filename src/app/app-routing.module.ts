import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from 'src/app/bakery/admin-login/admin-login.component';
import { OpenAdminAccountComponent } from 'src/app/bakery/open-admin-account/open-admin-account.component';
import { AdminHomeComponent } from 'src/app/bakery/admin-home/admin-home.component';

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
    component: AdminHomeComponent
  }
  // ,
  // {
  //   path: 'products-category/:categoryName',
  //   component: CategoryPageComponent
  // },
  // {
  //   path: 'specials',
  //   component: SpecialsPageComponent
  // },
  // {
  //   path: 'shopping-bascket',
  //   component: ShoppingBusketComponent
  // },
  // {
  //   path: 'manage-profile',
  //   component: UserManageProfileComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
