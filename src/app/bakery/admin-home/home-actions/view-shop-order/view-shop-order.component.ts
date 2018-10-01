import { AdminLogon } from 'src/app/bakery/common/data-models/admin-logon.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CustomerOrder } from "src/app/bakery/common/data-models/customer-order.model";
import { UtilService } from "src/app/bakery/common/services/utility-service";
import { ProductWrapper } from "src/app/bakery/common/data-models/product-wrapper-model";
import { AdminHomeComponentService } from 'src/app/bakery/admin-home/admin-home-component.service';

@Component({
    selector: 'view-shop-customer-order',
    templateUrl: './view-shop-order.component.html',
    styleUrls: ['./view-shop-order.component.css']
})
export class ViewShopCustomerOrderComponent implements OnInit {

    @Output() processOrderEvent = new EventEmitter<{id: number, action: string, type?: string}>();
    @Input() cusOrder: CustomerOrder;
    @Input() logonAdmin: AdminLogon;

    panelOpenState = false;
    viewId: number = -1;
    spinnerIsShowing = false;
    printProcessing = false;
    orderProducts: ProductWrapper[];
    results: any;

    constructor(public util: UtilService, private httpClient: HttpClient, private adminHomeService: AdminHomeComponentService){

    }

    ngOnInit(): void {
        
    }

    processAction(viewId: number): void {
        this.viewId = viewId;

        if (this.viewId === 1) {

            this.spinnerIsShowing = true;
            let subscription = this.httpClient.get<ProductWrapper[]>('/BAKERY/getCustomerOrderProducts/' + this.cusOrder.id).subscribe(
                (response) => {
                    this.spinnerIsShowing = false;
                    if (response) {
                        this.orderProducts = response['orderProducts'];
                        this.results = response;
                    }
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                },
                (error) => {
                    this.spinnerIsShowing = false;
                    console.log(error);
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            );

        } else  if (this.viewId === 2) {

            this.printCustomerOrderReport(this.cusOrder.id);

        }
    }


    printCustomerOrderReport(id: number) {


        let headers = new HttpHeaders();
            headers = headers.set('accept','application/pdf');
            headers = headers.set('responseType','blob');
         
            let configObj = Object.assign({'headers': headers, 'responseType': "blob"});
      
        let requestPaylod = {
              'adminID': this.logonAdmin.userIn.admin.id,
              'sessionID': this.logonAdmin.sessionID,
              'orderIDs': [{'orderID': id}]
        }

        this.printProcessing = true;
        this.adminHomeService.printCustomerOrderReport(requestPaylod, configObj).subscribe(
            response => {
             
              window.open(window.URL.createObjectURL(response));
              this.printProcessing = false;
            },
            error => {
              console.log('pdf document error', error);
              this.printProcessing = false;
            }
          )
    }


    onRemoveOrderClick(): void {

        let requestPayLoad = {
            'sessionID': this.logonAdmin.sessionID,
            'email': this.logonAdmin.userIn.admin.email,
            'orderID': this.cusOrder.id
        }

        this.spinnerIsShowing = true;
        this.httpClient.post('/BAKERY/deleteCustomerOrder',requestPayLoad).subscribe( response => {
            
            this.spinnerIsShowing = false;

            if (response['status'] == 'REMOVED') {
               
                this.processOrderEvent.emit({id: this.cusOrder.id, action: 'delete'});
            }

            alert(response['message']);
        },
        error => {
            console.log('error===>', error);
            this.spinnerIsShowing = false;
        })
    }

    markAsProsessedClick(): void {

        this.cusOrder.orderStatus = 'CLOSED'

        let requestPayLoad = {
            'sessionID': this.logonAdmin.sessionID,
            'email': this.logonAdmin.userIn.admin.email,
            'order': this.cusOrder
        }

        this.spinnerIsShowing = true;
        this.httpClient.post('/BAKERY/updateCustomerOrder',requestPayLoad).subscribe( response => {

            this.spinnerIsShowing = false;

            if (response['status'] == 'UPDATED') {
                this.processOrderEvent.emit({id: this.cusOrder.id, action: 'update'});
            }
        },
        error => {
            this.spinnerIsShowing = false;
            console.log('error===>', error);
        })

    }

}