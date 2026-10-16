import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import {
  parseNotificationPayload,
  UserNotificationDto,
} from '@core/models/notification/notification.model'
import { AuthService } from '@core/services/auth.service'
import { NotificationService } from '@core/services/notification.service'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'

interface TopbarNotificationView {
  id: string
  title: string
  message: string
  eventType: string
  isRead: boolean
  createdAt: string
  icon: string
  color: string
  route: string
}

@Component({
  selector: 'notification-dropdown-people',
  imports: [Icon, RouterLink, SimplebarAngularModule, NgbDropdownModule, DatePipe],
  template: `
    <div id="notification-dropdown-people" class="topbar-item">
      <div
        #dropdown="ngbDropdown"
        ngbDropdown
        placement="bottom-end"
        autoClose="outside"
        (openChange)="onDropdownOpen($event)"
      >
        <button
          ngbDropdownToggle
          class="topbar-link dropdown-toggle drop-arrow-none position-relative"
          type="button"
          title="Notifications"
        >
          <app-icon icon="bell" class="topbar-link-icon" [class.animate-ring]="unreadCount > 0"></app-icon>
          @if (unreadCount > 0) {
            <span class="badge text-bg-danger badge-circle topbar-badge">
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          }
        </button>

        <div ngbDropdownMenu class="p-0 dropdown-menu-end dropdown-menu-lg shadow-lg border-0" style="width: 360px; max-width: 92vw;">
          <div class="px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
              <h6 class="m-0 fs-md fw-bold">Notifications</h6>
              @if (unreadCount > 0) {
                <span class="badge bg-soft-danger text-danger">{{ unreadCount }} non lue(s)</span>
              } @else {
                <span class="badge bg-soft-success text-success">À jour</span>
              }
            </div>
            <div class="d-flex align-items-center gap-1">
              @if (unreadCount > 0) {
                <button
                  type="button"
                  class="btn btn-xs btn-soft-primary text-primary border-0"
                  (click)="markAllRead()"
                  [disabled]="loading"
                  title="Tout marquer comme lu"
                >
                  <app-icon icon="check-check" class="me-1"></app-icon>Tout lire
                </button>
              }
              <button
                type="button"
                class="btn btn-xs btn-light"
                (click)="loadNotifications()"
                [disabled]="loading"
                title="Rafraîchir"
              >
                <app-icon icon="refresh-cw" [class.spin]="loading"></app-icon>
              </button>
            </div>
          </div>

          <ngx-simplebar style="max-height: 320px">
            @if (loading && notifications.length === 0) {
              <div class="p-4 text-center text-muted">
                <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                <span>Chargement des notifications...</span>
              </div>
            } @else if (notifications.length === 0) {
              <div class="p-4 text-center text-muted">
                <span class="avatar-md rounded-circle bg-soft-info text-info d-inline-flex align-items-center justify-content-center mb-2">
                  <app-icon icon="bell-off" class="fs-4"></app-icon>
                </span>
                <p class="mb-1 fw-medium text-body">Aucune notification récente</p>
                <small class="d-block">Les alertes système et activités du BackOffice apparaîtront ici.</small>
              </div>
            } @else {
              @for (item of notifications; track item.id) {
                <div
                  class="px-3 py-2 border-bottom notification-row d-flex align-items-start gap-2"
                  [class.bg-light-subtle]="!item.isRead"
                >
                  <span
                    class="avatar-sm rounded-circle bg-soft-{{ item.color }} text-{{ item.color }} d-flex align-items-center justify-content-center flex-shrink-0 mt-1"
                  >
                    <app-icon [icon]="item.icon" class="fs-16"></app-icon>
                  </span>

                  <div class="flex-grow-1 min-w-0">
                    <div class="d-flex align-items-center justify-content-between gap-1">
                      <a
                        [routerLink]="item.route"
                        (click)="onSelectNotification(item, dropdown)"
                        class="fw-semibold text-body text-decoration-none text-truncate d-block fs-sm"
                      >
                        {{ item.title }}
                      </a>
                      @if (!item.isRead) {
                        <span class="badge bg-primary rounded-circle p-1" title="Non lu"></span>
                      }
                    </div>
                    <p class="text-muted mb-1 fs-xs text-break" style="line-height: 1.35;">
                      {{ item.message }}
                    </p>
                    <div class="d-flex align-items-center justify-content-between">
                      <span class="text-muted" style="font-size: 0.7rem;">
                        {{ item.createdAt | date: 'dd/MM/yyyy HH:mm' }}
                      </span>
                      @if (!item.isRead) {
                        <button
                          type="button"
                          class="btn btn-link p-0 text-primary text-decoration-none"
                          style="font-size: 0.72rem;"
                          (click)="markRead(item)"
                        >
                          Marquer lu
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            }
          </ngx-simplebar>

          <a
            routerLink="/notifications"
            (click)="dropdown.close()"
            class="d-block w-100 text-center text-primary text-decoration-none fw-semibold border-top py-2 bg-light-subtle"
          >
            Voir toutes les notifications
            <app-icon icon="arrow-right" class="ms-1 align-middle"></app-icon>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: `
    .notification-row {
      transition: background-color 0.15s ease;
    }
    .notification-row:hover {
      background-color: rgba(var(--theme-primary-rgb), 0.05);
    }
  `,
})
export class NotificationDropdownPeople implements OnInit {
  notifications: TopbarNotificationView[] = []
  unreadCount = 0
  loading = false

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.loadNotifications()
    }
  }

  onDropdownOpen(isOpen: boolean): void {
    if (isOpen && this.authService.isAuthenticated()) {
      this.loadNotifications()
    }
  }

  loadNotifications(): void {
    if (!this.authService.isAuthenticated()) return
    this.loading = true

    this.notificationService.getUnreadCount().subscribe({
      next: (res) => {
        this.unreadCount = res?.count ?? 0
      },
      error: () => {
        this.unreadCount = this.notifications.filter((n) => !n.isRead).length
      },
    })

    this.notificationService.getNotifications({ pageNumber: 1, pageSize: 8 }).subscribe({
      next: (res) => {
        this.loading = false
        const items = res?.items || []
        this.notifications = items.map((dto) => this.mapDto(dto))
        if (!this.unreadCount) {
          this.unreadCount = this.notifications.filter((n) => !n.isRead).length
        }
      },
      error: () => {
        this.loading = false
        this.notifications = []
      },
    })
  }

  markRead(item: TopbarNotificationView): void {
    if (item.isRead) return
    item.isRead = true
    this.unreadCount = Math.max(0, this.unreadCount - 1)
    this.notificationService.markAsRead(item.id).subscribe({
      error: () => {},
    })
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach((n) => (n.isRead = true))
        this.unreadCount = 0
      },
      error: () => {
        this.notifications.forEach((n) => (n.isRead = true))
        this.unreadCount = 0
      },
    })
  }

  onSelectNotification(item: TopbarNotificationView, dropdown: { close: () => void }): void {
    if (!item.isRead) {
      this.markRead(item)
    }
    dropdown.close()
  }

  private mapDto(dto: UserNotificationDto): TopbarNotificationView {
    const parsed = parseNotificationPayload(dto.payload)
    const eventType = dto.eventType || 'Notification'
    const title = parsed.title || this.formatEventType(eventType)
    const message = parsed.message || parsed.body || dto.payload || 'Nouvelle notification système'
    const { icon, color, route } = this.resolveMeta(eventType)

    return {
      id: dto.id,
      title,
      message,
      eventType,
      isRead: dto.isRead,
      createdAt: dto.createdAt,
      icon,
      color,
      route,
    }
  }

  private formatEventType(eventType: string): string {
    return eventType
      .replace(/([A-Z])/g, ' $1')
      .replace(/[._-]/g, ' ')
      .trim()
  }

  private resolveMeta(eventType: string): { icon: string; color: string; route: string } {
    const lower = eventType.toLowerCase()
    if (lower.includes('kyc')) {
      return { icon: 'user-check', color: 'success', route: '/kyc/list' }
    }
    if (lower.includes('wallet') || lower.includes('payment') || lower.includes('transaction')) {
      return { icon: 'credit-card', color: 'primary', route: '/wallet/transactions' }
    }
    if (lower.includes('document')) {
      return { icon: 'file-text', color: 'warning', route: '/documents' }
    }
    if (lower.includes('procedure')) {
      return { icon: 'clipboard-list', color: 'purple', route: '/procedures/user-procedures' }
    }
    if (lower.includes('dispute') || lower.includes('report')) {
      return { icon: 'alert-triangle', color: 'danger', route: '/marketplace/disputes' }
    }
    if (lower.includes('chat') || lower.includes('message')) {
      return { icon: 'message-square', color: 'warning', route: '/chat/moderation' }
    }
    return { icon: 'bell', color: 'info', route: '/notifications' }
  }
}

