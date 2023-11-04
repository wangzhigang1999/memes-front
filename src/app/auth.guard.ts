import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    try {
      // 说明已经验证过了
      if (localStorage.getItem('token-ok') === "true") {
        return true
      }else {
        // redirect to login page
        window.location.href = '/review'
        return false
      }
    }catch (e) {
      // redirect to login page
      window.location.href = '/'
      return false
    }
  }

}
