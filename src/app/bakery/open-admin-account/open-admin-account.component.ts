import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Administrator } from 'src/app/bakery/common/data-models/administrator.model';
import { AdminWrapper } from 'src/app/bakery/common/data-models/admin-wrapper.model';
import { AdminService } from 'src/app/bakery/common/services/admin.service';
import { Router } from '@angular/router';
import { CustomValidations } from 'src/app/bakery/common/services/custom-validations';
import { SpinnerService } from 'src/app/bakery/common/service-spinner/spinner-service';

@Component({
  selector: 'app-open-admin-account',
  templateUrl: './open-admin-account.component.html',
  styleUrls: ['./open-admin-account.component.css']
})
export class OpenAdminAccountComponent implements OnInit {

  registerForm: FormGroup;
  image: any;
  showErrors = false;
  dropdownIsOpen = false;
  formErrors = {
    accountPhoto: {
      required: 'Please select a photo for your profile'
    },
    firstname: {
      required: 'First name is required',
      pattern: 'First name is invalid'
    },
    lastname: {
      required: 'Last name is required',
      pattern: 'Last name is invalid'
    },
    email: {
      required: 'Email is required field',
      pattern: 'Please enter a valid email address',
      invalidEmailDomain: 'Unkown email domain'
    },
    password: {
      required: 'Password is required field',
      minlength: 'Password must be a minimun of 7 characters long'
    },
    confirmPassword: {
      required: 'Confirm password is required',
      minlength: 'Confirm password must be a minimun of 7 characters long',
      notMatching: 'Confirm password is not the same as password'
    },
    ssacode: {
      required: 'System security access code is required'
    }
  };

  formControlErrorMessage = {
    email: '',
    password: '',
    showErrors: false
  };
  passwordStatus: string;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient,
              private adminService: AdminService, private router: Router, private spinner: SpinnerService) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      accountPhoto: ['', [Validators.required]],
      firstname: ['', [Validators.required, Validators.pattern(/^(?![ ]+$)[a-zA-Z ]+$/)]],
      lastname: ['', [Validators.required, Validators.pattern(/^(?![ ]+$)[a-zA-Z ]+$/)]],
      email: ['', [CustomValidations.isValidEmailDomain, Validators.required, Validators.maxLength(50), Validators.pattern(/^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      ssacode: ['', [Validators.required]]
    })

    this.registerForm.addControl('confirmPassword', new FormControl('', {
      validators: [Validators.required, this.validatePassword()],
      updateOn: 'change'
    }));

    this.registerForm.controls['password'].valueChanges.subscribe((controlValue: string) => {
      const control = this.registerForm.controls['confirmPassword'];

      if (control.value) {
        control.updateValueAndValidity();
      }
      this.passwordStatus = this.testStrongness(controlValue);
    });

    this.registerForm.controls['confirmPassword'].valueChanges.subscribe((controlValue) => {
      this.testStrongness(controlValue);
    });

    this.registerForm.valueChanges.subscribe(() => { this.onSubmit(); });

  }

  validatePassword() {
    return (control: AbstractControl) => {
      const confirmPassword = control.value;
      const password = this.registerForm.controls['password'].value;

      if (confirmPassword !== password) {
        return { notMatching: false };
      }

    }
  }

  testStrongness(controlValue: string): string {

    const strongness = ['Weak', 'Medium', 'Strong']
    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasSpecialCase = false;

    let testCounter = -1;

    if (controlValue) {
      // Check for upper case
      for (let x = 0; x < controlValue.length; x++) {
        const code = controlValue.charCodeAt(x);

        if (!hasUpperCase && (code >= 65 && code <= 90)) {
          hasUpperCase = true;
          testCounter++;
        }

        if (!hasLowerCase && (code >= 97 && code <= 121)) {
          hasLowerCase = true;
          testCounter++;
        }

        if (!hasSpecialCase && !(code >= 97 && code <= 121) && !(code >= 65 && code <= 90)) {
          hasSpecialCase = true;
          testCounter++;
        }

        if (testCounter === 3) {
          break;
        }
      }

    }

    return strongness[testCounter];
  }

  onSubmit(): void {
    const form = this.registerForm;
    const formControls = this.registerForm.controls;

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
    console.log('sadsdsdsdad', event);

    let fileLocation = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsDataURL(fileLocation)

    fileReader.onloadstart = function (ev) {
      console.log('started', ev)
    }.bind(this)

    fileReader.onprogress = function (ev) {
      console.log('progress', ev)
    }.bind(this)

    fileReader.onloadend = function (ev) {
      this.image = fileReader.result;
      this.registerForm.controls['accountPhoto'].setValue(this.image);

      console.log('done', ev)
    }.bind(this)
    console.log('st')

  }

  onRegisterClick(): void {

    this.showErrors = true;
    this.onSubmit();
    if (this.registerForm.valid) {

      let requestPayload = new AdminWrapper({
        'admin': new Administrator({
          'firstname': this.registerForm.get('firstname').value,
          'lastname': this.registerForm.get('lastname').value,
          'email': this.registerForm.get('email').value,
          'password': this.registerForm.get('password').value,
        }),
        'encodedAdminImage': this.image,
      })

      // this.spinner.showSpinner();
      this.httpClient.post('/BAKERY/admin/register/' + this.registerForm.get('ssacode').value, requestPayload).subscribe(
        response => {
          // this.spinner.hideSpinner();
          if (response) {
            if (response['status'] == 'CREATED') {

              this.adminService.setLogonAdmin(response['loginResponse']);
              this.router.navigate(['admin-home']);

            } else if (response['status'] == 'FAILED') {

            } else if (response['status'] == 'CONFLICT') {

            }
          }

          console.log('************** >>>>>>',response);
        },
        error => {
          // this.spinner.hideSpinner();
          console.log('************** >>>>>>',error);
        }
      );

    }
  }

}
