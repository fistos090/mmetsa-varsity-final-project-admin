import { ProductWrapper } from './../../../common/data-models/product-wrapper-model';
import { OnInit, Component, Input, EventEmitter, Output } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { AdminService } from 'src/app/bakery/common/services/admin.service';
import { SpinnerService } from 'src/app/bakery/common/service-spinner/spinner-service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'view-shop-product',
    templateUrl: './view-shop-product.component.html',
    styleUrls: ['./view-shop-product.component.css']
})

export class ViewShopProductComponent implements OnInit {

    @Input() productWrapper: ProductWrapper;
    @Input() formOpenningEvent: Subject<number>;
    @Input() itemId: number;
    @Input() openFormId: number;
    @Output() removeProductEvent = new EventEmitter<number>()

    removeDetailsStatus = false;
    editDetailsStatus = false;
    

    constructor (private httpClient: HttpClient, private adminService: AdminService, private spinner: SpinnerService) {

    }

    ngOnInit(): void {
        
    }

    editProductDetails(): void{
        this.removeDetailsStatus = false;
        this.productWrapper.product.productImage = this.productWrapper.productImage;
        this.editDetailsStatus = !this.editDetailsStatus;
        this.formOpenningEvent.next(this.editDetailsStatus ? this.itemId : -1);
    }

    openRemoveProductConfirmation(){
        this.editDetailsStatus = false;
        this.removeDetailsStatus = !this.removeDetailsStatus;
        this.formOpenningEvent.next(this.removeDetailsStatus ? this.itemId : -1);
    }

    processChildEvent(event): void {
        switch(event['action']){
            case 'update':
            this.productWrapper['productImage'] = event['product']['productImage']
            this.productWrapper['product'] = event['product'];
            break;
            case 'close':
            this. editProductDetails();
            break;
            case '':
            break;
        }
    }

    onRemoveProductClick(productID: number): void {

        const requestPayload = {
            'adminID':  this.adminService.getLogonAdmin().userIn.admin.id,
            'productID': productID,
            'sessionID': this.adminService.getLogonAdmin().sessionID
        }
        
        this.httpClient.post('/BAKERY/removeProduct',requestPayload).subscribe(
            response => {

                if (response['status'] == 'REMOVED') {
                    this.removeProductEvent.emit(this.itemId);
                }

                alert(response['message'])
                console.log('*********', response);
            },
            error => {
                // alert(error['message'])
                console.log('*********', error);
            }
        );
    }
    

}