import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { LayoutService } from '@core/services/layout.service'

const MODULES = [
  { label: 'Identity', icon: 'users', route: '/identity/users', children: ['Users', 'Roles', 'Permissions'] },
  { label: 'KYC', icon: 'shield-check', route: '/kyc/list', children: ['Verifications'] },
  { label: 'Profiles', icon: 'user-round', route: '/profiles/types', children: ['Profile Types'] },
  { label: 'Documents', icon: 'file-text', route: '/documents', children: ['All Documents', 'Document Types'] },
  { label: 'Procedures', icon: 'list-checks', route: '/procedures', children: ['Definitions', 'User Progress', 'Locations'] },
  { label: 'Marketplace', icon: 'shopping-bag', route: '/marketplace/listings', children: ['Listings', 'Pending', 'Categories', 'Requests', 'Reviews'] },
  { label: 'Wallet', icon: 'wallet', route: '/wallet', children: ['Wallet', 'Transactions', 'Parameters'] },
  { label: 'Notifications', icon: 'bell', route: '/notifications', children: ['Notification Center'] },
]

@Component({
  selector: 'modules-dropdown',
  imports: [RouterLink, Icon, NgbDropdownModule],
  template: `
    <div id="modules-dropdown" class="topbar-item">
      <div ngbDropdown placement="bottom-end" autoClose="outside">
        <button ngbDropdownToggle class="topbar-link drop-arrow-none" type="button">
          <app-icon icon="grid" class="topbar-link-icon"></app-icon>
          <span class="d-none d-md-inline fw-medium ms-1">Modules</span>
        </button>

        <div ngbDropdownMenu class="dropdown-menu-lg p-3 dropdown-menu-end" style="min-width: 340px;">
          <h6 class="dropdown-header fw-bold mb-3">Modules</h6>
          <div class="row g-2">
            @for (module of MODULES; track module.label) {
            <div class="col-12 col-md-6">
              <a [routerLink]="module.route" class="d-flex align-items-center gap-2 p-2 border rounded hover-bg-light text-decoration-none text-body" ngbDropdownItem>
                <span class="avatar-sm d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded">
                  <app-icon [icon]="module.icon" class="fs-16"></app-icon>
                </span>
                <div class="flex-grow-1 min-w-0">
                  <span class="fw-medium d-block text-truncate">{{ module.label }}</span>
                  <span class="text-xs text-muted">{{ module.children.join(', ') }}</span>
                </div>
              </a>
            </div>
            }
          </div>
          <div class="text-center mt-3 pt-2 border-top">
            <button class="btn btn-sm btn-outline-primary" (click)="toggleSidebar()">
              <app-icon icon="chevron-left" class="me-1"></app-icon>
              Toggle Sidebar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ModulesDropdown {
  MODULES = MODULES

  private layout = inject(LayoutService)

  toggleSidebar() {
    this.layout.toggleSidebar()
  }
}