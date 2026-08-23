import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'

type MegaMenuType = {
  title: string
  links: {
    icon: string
    label: string
    href: string
  }[]
}

@Component({
  selector: 'megamenu-pages',
  imports: [Icon, SimplebarAngularModule, RouterLink, NgbDropdownModule],
  template: `
    <div id="megamenu-pages" class="topbar-item">
      <div ngbDropdown>
        <button ngbDropdownToggle class="topbar-link btn fw-medium btn-link drop-arrow-none px-2" type="button">
          Pages
          <app-icon icon="chevron-down" class="ms-1"></app-icon>
        </button>
        <div ngbDropdownMenu class="dropdown-menu-xxl p-0">
          <ngx-simplebar class="h-100" style="max-height: 380px;">
            <div class="row g-0">
              @for (item of megaMenuData; track $index) {
                <div class="col-md-4">
                  <div class="p-2">
                    <h5 class="mb-1 fw-semibold fs-sm dropdown-header">{{ item.title }}</h5>
                    <ul class="list-unstyled megamenu-list">
                      @for (link of item.links; track $index) {
                        <li>
                          <a [routerLink]="link.href" ngbDropdownItem>
                            <app-icon [icon]="link.icon" class="align-middle me-2 fs-16"></app-icon>
                            {{ link.label }}
                          </a>
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              }
            </div>
          </ngx-simplebar>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class MegamenuPages {
  megaMenuData: MegaMenuType[] = [
    {
      title: 'Dashboard & Analytics',
      links: [
        { icon: 'chart-line', label: 'Sales Dashboard', href: '' },
        { icon: 'lightbulb', label: 'Marketing Dashboard', href: '' },
        { icon: 'dollar-sign', label: 'Finance Overview', href: '' },
        { icon: 'users', label: 'User Analytics', href: '' },
        { icon: 'activity', label: 'Traffic Insights', href: '' },
      ],
    },

    {
      title: 'Project Management',
      links: [
        { icon: 'kanban', label: 'Kanban Workflow', href: '' },
        { icon: 'calendar-clock', label: 'Project Timeline', href: '' },
        { icon: 'list-check', label: 'Task Management', href: '' },
        { icon: 'users-round', label: 'Team Members', href: '' },
        { icon: 'clipboard-type', label: 'Assignments', href: '' },
      ],
    },

    {
      title: 'User Management',
      links: [
        { icon: 'circle-user-round', label: 'User Profiles', href: '' },
        { icon: 'lock-keyhole', label: 'Access Control', href: '' },
        { icon: 'settings', label: 'Security Settings', href: '' },
        { icon: 'users', label: 'User Groups', href: '' },
        { icon: 'key', label: 'Authentication', href: '' },
      ],
    },
  ]
}
