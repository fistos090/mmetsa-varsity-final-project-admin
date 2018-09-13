import { HttpClient } from '@angular/common/http';
import { AdminLogon } from './../common/data-models/admin-logon.model';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/bakery/common/services/admin.service';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/bakery/common/service-spinner/spinner-service';

@Component({
  selector: 'app-admin-top-nav',
  templateUrl: './admin-top-nav.component.html',
  styleUrls: ['./admin-top-nav.component.css']
})
export class AdminTopNavComponent implements OnInit {

  logonAdmin: AdminLogon;
  logonUserName: string;

  constructor(private adminService: AdminService, private router: Router, private httpClient: HttpClient, private spinner: SpinnerService ) {
    this.adminService.$loginEventStream.subscribe((logonAdmin:AdminLogon) => {
      this.logonAdmin = logonAdmin;

      if (this.logonAdmin) {
        this.logonUserName = this.logonAdmin.userIn.admin.lastname+' '+this.logonAdmin.userIn.admin.firstname
      } else {
        this.logonUserName = undefined;
      }
    });
  }

  ngOnInit() {

  }

  logout(){
    // this.spinner.showSpinner();
    this.httpClient.get('/BAKERY/admin/logout/'+this.logonAdmin.sessionID+'/'+this.logonAdmin.userIn.admin.id).subscribe(
      response => {
        // this.spinner.hideSpinner();
        if (response['status'] == 'OK') {
          alert('You have successfully logout');
          this.adminService.setLogonAdmin(null);
          this.router.navigate(['admin-login']);
        } else {
          alert('We couldn\'t not log you out');
        }
      },
      error => {
        // this.spinner.hideSpinner();
      }
    )
  }

  loadHome(): void {
    this.router.navigate(['admin-home']);
  }

}
