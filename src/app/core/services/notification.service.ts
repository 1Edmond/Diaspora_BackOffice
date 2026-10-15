import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedList } from '../models/shared/base-response.model';
import { NotificationListQuery, UserNotificationDto, NotificationRuleDto } from '../models/notification/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/notifications`;
  private readonly rulesUrl = `${environment.apiBaseUrl}/api/notification-rules`;

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

  // Notification Rules
  getRules(pageNumber = 1, pageSize = 50): Observable<PagedList<NotificationRuleDto>> {
    return this.http.get<PagedList<NotificationRuleDto>>(this.rulesUrl, {
      params: { pageNumber, pageSize }
    });
  }

  getRule(eventType: string): Observable<NotificationRuleDto> {
    return this.http.get<NotificationRuleDto>(`${this.rulesUrl}/${eventType}`);
  }

  upsertRule(eventType: string, channels: number, isActive: boolean): Observable<NotificationRuleDto> {
    return this.http.put<NotificationRuleDto>(`${this.rulesUrl}/${eventType}`, { channels, isActive });
  }

  deleteRule(eventType: string): Observable<void> {
    return this.http.delete<void>(`${this.rulesUrl}/${eventType}`);
  }

  broadcastCampaign(data: {
    title: string;
    message: string;
    channel?: string;
    targetRole?: string;
    profileTypeId?: string;
  }): Observable<{ id: string; message: string }> {
    return this.http.post<{ id: string; message: string }>(`${this.apiUrl}/broadcast`, data);
  }
}
