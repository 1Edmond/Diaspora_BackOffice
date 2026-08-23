import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NotificationService } from '@core/services/notification.service'
import { parseNotificationPayload, UserNotificationDto } from '@core/models/notification/notification.model'

interface DisplayNotification {
  id: string
  sequence: number
  eventType: string
  title: string
  message: string
  icon: string
  isRead: boolean
  createdAt: string
}

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, Icon],
  templateUrl: './notification-list.html',
  styles: ``,
})
export class NotificationList implements OnInit {
  notifications: DisplayNotification[] = []
  page = 1
  pageSize = 20
  totalCount = 0
  totalPages = 1
  unreadCount = 0
  unreadOnly = false
  loading = false

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadNotifications()
    this.notificationService.getUnreadCount().subscribe({
      next: (res) => { this.unreadCount = res.count },
      error: () => {},
    })
  }

  private mapNotification(n: UserNotificationDto): DisplayNotification {
    const payload = parseNotificationPayload(n.payload)
    const level = String(payload.level || payload.type || '').toLowerCase()
    const icon = level === 'warning' || level === 'error' ? 'alert-triangle'
      : level === 'success' ? 'check-circle'
      : 'bell'
    return {
      id: n.id,
      sequence: n.sequence,
      eventType: n.eventType,
      title: payload.title || this.humanizeEvent(n.eventType),
      message: payload.message || payload.body || '',
      icon,
      isRead: n.isRead,
      createdAt: n.createdAt,
    }
  }

  private humanizeEvent(eventType: string): string {
    if (!eventType) return 'Notification'
    return eventType
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[._-]+/g, ' ')
      .replace(/Event$|Created$|Notification$/i, '')
      .trim() || 'Notification'
  }

  loadNotifications() {
    this.loading = true
    this.notificationService.getNotifications({
      pageNumber: this.page,
      pageSize: this.pageSize,
      unreadOnly: this.unreadOnly || undefined,
    }).subscribe({
      next: (res) => {
        this.notifications = res.items.map((n) => this.mapNotification(n))
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  markRead(notif: DisplayNotification) {
    if (notif.isRead) return
    this.notificationService.markAsRead(notif.id).subscribe({
      next: () => {
        notif.isRead = true
        this.unreadCount = Math.max(0, this.unreadCount - 1)
      },
      error: () => {},
    })
  }

  markAllRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true)
        this.unreadCount = 0
      },
      error: () => {},
    })
  }

  toggleFilter() {
    this.unreadOnly = !this.unreadOnly
    this.page = 1
    this.loadNotifications()
  }

  onPageChange(page: number) {
    this.page = page
    this.loadNotifications()
  }
}
