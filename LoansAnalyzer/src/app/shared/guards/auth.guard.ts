import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {SecurityService} from "../security/security.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private securityService: SecurityService,
    private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let claimType: string = route.data["claimType"];
    let auth = localStorage.getItem("AuthObject");

    if(auth){
      Object.assign(this.securityService.securityObject, JSON.parse(auth));
    }

    let isAuthenticated = this.securityService.securityObject.isAuthenticated;
    let canAccess = this.securityService.securityObject.getPropertyValue(this.securityService.securityObject, claimType);

    if(isAuthenticated && canAccess){
      return true;
    }
    else{
      this.router.navigate(['login-page'],{queryParams: {returnUrl: state.url}})
      return false;
    }
  }

}
