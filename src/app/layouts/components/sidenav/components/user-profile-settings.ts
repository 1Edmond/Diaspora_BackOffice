import { META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { AuthService } from '@core/services/auth.service'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'user-profile-settings',
  imports: [Icon, RouterLink, NgbDropdownModule],
  template: `
    <div id="user-profile-settings" class="sidenav-user" style="background: url(assets/images/user-bg-pattern.svg)">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <a [routerLink]="[]" class="link-reset">
            <img src="assets/images/users/user-1.jpg" alt="user-image" class="rounded-circle mb-2 avatar-md" />
            <span class="sidenav-user-name fw-bold">{{ username }}</span>
            <span class="fs-12 fw-semibold">Art Director</span>
          </a>
        </div>
        <div ngbDropdown>
          <a ngbDropdownToggle class="drop-arrow-none link-reset sidenav-user-set-icon" [routerLink]="[]">
            <app-icon icon="settings" class="fs-24 align-middle ms-1"></app-icon>
          </a>

          <div ngbDropdownMenu>
            <div class="dropdown-header noti-title">
              <h6 class="text-overflow m-0">Welcome back!</h6>
            </div>

            <a [routerLink]="[]" ngbDropdownItem>
              <app-icon icon="circle-user-round" class="me-1 fs-lg align-middle"></app-icon>
              <span class="align-middle">Profile</span>
            </a>

            <a [routerLink]="[]" ngbDropdownItem>
              <app-icon icon="bolt" class="me-1 fs-lg align-middle"></app-icon>
              <span class="align-middle">Account Settings</span>
            </a>

            <a routerLink="/auth/lock-screen" ngbDropdownItem>
              <app-icon icon="lock-keyhole" class="me-1 fs-lg align-middle"></app-icon>
              <span class="align-middle">Lock Screen</span>
            </a>

            <a [routerLink]="[]" (click)="logout()" ngbDropdownItem class="text-danger fw-semibold">
              <app-icon icon="log-out" class="me-1 fs-lg align-middle"></app-icon>
              <span class="align-middle">Log Out</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class UserProfileSettings {
  username = META_DATA.username

  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout()
  }
}
