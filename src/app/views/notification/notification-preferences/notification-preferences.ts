import { Component, OnInit, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NotificationService } from '@core/services/notification.service'
import { NotificationRuleDto, NotificationChannel, NotificationChannelLabels, NotificationChannelIcons } from '@core/models/notification/notification.model'
import { CommonModule } from '@angular/common'

export interface EventMetadata {
  eventType: string
  label: string
  category: string
  defaultMessage: string
  supportedPlaceholders: string[]
}

export interface RuleWithChannels extends NotificationRuleDto {
  channelFlags: Partial<Record<NotificationChannel, boolean>>
  metadata?: EventMetadata
  customTemplate?: string
}

@Component({
  selector: 'app-notification-preferences',
  standalone: true,
  imports: [CommonModule, PageBreadcrumb, FormsModule, Icon],
  templateUrl: './notification-preferences.html',
  styles: ``,
})
export class NotificationPreferences implements OnInit {
  readonly allChannels: NotificationChannel[] = [
    NotificationChannel.Email,
    NotificationChannel.Sms,
    NotificationChannel.Whatsapp,
    NotificationChannel.Telegram,
    NotificationChannel.Push,
    NotificationChannel.InApp
  ]

  rules = signal<RuleWithChannels[]>([])
  loading = signal(false)
  saving = signal<string | null>(null)
  error = signal<string | null>(null)
  successMessage = signal<string | null>(null)

  readonly channelLabels = NotificationChannelLabels
  readonly channelIcons = NotificationChannelIcons

  // Catalogue des événements métier système enrichi
  readonly systemCatalog: EventMetadata[] = [
    {
      eventType: 'ProfileVerifiedIntegrationEvent',
      label: 'Vérification de Profil Validée',
      category: 'Identité & KYC',
      defaultMessage: 'Félicitations {{userName}}, votre profil a été vérifié avec succès pour {{countryName}}.',
      supportedPlaceholders: ['{{userName}}', '{{countryName}}'],
    },
    {
      eventType: 'UserActivatedIntegrationEvent',
      label: 'Activation de Compte Citoyen',
      category: 'Identité & KYC',
      defaultMessage: 'Bienvenue {{userName}}, votre compte a été activé avec succès.',
      supportedPlaceholders: ['{{userName}}', '{{email}}'],
    },
    {
      eventType: 'DocumentRejectedIntegrationEvent',
      label: 'Document Consulaire / KYC Rejeté',
      category: 'Documents',
      defaultMessage: 'Votre document {{documentTypeName}} a été refusé. Motif : {{rejectionReason}}.',
      supportedPlaceholders: ['{{userName}}', '{{documentTypeName}}', '{{rejectionReason}}'],
    },
    {
      eventType: 'MarketplacePaymentHeldIntegrationEvent',
      label: 'Paiement Séquestré sur Commande',
      category: 'Marketplace & Colis',
      defaultMessage: 'Le paiement de {{amount}} {{currency}} pour {{serviceTitle}} est sécurisé sous séquestre.',
      supportedPlaceholders: ['{{serviceTitle}}', '{{amount}}', '{{currency}}', '{{buyerName}}'],
    },
    {
      eventType: 'MarketplacePaymentReleasedIntegrationEvent',
      label: 'Fonds Libérés au Prestataire',
      category: 'Marketplace & Colis',
      defaultMessage: 'Les fonds de {{amount}} {{currency}} pour la prestation {{serviceTitle}} ont été crédités sur votre portefeuille.',
      supportedPlaceholders: ['{{serviceTitle}}', '{{amount}}', '{{currency}}'],
    },
    {
      eventType: 'DisputeOpenedIntegrationEvent',
      label: 'Ouverture d\'un Litige Marketplace',
      category: 'Marketplace Litiges',
      defaultMessage: 'Un litige a été ouvert pour la commande {{serviceTitle}}. Statut : En cours d\'arbitrage.',
      supportedPlaceholders: ['{{serviceTitle}}', '{{reason}}', '{{disputeId}}'],
    },
    {
      eventType: 'JobApplicationAcceptedIntegrationEvent',
      label: 'Candidature Freelance Acceptée',
      category: 'Freelance',
      defaultMessage: 'Votre candidature pour la mission {{jobTitle}} a été acceptée par l\'employeur !',
      supportedPlaceholders: ['{{jobTitle}}', '{{employerName}}'],
    },
    {
      eventType: 'ServiceRequestCreatedEvent',
      label: 'Nouvelle Demande de Service / Colis',
      category: 'Marketplace & Colis',
      defaultMessage: 'Une nouvelle demande de service ou transport a été initiée pour {{serviceTitle}}.',
      supportedPlaceholders: ['{{serviceTitle}}', '{{requesterName}}'],
    },
  ]

  // Édition de template via modal
  selectedRuleForEdit: RuleWithChannels | null = null
  editCustomText = ''
  showEditModal = false

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadRules()
  }

  loadRules() {
    this.loading.set(true)
    this.error.set(null)
    this.notificationService.getRules(1, 100).subscribe({
      next: (res) => {
        const rawItems = res.items || []
        
        // Assurer que tous les événements du catalogue système existent dans la liste
        const mappedList: RuleWithChannels[] = []
        const seenEvents = new Set<string>()

        for (const raw of rawItems) {
          const rule = this.mapRule(raw)
          seenEvents.add(rule.eventType)
          mappedList.push(rule)
        }

        // Compléter avec les templates du catalogue non encore enregistrés
        for (const meta of this.systemCatalog) {
          if (!seenEvents.has(meta.eventType)) {
            const channelFlags: Record<NotificationChannel, boolean> = {
              [NotificationChannel.Email]: false,
              [NotificationChannel.Sms]: false,
              [NotificationChannel.Whatsapp]: false,
              [NotificationChannel.Telegram]: false,
              [NotificationChannel.Push]: true,
              [NotificationChannel.InApp]: true,
            }
            const rule: RuleWithChannels = {
              eventType: meta.eventType,
              channels: NotificationChannel.InApp | NotificationChannel.Push,
              isActive: true,
              channelNames: ['InApp', 'Push'],
              channelFlags,
              metadata: meta,
              customTemplate: meta.defaultMessage
            }
            mappedList.push(rule)
          }
        }

        this.rules.set(mappedList)
        this.loading.set(false)
      },
      error: (err) => {
        this.loading.set(false)
        this.error.set(err.message || 'Erreur lors du chargement des règles de notification')
      }
    })
  }

  private mapRule(rule: any): RuleWithChannels {
    const eventType = rule.eventType ?? rule.EventType
    const channels = rule.channels ?? rule.Channels ?? 0
    const isActive = rule.isActive ?? rule.IsActive ?? true
    const channelNames = rule.channelNames ?? rule.ChannelNames ?? []

    const channelFlags: Record<NotificationChannel, boolean> = {
      [NotificationChannel.Email]: (channels & NotificationChannel.Email) === NotificationChannel.Email,
      [NotificationChannel.Sms]: (channels & NotificationChannel.Sms) === NotificationChannel.Sms,
      [NotificationChannel.Whatsapp]: (channels & NotificationChannel.Whatsapp) === NotificationChannel.Whatsapp,
      [NotificationChannel.Telegram]: (channels & NotificationChannel.Telegram) === NotificationChannel.Telegram,
      [NotificationChannel.Push]: (channels & NotificationChannel.Push) === NotificationChannel.Push,
      [NotificationChannel.InApp]: (channels & NotificationChannel.InApp) === NotificationChannel.InApp,
    }

    const metadata = this.systemCatalog.find(m => m.eventType === eventType)

    return { 
      eventType, 
      channels, 
      isActive, 
      channelNames, 
      channelFlags,
      metadata,
      customTemplate: metadata?.defaultMessage || ''
    }
  }

  getChannelKeys(rule: RuleWithChannels): NotificationChannel[] {
    return this.allChannels
  }

  toggleChannel(rule: RuleWithChannels, channel: NotificationChannel) {
    rule.channelFlags[channel] = !rule.channelFlags[channel]
    rule.channels = this.computeChannels(rule.channelFlags)
  }

  private computeChannels(flags: Partial<Record<NotificationChannel, boolean>>): number {
    let value = 0
    for (const [ch, enabled] of Object.entries(flags)) {
      if (enabled) value |= Number(ch)
    }
    return value
  }

  async saveRule(rule: RuleWithChannels) {
    this.saving.set(rule.eventType)
    try {
      await this.notificationService.upsertRule(rule.eventType, rule.channels, rule.isActive).toPromise()
      this.showSuccess('Règle sauvegardée avec succès.')
    } catch (e: any) {
      console.error('Failed to save rule', e)
      this.error.set(e?.error?.error || 'Erreur lors de la sauvegarde de la règle')
    } finally {
      this.saving.set(null)
    }
  }

  onIsActiveChange(rule: RuleWithChannels) {
    this.saveRule(rule)
  }

  // --- Gestion du Template & Modal ---
  openTemplateEdit(rule: RuleWithChannels) {
    this.selectedRuleForEdit = rule
    this.editCustomText = rule.customTemplate || rule.metadata?.defaultMessage || ''
    this.showEditModal = true
  }

  closeTemplateEdit() {
    this.showEditModal = false
    this.selectedRuleForEdit = null
  }

  insertPlaceholder(ph: string) {
    this.editCustomText = (this.editCustomText ? this.editCustomText + ' ' : '') + ph
  }

  async saveTemplateModal() {
    if (!this.selectedRuleForEdit) return
    const rule = this.selectedRuleForEdit
    rule.customTemplate = this.editCustomText
    this.saving.set(rule.eventType)
    try {
      await this.notificationService.upsertRule(rule.eventType, rule.channels, rule.isActive).toPromise()
      this.showSuccess('Modèle et canaux mis à jour avec succès.')
      this.closeTemplateEdit()
    } catch (e: any) {
      this.error.set(e?.error?.error || 'Erreur lors de la sauvegarde du modèle.')
    } finally {
      this.saving.set(null)
    }
  }

  getEventTypeLabel(rule: RuleWithChannels): string {
    if (rule.metadata?.label) return rule.metadata.label
    return rule.eventType
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/Event$|Integration$|Created$/i, '')
      .trim()
  }

  private showSuccess(msg: string) {
    this.successMessage.set(msg)
    setTimeout(() => this.successMessage.set(null), 4000)
  }
}