import { ProductWrapper } from './../common/data-models/product-wrapper-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpinnerService } from 'src/app/bakery/common/service-spinner/spinner-service';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/bakery/common/services/admin.service';
import { Subject } from 'rxjs/Subject';
import { Tab } from 'src/app/bakery/common/tabs-menu/tabs-menu.model';
import { CustomerOrder } from 'src/app/bakery/common/data-models/customer-order.model';
import { AdminLogon } from 'src/app/bakery/common/data-models/admin-logon.model';
import { Customer } from '../common/data-models/customer.model';
import { AdminHomeComponentService } from './admin-home-component.service';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css'],
    providers: [AdminHomeComponentService]
})
export class AdminHomeComponent implements OnInit {

    navItems = [{ id: 'id1', status: false }, { id: 'id2', status: false }, { id: 'id3', status: false }];
    


    isCHP = false;
    isAllOrders = true;
    isAddNewProduct = false;
    isAllShopProducts = false;
    isAllRegisteredCustomer = false;

    orderRequestIsReady = true;

    products = [];
    formOpenningEvent = new Subject<number>();
    openFormId = -1;
    logonAdmin: AdminLogon;
    selectedTabIndex = 0;
   
    tabs = [
        new Tab({
          tabId: 0,
          tabTitle: 'Unprocessed orders'
        }),
        new Tab({
          tabId: 1,
          tabTitle: 'Processed orders'
        }),
    ];

    openOrders: CustomerOrder[];
    closedOrders: CustomerOrder[];
    shopCustomers: Customer[];

    ordersIds = [];

    constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private adminService: AdminService,
        private router: Router, private spinner: SpinnerService,private adminHomeService: AdminHomeComponentService) {
            this.formOpenningEvent.subscribe(openFormId => {
                this.openFormId = openFormId;
            })
    }

    ngOnInit(): void {
        this.processAction('isAllShopProducts');
        this.navItems[0].status = true;
        this.logonAdmin = this.adminService.getLogonAdmin();

    }

    onTabChange(tabId: number): void {
       
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

        this.orderRequestIsReady = false;
        this.openOrders = [];
        this.closedOrders = [];
        this.products = [];


        switch (action) {
            case 'isCHP':
                break;
            case 'isAllOrders':

            let subscription = this.httpClient.get('/BAKERY/displayAllOrders/' + this.logonAdmin.sessionID+'/'+this.logonAdmin.userIn.admin.id).subscribe(
                (response) => {

                    if (response) {
                        response['allOrders'];
                        console.log('response[\'customerOrders\']', response['allOrders']);
                        this.orderRequestIsReady = true;

                        let orders = response['allOrders'];
                     
                        if (orders) {
                            orders.forEach((order: CustomerOrder) => {
                                if (order.orderStatus == 'OPEN') {

                                    this.openOrders.push(order);
                                    

                                } else {

                                    this.closedOrders.push(order);
                                    
                                }
                            });
                        }
                    }
                    // this.spinner.hideSpinner();
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                    
                },
                (error) => {
                    console.log(error);
                    // this.spinner.hideSpinner();
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            );

                break;
            case 'isAddNewProduct':
                // this.openAddProductForm();
                break;
            case 'isAllShopProducts':
            this.openFormId = -1;
            this.httpClient.get<ProductWrapper>('/BAKERY/displayAllProducts').subscribe(
                response => {
                  
                    this.products = response['products'];
                    window.scroll(0,0);
                },
                error => {
                    console.log('************** >>>>>>', error);
                }
            );

                break;
            case 'isAllRegisteredCustomer':

            this.httpClient.get<ProductWrapper>('/BAKERY/getAllRegisteredCustomers/'+this.logonAdmin.sessionID+'/'+this.logonAdmin.userIn.admin.id).subscribe(
                response => {
                    if ( response['status'] == 'FETCHED') {
                        this.shopCustomers = response['customers'];
                    }
                },
                error => {
                    console.log('************** >>>>>>', error);
                }
            );

                break;

        }
    }

    processOrderEventHandler(eventData: any): void {
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^',eventData);
        if ('update' === eventData['action']) {
            const index = this.openOrders.findIndex( (order) => {
            
                if (order.id === eventData['id']) {
                   
                        if (order) {
                            order.orderStatus = 'CLOSED';
                        }
                        if (this.closedOrders) {
                            this.closedOrders.push(order);
                        }
                        this.selectedTabIndex = 1;
                    return true;
                }
    
                return false;
            });
    
            this.openOrders.splice(index,1);

        } else if ('print' === eventData['action']) {
            
          

        } else {
            const index = this.closedOrders.findIndex( order => order.id === eventData['id']);
            this.closedOrders.splice(index,1);
        }
 
    }

    printCustomerOrderReport(type: string){

        const orders = type === 'open_orders' ? this.openOrders : this.closedOrders;
        this.ordersIds = [];

        orders.forEach( order => {
            this.ordersIds.push({
                'orderID': order.id
            });
        })

        let headers = new HttpHeaders();
            headers = headers.set('accept','application/pdf');
            headers = headers.set('responseType','blob');
         
            let configObj = Object.assign({'headers': headers, 'responseType': "blob"});
      
        let requestPaylod = {
              'adminID': this.logonAdmin.userIn.admin.id,
              'sessionID': this.logonAdmin.sessionID,
              'orderIDs': this.ordersIds
        }

        this.adminHomeService.printCustomerOrderReport(requestPaylod, configObj).subscribe(
            response => {
              this.ordersIds = [];
              window.open(window.URL.createObjectURL(response));
              
            },
            error => {
              console.log('pdf document error', error);
              this.ordersIds = [];
            }
          )
    }

    printCustomerLoginTrackReport(){


        let headers = new HttpHeaders();
            headers = headers.set('accept','application/pdf');
            headers = headers.set('responseType','blob');
         
            let configObj = Object.assign({'headers': headers, 'responseType': "blob"});
      
        let requestPaylod = {
            'adminID': this.logonAdmin.userIn.admin.id,
            'sessionID': this.logonAdmin.sessionID
        }

        this.httpClient.post('/BAKERY/printCustomerLoginTrackReport',requestPaylod, configObj).subscribe(
            response => {
            
              window.open(window.URL.createObjectURL(response));
              
            },
            error => {
              console.log('pdf document error', error);

            }
          )
    }


}