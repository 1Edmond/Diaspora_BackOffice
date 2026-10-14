import { Component, OnInit, signal, computed } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NotificationService } from '@core/services/notification.service'
import { NotificationRuleDto, NotificationChannel, NotificationChannelLabels, NotificationChannelIcons } from '@core/models/notification/notification.model'
import { CommonModule } from '@angular/common'

interface RuleWithChannels extends NotificationRuleDto {
  channelFlags: Record<NotificationChannel, boolean>
}

@Component({
  selector: 'app-notification-preferences',
  standalone: true,
  imports: [CommonModule, PageBreadcrumb, FormsModule, Icon],
  templateUrl: './notification-preferences.html',
  styles: ``,
})
export class NotificationPreferences implements OnInit {
  private readonly allChannels = Object.values(NotificationChannel).filter(v => typeof v === 'number') as NotificationChannel[]

  rules = signal<RuleWithChannels[]>([])
  loading = signal(false)
  saving = signal<string | null>(null)
  error = signal<string | null>(null)

  readonly channelLabels = NotificationChannelLabels
  readonly channelIcons = NotificationChannelIcons

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadRules()
  }

  loadRules() {
    this.loading.set(true)
    this.error.set(null)
    this.notificationService.getRules(1, 100).subscribe({
      next: (res) => {
        console.log('API Response:', res)
        console.log('Items:', res.items)
        this.rules.set(res.items.map(rule => this.mapRule(rule)))
        this.loading.set(false)
      },
      error: (err) => {
        this.loading.set(false)
        this.error.set(err.message || 'Failed to load notification rules')
        console.error('Failed to load rules', err)
      }
    })
  }

  private mapRule(rule: any): RuleWithChannels {
    const eventType = rule.eventType ?? rule.EventType
    const channels = rule.channels ?? rule.Channels ?? 0
    const isActive = rule.isActive ?? rule.IsActive ?? true
    const channelNames = rule.channelNames ?? rule.ChannelNames ?? []

    const channelFlags: Record<NotificationChannel, boolean> = {} as any
    for (const ch of this.allChannels) {
      channelFlags[ch] = (channels & ch) === ch
    }
    return { eventType, channels, isActive, channelNames, channelFlags }
  }

  getChannelKeys(rule: RuleWithChannels): NotificationChannel[] {
    return this.allChannels
  }

  toggleChannel(rule: RuleWithChannels, channel: NotificationChannel) {
    rule.channelFlags[channel] = !rule.channelFlags[channel]
    rule.channels = this.computeChannels(rule.channelFlags)
  }

  private computeChannels(flags: Record<NotificationChannel, boolean>): number {
    let value = 0
    for (const [ch, enabled] of Object.entries(flags)) {
      if (enabled) value |= ch as unknown as number
    }
    return value
  }

  async saveRule(rule: RuleWithChannels) {
    this.saving.set(rule.eventType)
    try {
      await this.notificationService.upsertRule(rule.eventType, rule.channels, rule.isActive).toPromise()
    } catch (e) {
      console.error('Failed to save rule', e)
      // Revert on error
      this.loadRules()
    } finally {
      this.saving.set(null)
    }
  }

  onIsActiveChange(rule: RuleWithChannels) {
    this.saveRule(rule)
  }

  trackByEventType(index: number, rule: RuleWithChannels): string {
    return rule.eventType
  }

  getEventTypeLabel(eventType: string): string {
    return eventType
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/Event$|Integration$|Created$/i, '')
      .trim()
  }
}