import { Injectable } from "@angular/core";
import { AdminLogon } from 'src/app/bakery/common/data-models/admin-logon.model';
import { Subject } from "rxjs/Subject";

@Injectable()
export class AdminService {

    logonAdmin: AdminLogon;
    loginEventSource = new Subject<AdminLogon>();
    $loginEventStream = this.loginEventSource.asObservable();

    setLogonAdmin(logonAdmin: AdminLogon): void {
        this.logonAdmin = logonAdmin;
        this.loginEventSource.next(this.logonAdmin);
    }

    getLogonAdmin(): AdminLogon {
        return this.logonAdmin;
    }
}