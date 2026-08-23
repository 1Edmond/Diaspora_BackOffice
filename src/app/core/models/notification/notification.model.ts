export interface UserNotificationDto {
  id: string
  sequence: number
  eventType: string
  payload: string
  isRead: boolean
  createdAt: string
  readAt?: string
}

export interface NotificationListQuery {
  pageNumber?: number
  pageSize?: number
  unreadOnly?: boolean
}

export interface ParsedNotificationPayload {
  title?: string
  message?: string
  body?: string
  type?: string
  level?: string
  referenceId?: string
  referenceType?: string
  [key: string]: unknown
}

export function parseNotificationPayload(payload: string): ParsedNotificationPayload {
  if (!payload) return {}
  try {
    const parsed = JSON.parse(payload)
    if (parsed && typeof parsed === 'object') {
      return parsed as ParsedNotificationPayload
    }
    return { message: String(parsed) }
  } catch {
    return { message: payload }
  }
}
