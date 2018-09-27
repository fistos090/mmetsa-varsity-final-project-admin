import { AdminService } from 'src/app/bakery/common/services/admin.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private adminService: AdminService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth();
  }

  checkAuth(): boolean{

    if (this.adminService.getLogonAdmin() !== undefined) {
      return true;
    }

    this.router.navigate(['/admin-login']);
    return false;
  }
}
