import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AdminService } from "../common/services/admin.service";
import { SpinnerService } from "../common/service-spinner/spinner-service";
import { Router } from "@angular/router";

@Injectable()
export class AdminHomeComponentService{

    constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private adminService: AdminService,
        private router: Router, private spinner: SpinnerService) {
       
    }

    printCustomerOrderReport(requestPaylod: any, configObj: any): any {

        return this.httpClient.post<Blob>('/BAKERY/printCustomerOrderReport', requestPaylod, configObj );
    
    }

}