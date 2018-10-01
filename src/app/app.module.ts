import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceSpinnerComponent } from 'src/app/bakery/common/service-spinner/service-spinner.component';
import { InputFieldComponent } from 'src/app/bakery/common/form-controls/input-field/input-field.component';
import { DropdownListComponent } from 'src/app/bakery/common/form-controls/dropdown-list/dropdown-list.component';
import { DobDatePickerComponent } from 'src/app/bakery/common/form-controls/dob-date-picker/dob-date-picker.component';
import { RadioGroupComponent } from 'src/app/bakery/common/form-controls/radio-group/radio-group.component';
import { AdminLoginComponent } from './bakery/admin-login/admin-login.component';
import { AppAngularMaterialModule } from 'src/app/bakery/common/app-angular-material.module.1';
import { OpenAdminAccountComponent } from './bakery/open-admin-account/open-admin-account.component';
import { AdminService } from 'src/app/bakery/common/services/admin.service';
import { AdminHomeComponent } from 'src/app/bakery/admin-home/admin-home.component';
import { AdminTopNavComponent } from './bakery/admin-top-nav/admin-top-nav.component';
import { SpinnerService } from 'src/app/bakery/common/service-spinner/spinner-service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AddProductComponent } from 'src/app/bakery/admin-home/home-actions/add-product-form/add-product-form.componet';
import { ViewShopProductComponent } from 'src/app/bakery/admin-home/home-actions/view-shop-product/view-shop-product.component';
import { ViewShopCustomerOrderComponent } from 'src/app/bakery/admin-home/home-actions/view-shop-order/view-shop-order.component';
import { UtilService } from 'src/app/bakery/common/services/utility-service';
import { TabsMenuComponent } from 'src/app/bakery/common/tabs-menu/tabs-menu.component';
import { TabPanelComponent } from 'src/app/bakery/common/tabs-menu/tab-panel/tab-panel.component';
import { CustomerDetailsComponent } from './bakery/admin-home/home-actions/customer-details/customer-details.component';

@NgModule({
  declarations: [
    AppComponent,
    ServiceSpinnerComponent,
    
    DropdownListComponent,
    DobDatePickerComponent,
    InputFieldComponent,
    RadioGroupComponent,
    AdminLoginComponent,
    OpenAdminAccountComponent,
    AdminHomeComponent,
    AdminTopNavComponent,
    AddProductComponent,
    ViewShopProductComponent,
    ViewShopCustomerOrderComponent,
    TabsMenuComponent,
    TabPanelComponent,
    CustomerDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppAngularMaterialModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    ServiceSpinnerComponent
  ],
  providers: [AdminService, SpinnerService, UtilService],
  bootstrap: [AppComponent]
})
export class AppModule { }
