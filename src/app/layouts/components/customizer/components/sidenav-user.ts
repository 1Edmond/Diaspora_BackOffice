import { Component } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'sidenav-user',
  imports: [],
  template: `
    <div class="p-3">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <label class="fw-bold m-0" for="sidebaruser-check">Sidebar User Info</label>
        </h5>
        <div class="form-check form-switch fs-lg">
          <input type="checkbox" class="form-check-input" name="sidebar-user" [checked]="layout.sidenavUser" (change)="layout.updateLayout({ sidenavUser: !layout.sidenavUser })" />
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class SidenavUser {
  constructor(public layout: LayoutService) {}
}
