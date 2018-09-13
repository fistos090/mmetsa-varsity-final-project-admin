import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from 'src/app/bakery/common/service-spinner/spinner-service';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/bakery/common/services/admin.service';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

    navItems = [{ id: 'id1', status: false }, { id: 'id2', status: false }, { id: 'id3', status: false }];
    addProductForm: FormGroup;
    image: any;
    imageErrorMessage = '';

    showErrors = false;
    formErrors = {
        productName: {
            required:'Product name is required'
        },
        category: {
            required:'Category is required'
        },
        productDesc: {
            required:'Product description is required'
        },
        price: {
            required:'Please provide product price'
        },
        quantity: {
            required:'Provide number of products to add'
        },
        prodImage: {
            required:'Product picture must be uploaded'
        }
    };
  
    formControlErrorMessage = {
        productName: '',
        category: '',
        productDesc: '',
        price: '',
        quantity: '',
        prodImage: '',
        showErrors: false
    };

    constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private adminService: AdminService,
        private router: Router, private spinner: SpinnerService) {

    }

    ngOnInit(): void {
        this.openAddProductForm();
    }

    expandNavItem(id: string) {
        this.navItems.forEach(navItem => {
            if (navItem.id === id) {
                navItem.status = !navItem.status;
            }
        })
    }

    openAddProductForm() {
        this.addProductForm = this.formBuilder.group({
            productName: ['', [Validators.required]],
            category: ['', [Validators.required]],
            productDesc: ['', [Validators.required]],
            price: ['', [Validators.required]],
            quantity: ['', [Validators.required]],
            prodImage: ['', [Validators.required]]
        })
    }

    onSubmit(): void {
        const form = this.addProductForm;
        const formControls = this.addProductForm.controls;
    
        for (const control in formControls) {
          if (form.controls[control].invalid) {
            for (const errorKey in form.controls[control].errors) {
              if (!this.formControlErrorMessage[control] ||
                this.formControlErrorMessage[control] !== this.formErrors[control][errorKey]) {
                console.log(errorKey + ' ' + this.formErrors[control][errorKey])
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

        fileReader.onloadstart = function(ev) {
            console.log('started', ev)
        }.bind(this)

        fileReader.onprogress = function(ev) {
            console.log('progress', ev)
        }.bind(this)

        fileReader.onloadend = function(ev) {
            this.image = fileReader.result;
            this.addProductForm.controls['prodImage'].setValue(this.image);
        }.bind(this)

    }

    onAddProductClick() {
        this.onSubmit();
        if (this.addProductForm.valid) {

            let requestData = {
                'sessionID': this.adminService.logonAdmin.sessionID,
                'adminID': this.adminService.logonAdmin.userIn.admin.id,
                'product': this.addProductForm.value
            }
            this.httpClient.post('/BAKERY/loadNewProduct', requestData).subscribe(
                response => {
                    this.addProductForm.patchValue(undefined);
                    alert(response['message'])
                    console.log('*********',response);
                },
                error => {
                    alert(error['message'])
                    console.log('*********',error);
                }
            );
        }

    }
}