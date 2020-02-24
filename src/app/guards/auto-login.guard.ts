import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { take, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanActivate {
  
   constructor(private api: ApiService, private router: Router) {

   }
   users = [];
   loadData(refresh = false, refresher?) {
    this.api.getUsers(refresh).subscribe(res => {
        this.users = res;
        if (refresher) {
          refresher.target.complete();
        }
      });
    }

  canActivate(): Observable<boolean> {
    return this.api.user.pipe(
      take(1),
      map(user => {
        if (!user) {
          return true;
        } else {
          this.api.getUsers(true).subscribe(res => {
            this.users = res;
            const phoneNumber = this.api.getUserData();
            const r = 'contacts';
            const users = this.users;
            const navigationExtras = {
              state: {
                users,
                phoneNumber
              }
            };
            console.log(this.users);
             this.router.navigate([r], navigationExtras);
            return false;
          });
        }
      })
    )
  }
}