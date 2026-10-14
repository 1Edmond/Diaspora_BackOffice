export interface UserNotificationDto {
  id: string
  sequence: number
  eventType: string
  payload: string
  isRead: boolean
  createdAt: string
  readAt?: string
}

export enum NotificationChannel {
  Email = 1,
  Sms = 2,
  Whatsapp = 4,
  Telegram = 8,
  Push = 16,
  InApp = 32
}

export const NotificationChannelLabels: Record<NotificationChannel, string> = {
  [NotificationChannel.Email]: 'Email',
  [NotificationChannel.Sms]: 'SMS',
  [NotificationChannel.Whatsapp]: 'WhatsApp',
  [NotificationChannel.Telegram]: 'Telegram',
  [NotificationChannel.Push]: 'Push',
  [NotificationChannel.InApp]: 'In-App'
};

export const NotificationChannelIcons: Record<NotificationChannel, string> = {
  [NotificationChannel.Email]: 'envelope',
  [NotificationChannel.Sms]: 'chat-text',
  [NotificationChannel.Whatsapp]: 'whatsapp',
  [NotificationChannel.Telegram]: 'telegram',
  [NotificationChannel.Push]: 'bell',
  [NotificationChannel.InApp]: 'layout'
};

export interface NotificationRuleDto {
  eventType: string
  channels: number
  isActive: boolean
  channelNames: string[]
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
