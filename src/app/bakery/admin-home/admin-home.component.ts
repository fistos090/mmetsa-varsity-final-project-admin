import { ProductWrapper } from './../common/data-models/product-wrapper-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from 'src/app/bakery/common/service-spinner/spinner-service';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/bakery/common/services/admin.service';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

    navItems = [{ id: 'id1', status: false }, { id: 'id2', status: false }, { id: 'id3', status: false }];
    


    isCHP = false;
    isAllOrders = true;
    isAddNewProduct = false;
    isAllShopProducts = false;
    isAllRegisteredCustomer = false;

    products = [];
    formOpenningEvent = new Subject<number>();
    openFormId = -1;

    constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private adminService: AdminService,
        private router: Router, private spinner: SpinnerService) {
            this.formOpenningEvent.subscribe(openFormId => {
                this.openFormId = openFormId;
            })
    }

    ngOnInit(): void {
        this.processAction('isCHP');
        this.navItems[0].status = true;

    }

    expandNavItem(id: string) {
        this.navItems.forEach(navItem => {
            if (navItem.id === id) {
                navItem.status = !navItem.status;
            }
        })
    }

    removeProduct(productIndex: number){
        if (this.products) {
            this.products.splice(productIndex,1);
            this.openFormId = -1;
        }
    }

    processAction(action: string): void {

        this.isCHP = action === 'isCHP';
        this.isAllOrders = action === 'isAllOrders';
        this.isAddNewProduct = action === 'isAddNewProduct';
        this.isAllShopProducts = action === 'isAllShopProducts';
        this.isAllRegisteredCustomer = action === 'isAllRegisteredCustomer';

        switch (action) {
            case 'isCHP':
                break;
            case 'isAllOrders':
                break;
            case 'isAddNewProduct':
                // this.openAddProductForm();
                break;
            case 'isAllShopProducts':
            this.openFormId = -1;
            this.httpClient.get<ProductWrapper>('/BAKERY/displayAllProducts').subscribe(
                response => {
                    console.log('************** >>>>>>', response);
                    this.products = response['products'];
                    window.scroll(0,0);
                },
                error => {
                    console.log('************** >>>>>>', error);
                }
            )
                break;
            case 'isAllRegisteredCustomer':
                break;

        }
    }


}