import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Administrator } from 'src/app/bakery/common/data-models/administrator.model';
import { HttpClient } from '@angular/common/http';
import { AdminLogon } from 'src/app/bakery/common/data-models/admin-logon.model';
import { AdminService } from 'src/app/bakery/common/services/admin.service';
import { Router } from '@angular/router';
import { CustomValidations } from 'src/app/bakery/common/services/custom-validations';
import { SpinnerService } from 'src/app/bakery/common/service-spinner/spinner-service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  loginForm: FormGroup;
  showErrors = false;
  dropdownIsOpen = false;
  formErrors = {
    email: {
      required: 'Email is required field',
      pattern: 'Please enter a valid email address',
      invalidEmailDomain: 'Unkown email domain'
    },
    password: {
      required: 'Password is required field',
      minlength: 'Password must be a minimun of 7 characters long'
    }
  };

  formControlErrorMessage = {
    email: '',
    password: '',
    showErrors: false
  };

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, 
              private adminService: AdminService, private router: Router, private spinner: SpinnerService) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      email: ['',[CustomValidations.isValidEmailDomain, Validators.required, Validators.maxLength(50), Validators.pattern(/^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      password: ['',[Validators.required, Validators.minLength(7)]]
    });

    this.loginForm.valueChanges.subscribe(() => { this.onSubmit(); });
  }

  onLoginClick(): void {
    this.showErrors = true;
    this.onSubmit();
    if (this.loginForm.valid) {
      // this.spinner.showSpinner();
      this.httpClient.post<AdminLogon>('/BAKERY/admin/login', this.loginForm.value).subscribe(
        response => {
          // this.spinner.hideSpinner();
          if (response) {
            if (response.status == 'FOUND') {

              this.adminService.setLogonAdmin(response);
              this.router.navigate(['admin-home']);
              alert(response['message']);

            } else if (response.status == 'NOT_FOUND') {
              alert(response['message']);
            }
          }
          console.log('************** >>>>>>', response);
        },
        error => {
          // this.spinner.hideSpinner();
          console.log('************** >>>>>>', error);
        }
      );

    }
  }

  onSubmit(): void {
    const form = this.loginForm;
    const formControls = this.loginForm.controls;

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

}
