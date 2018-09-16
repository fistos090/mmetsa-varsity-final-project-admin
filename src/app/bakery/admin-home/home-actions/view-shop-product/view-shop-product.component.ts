import { ProductWrapper } from './../../../common/data-models/product-wrapper-model';
import { OnInit, Component, Input } from "@angular/core";
import { Subject } from 'rxjs/Subject';

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

    editDetailsStatus = false;
    

    constructor () {

    }

    ngOnInit(): void {
        
    }

    editProductDetails(): void{
        this.productWrapper.product.productImage = this.productWrapper.productImage;
        this.editDetailsStatus = !this.editDetailsStatus;
        this.formOpenningEvent.next(this.editDetailsStatus ? this.itemId : -1);
    }

    processChildEvent(event): void {
        switch(event['action']){
            case 'update':
            this.productWrapper['productImage'] = event['product']['productImage']
            this.productWrapper['product'] = event['product'];
            break;
            case 'close':
            this.editDetailsStatus = false;
            break;
            case '':
            break;
        }
    }

}