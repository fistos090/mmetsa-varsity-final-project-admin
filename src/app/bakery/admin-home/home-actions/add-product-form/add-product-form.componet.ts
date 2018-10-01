import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { SpinnerService } from "src/app/bakery/common/service-spinner/spinner-service";
import { HttpClient } from "@angular/common/http";
import { AdminService } from "src/app/bakery/common/services/admin.service";
import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CustomValidations } from "src/app/bakery/common/services/custom-validations";
import { Product } from "src/app/bakery/common/data-models/product.model";

@Component({
    selector: 'add-product-form',
    templateUrl: './add-product-form.componet.html',
    styleUrls: ['./add-product-form.componet.css']
})

export class AddProductComponent implements OnInit {

    @Input() product: Product;
    @Input() updateDetails = false;
    @Input() originatorId = 1;
    @Output() outActionEvent = new EventEmitter<any>();

    image: any;
    imageErrorMessage = '';
    addProductForm: FormGroup;
    showErrors = false;
    isShowingAddForm = true;
    loadImage = false;
    
    formErrors = {
        productName: {
            required: 'Product name is required',
            pattern: 'Provide a valid product name'
        },
        category: {
            required: 'Category is required',
        },
        productDesc: {
            required: 'Product description is required',
            pattern: 'Only letters are allowed in field'
        },
        price: {
            required: 'Please provide product price',
            pattern: 'only numbers are allowed',
            isValidDecimalNumber: 'Invalid price surfix. Put two number after the comma'
        },
        quantity: {
            required: 'Provide number of products to add',
            pattern: 'only numbers are allowed'
        },
        productImage: {
            required: 'Product picture must be uploaded'
        }
    };

    formControlErrorMessage = {
        productName: '',
        category: '',
        productDesc: '',
        price: '',
        quantity: '',
        productImage: '',
        showErrors: false
    };
    constructor(private formBuilder: FormBuilder, private httpClient: HttpClient,
                private adminService: AdminService,
                private router: Router, private spinner: SpinnerService) {

    }

    ngOnInit(): void {
        this.addProductForm = this.formBuilder.group({
            id: [],
            productName: ['', [Validators.required, Validators.pattern(/^(?![ ]+$)[a-zA-Z ]+$/)]],
            category: ['', [Validators.required]],
            productDesc: ['', [Validators.required, Validators.pattern(/^(?![ ]+$)[a-zA-Z ]+$/)]],
            price: ['', [Validators.required, Validators.pattern(/^[0-9]+\.[0-9]+$/)]],
            quantity: ['', [Validators.required, Validators.pattern(/^(?![ ]+$)[0-9]+$/)]],
            productImage: ['', [Validators.required]]
        });
        this.addProductForm.statusChanges.subscribe(val => {
            this.onSubmit();
        });

        if ( this.product ){
            this.addProductForm.patchValue(this.product);
        }
        // CustomValidations.isValidDecimalNumber
    }

    onSubmit(): void {
        const form = this.addProductForm;
        const formControls = this.addProductForm.controls;

        for (const control in formControls) {
            if (form.controls[control].invalid) {
                for (const errorKey in form.controls[control].errors) {
                    if (!this.formControlErrorMessage[control] ||
                        this.formControlErrorMessage[control] !== this.formErrors[control][errorKey]) {

                        this.formControlErrorMessage[control] = this.formErrors[control][errorKey];
                    }
                }

            }
        }

    }

    uploadImage(event): void {

        let fileLocation = event.target.files[0];

        let fileReader = new FileReader();
        fileReader.readAsDataURL(fileLocation)

        fileReader.onloadstart = function (ev) {
            console.log('started', ev)
            this.loadImage = true;
        }.bind(this)

        fileReader.onprogress = function (ev) {
            console.log('progress', ev)
        }.bind(this)

        fileReader.onloadend = function (ev) {
            this.image = fileReader.result;
            this.addProductForm.controls['productImage'].setValue(this.image);
            if (this.addProductForm.controls['productImage'].valid) {
                this.formControlErrorMessage['productImage'] = undefined;
            }
            this.loadImage = false;

        }.bind(this)

    }

    addingProduct = false;

    onAddProductClick() {
        this.showErrors = true;
        this.onSubmit();
        if (this.addProductForm.valid) {
            this.product = this.addProductForm.value;

            let requestData = {
                'sessionID': this.adminService.logonAdmin.sessionID,
                'adminID': this.adminService.logonAdmin.userIn.admin.id,
                'product': this.product
            }

            this.addingProduct = true;
            this.httpClient.post('/BAKERY/loadNewProduct', requestData).subscribe(
                response => {

                    this.isShowingAddForm = false;
                    this.updateDetails = false;
                    this.addingProduct = false;

                    if (response['status'] == 'CREATED') {
                        this.image = undefined;
                        this.showErrors = false;
                        this.addProductForm.reset();
                        this.product.id = response['product_id'];
                    }

                    alert(response['message'])
                    console.log('*********', response);

                    if (this.originatorId == 2) {
                        this.outActionEvent.emit({'action': 'update','product': this.product});
                    }
                },
                error => {
                    // alert(error['message'])
                    console.log('*********', error);
                    this.addingProduct = false;
                }
            );
        }

    }

    editProduct(): void {
        this.isShowingAddForm = true;
        this.updateDetails = true;
        this.addProductForm.patchValue(this.product);
    }

    addAnotherProduct(): void {
        this.isShowingAddForm = true;
        setTimeout(() => {
            this.addProductForm.controls['category'].setValue('Select product category');
        },0);
    }

    done(): void {
        if (this.originatorId == 2) {
            this.outActionEvent.emit({'action': 'close'});
        }
    }
}