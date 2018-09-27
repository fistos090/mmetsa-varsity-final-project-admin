import { AdminLogon } from 'src/app/bakery/common/data-models/admin-logon.model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CustomerOrder } from "src/app/bakery/common/data-models/customer-order.model";
import { UtilService } from "src/app/bakery/common/services/utility-service";
import { ProductWrapper } from "src/app/bakery/common/data-models/product-wrapper-model";

@Component({
    selector: 'view-shop-customer-order',
    templateUrl: './view-shop-order.component.html',
    styleUrls: ['./view-shop-order.component.css']
})
export class ViewShopCustomerOrderComponent implements OnInit {

    @Output() processOrderEvent = new EventEmitter<{id: number, action: string}>();
    @Input() cusOrder: CustomerOrder;
    @Input() logonAdmin: AdminLogon;

    panelOpenState = false;
    viewId: number = -1;
    spinnerIsShowing = false;
    orderProducts: ProductWrapper[];
    results: any;
    
    constructor(public util: UtilService, private httpClient: HttpClient){

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

        }
    }

    onRemoveOrderClick(): void {

        let requestPayLoad = {
            'sessionID': this.logonAdmin.sessionID,
            'email': this.logonAdmin.userIn.admin.email,
            // 'adminID': this.logonAdmin.userIn.admin.id,
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

        let requestPayLoad = {
            'sessionID': this.logonAdmin.sessionID,
            'email': this.logonAdmin.userIn.admin.email,
            // 'adminID': this.logonAdmin.userIn.admin.id,
            'order': this.cusOrder.orderStatus = 'CLOSED'
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