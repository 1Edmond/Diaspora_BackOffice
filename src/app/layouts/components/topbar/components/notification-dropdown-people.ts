import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'

const user4 = 'assets/images/users/user-4.jpg'
const user5 = 'assets/images/users/user-5.jpg'
const user6 = 'assets/images/users/user-6.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user8 = 'assets/images/users/user-8.jpg'

type NotificationType = {
  user?: {
    name: string
    image: string
  }
  icon?: string
  badge: { icon: string; className: string }
  action: string
  context: string
  time: string
}

@Component({
  selector: 'notification-dropdown-people',
  imports: [Icon, RouterLink, SimplebarAngularModule, NgbDropdownModule],
  template: `
    <div id="notification-dropdown-people" class="topbar-item">
      <div ngbDropdown placement="bottom-end" autoClose="outside">
        <button ngbDropdownToggle class="topbar-link dropdown-toggle drop-arrow-none" type="button">
          <app-icon icon="bell" class="topbar-link-icon animate-ring"></app-icon>
          <span class="badge text-bg-danger badge-circle topbar-badge">5</span>
        </button>

        <div ngbDropdownMenu class="p-0 dropdown-menu-end dropdown-menu-lg">
          <div class="px-3 py-2 border-bottom">
            <div class="row align-items-center">
              <div class="col">
                <h6 class="m-0 fs-md fw-semibold">Notifications</h6>
              </div>
              <div class="col text-end">
                <a [routerLink]="[]" class="badge badge-soft-success badge-label py-1">07 Notifications</a>
              </div>
            </div>
          </div>

          <ngx-simplebar style="max-height: 300px">
            @for (item of notificationData; track $index) {
              <div ngbDropdownItem class="notification-item py-2 text-wrap">
                <span class="d-flex align-items-center gap-3">
                  <!-- Avatar or Icon -->
                  <span class="flex-shrink-0 position-relative">
                    <!-- If user image -->
                    @if (item.user) {
                      <img [src]="item.user.image" class="avatar-md rounded-circle" alt="User Avatar" />
                    }

                    <!-- If only icon -->
                    @else {
                      <span class="avatar-md rounded-circle bg-light d-flex align-items-center justify-content-center">
                        <app-icon [icon]="item.icon!" class="fs-4"></app-icon>
                      </span>
                    }

                    <!-- Badge -->
                    <span class="position-absolute rounded-pill {{ item.badge.className }} notification-badge">
                      <app-icon [icon]="item.badge.icon" class="align-middle"></app-icon>
                      <span class="visually-hidden">notification</span>
                    </span>
                  </span>

                  <!-- Message -->
                  <span class="flex-grow-1 text-muted">
                    <!-- User Name -->

                    <span class="fw-medium text-body">{{ item.user ? item.user.name : item.context }}</span>

                    {{ item.action }}
                    @if (item.user) {
                      <span class="fw-medium text-body">{{ item.context }}</span>
                    }
                    <br />
                    <span class="fs-xs">{{ item.time }}</span>
                  </span>

                  <!-- Close Button -->
                  <button type="button" class="flex-shrink-0 text-muted btn btn-link p-0 position-absolute end-0 me-2 d-none noti-close-btn">
                    <app-icon icon="x-square" class="fs-xxl"></app-icon>
                  </button>
                </span>
              </div>
            }
          </ngx-simplebar>

          <!-- All-->
          <a [routerLink]="[]" ngbDropdownItem class="d-block w-100 text-center text-reset text-decoration-underline link-offset-2 fw-bold notify-item border-top border-light py-2">Read All Messages</a>
        </div>
        <!-- End dropdown-menu -->
      </div>
      <!-- end dropdown-->
    </div>
  `,
  styles: ``,
})
export class NotificationDropdownPeople {
  notificationData: NotificationType[] = [
    {
      user: {
        name: 'Emily Johnson',
        image: user4,
      },
      badge: {
        icon: 'bell',
        className: 'bg-success',
      },
      action: 'commented on a task in',
      context: 'Design Sprint',
      time: '12 minutes ago',
    },

    {
      user: {
        name: 'Michael Lee',
        image: user5,
      },
      badge: {
        icon: 'cloud-upload',
        className: 'bg-info',
      },
      action: 'uploaded files to',
      context: 'Marketing Assets',
      time: '25 minutes ago',
    },

    {
      icon: 'database',
      badge: {
        icon: 'circle-alert',
        className: 'bg-danger',
      },
      action: 'CPU usage exceeded 90%',
      context: 'Server #3',
      time: 'Just now',
    },

    {
      user: {
        name: 'Sophia Ray',
        image: user6,
      },
      badge: {
        icon: 'alert-triangle',
        className: 'bg-warning',
      },
      action: 'flagged an issue in',
      context: 'Bug Tracker',
      time: '40 minutes ago',
    },

    {
      user: {
        name: 'David Kim',
        image: user7,
      },
      badge: {
        icon: 'calendar-check',
        className: 'bg-primary',
      },
      action: 'scheduled a meeting for',
      context: 'UX Review',
      time: '1 hour ago',
    },

    {
      user: {
        name: 'Isabella White',
        image: user8,
      },
      badge: {
        icon: 'square-pen',
        className: 'bg-secondary',
      },
      action: 'updated the document in',
      context: 'Product Specs',
      time: '2 hours ago',
    },

    {
      icon: 'rocket',
      badge: {
        icon: 'check',
        className: 'bg-success',
      },
      action: 'deployment completed successfully',
      context: 'Production Server',
      time: '30 minutes ago',
    },
  ]
}
