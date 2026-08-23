import { Component } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'
import { AppMenu } from '@layouts/components/sidenav/components/app-menu'
import { SimplebarAngularModule } from 'simplebar-angular'

import { AppLogo } from './components/app-logo'
import { OffcanvasToggler } from './components/offcanvas-toggler'
import { OnHoverToggler } from './components/on-hover-toggler'
import { UserProfileSettings } from './components/user-profile-settings'

@Component({
  selector: 'app-sidenav',
  imports: [UserProfileSettings, AppMenu, SimplebarAngularModule, AppLogo, OnHoverToggler, OffcanvasToggler],
  template: `
    <div class="sidenav-menu">
      <app-logo />

      <on-hover-toggler />

      <offcanvas-toggler />

      <ngx-simplebar id="sidenav" class="scrollbar">
        <user-profile-settings />

        <app-menu />
      </ngx-simplebar>
    </div>
  `,
})
export class Sidenav {
  constructor(public layout: LayoutService) {}
}
