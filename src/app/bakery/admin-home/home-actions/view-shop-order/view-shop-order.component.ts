import { Component, OnInit, Input } from "@angular/core";
import { CustomerOrder } from "src/app/bakery/common/data-models/customer-order.model";

@Component({
    selector: 'view-shop-customer-order',
    templateUrl: './view-shop-order.component.html',
    styleUrls: ['./view-shop-order.component.css']
})
export class ViewShopCustomerOrderComponent implements OnInit {

    @Input() customerOrder: CustomerOrder;

    panelOpenState = false;
    
    constructor(){

    }

    ngOnInit(): void {
        
    }

}