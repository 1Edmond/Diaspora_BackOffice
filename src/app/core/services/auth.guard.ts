import { Injectable } from '@angular/core'
import { CanActivate, Router, UrlTree } from '@angular/router'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: any): boolean | UrlTree {
    if (this.auth.isAuthenticated()) {
      return true
    } else {
      return this.router.createUrlTree(['/auth/sign-in'], {
        queryParams: route.queryParams,
        queryParamsHandling: 'merge',
      })
    }
  }
}
