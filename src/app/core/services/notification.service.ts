import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedList } from '../models/shared/base-response.model';
import { NotificationListQuery, UserNotificationDto } from '../models/notification/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(query: NotificationListQuery = {}): Observable<PagedList<UserNotificationDto>> {
    const params: any = {};
    if (query.pageNumber != null) params.pageNumber = query.pageNumber;
    if (query.pageSize != null) params.pageSize = query.pageSize;
    if (query.unreadOnly) params.unreadOnly = true;
    return this.http.get<PagedList<UserNotificationDto>>(this.apiUrl, { params });
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`);
  }

  markAsRead(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<{ updatedCount: number }> {
    return this.http.post<{ updatedCount: number }>(`${this.apiUrl}/read-all`, {});
  }
}
