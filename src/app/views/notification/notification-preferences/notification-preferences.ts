import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb';
import { Icon } from '@app/components/icon/icon';
import { NotificationService } from '@core/services/notification.service';
import {
  NotificationRuleDto,
  NotificationChannel,
  NotificationChannelLabels,
  NotificationChannelIcons,
} from '@core/models/notification/notification.model';
import { CommonModule } from '@angular/common';
import { ToastService } from '@core/services/toast.service';

export interface EventMetadata {
  eventType: string;
  label: string;
  category: string;
  defaultMessage: string;
  supportedPlaceholders: string[];
}

export interface RuleWithChannels extends NotificationRuleDto {
  channelFlags: Partial<Record<NotificationChannel, boolean>>;
  metadata?: EventMetadata;
  customTemplate?: string;
}

@Component({
  selector: 'app-notification-preferences',
  standalone: true,
  imports: [CommonModule, PageBreadcrumb, FormsModule, Icon],
  templateUrl: './notification-preferences.html',
  styles: [
    `
      .category-pill {
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .template-preview-box {
        background: #f8fafc;
        border: 1px dashed #cbd5e1;
      }
    `,
  ],
})
export class NotificationPreferences implements OnInit {
  readonly allChannels: NotificationChannel[] = [
    NotificationChannel.InApp,
    NotificationChannel.Push,
    NotificationChannel.Email,
    NotificationChannel.Sms,
    NotificationChannel.Whatsapp,
    NotificationChannel.Telegram,
  ];

  rules = signal<RuleWithChannels[]>([]);
  loading = signal(false);
  saving = signal<string | null>(null);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Filters & Search
  searchTerm = signal('');
  selectedCategory = signal<string>('all');
  statusFilter = signal<'all' | 'active' | 'inactive'>('all');

  readonly channelLabels = NotificationChannelLabels;
  readonly channelIcons = NotificationChannelIcons;

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
      label: "Ouverture d'un Litige Marketplace",
      category: 'Marketplace & Colis',
      defaultMessage: "Un litige a été ouvert pour la commande {{serviceTitle}}. Statut : En cours d'arbitrage.",
      supportedPlaceholders: ['{{serviceTitle}}', '{{reason}}', '{{disputeId}}'],
    },
    {
      eventType: 'JobApplicationAcceptedIntegrationEvent',
      label: 'Candidature Freelance Acceptée',
      category: 'Freelance',
      defaultMessage: "Votre candidature pour la mission {{jobTitle}} a été acceptée par l'employeur !",
      supportedPlaceholders: ['{{jobTitle}}', '{{employerName}}'],
    },
    {
      eventType: 'ServiceRequestCreatedEvent',
      label: 'Nouvelle Demande de Service / Colis',
      category: 'Marketplace & Colis',
      defaultMessage: 'Une nouvelle demande de service ou transport a été initiée pour {{serviceTitle}}.',
      supportedPlaceholders: ['{{serviceTitle}}', '{{requesterName}}'],
    },
  ];

  // Categories list
  categories = computed(() => {
    const set = new Set<string>();
    this.rules().forEach((r) => {
      set.add(r.metadata?.category || 'Système');
    });
    return Array.from(set).sort();
  });

  // Filtered rules computed
  filteredRules = computed(() => {
    let list = this.rules();
    const cat = this.selectedCategory();
    const st = this.statusFilter();
    const term = this.searchTerm().trim().toLowerCase();

    if (cat !== 'all') {
      list = list.filter((r) => (r.metadata?.category || 'Système') === cat);
    }

    if (st === 'active') {
      list = list.filter((r) => r.isActive);
    } else if (st === 'inactive') {
      list = list.filter((r) => !r.isActive);
    }

    if (term) {
      list = list.filter(
        (r) =>
          r.eventType.toLowerCase().includes(term) ||
          this.getEventTypeLabel(r).toLowerCase().includes(term) ||
          (r.customTemplate && r.customTemplate.toLowerCase().includes(term)) ||
          (r.metadata?.category && r.metadata.category.toLowerCase().includes(term))
      );
    }

    return list;
  });

  // Stats
  activeRulesCount = computed(() => this.rules().filter((r) => r.isActive).length);

  // Édition de template via modal
  selectedRuleForEdit: RuleWithChannels | null = null;
  editCustomText = '';
  showEditModal = false;

  constructor(
    private notificationService: NotificationService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadRules();
  }

  loadRules() {
    this.loading.set(true);
    this.error.set(null);
    this.notificationService.getRules(1, 100).subscribe({
      next: (res) => {
        const rawItems = res.items || [];
        const mappedList: RuleWithChannels[] = [];
        const seenEvents = new Set<string>();

        for (const raw of rawItems) {
          const rule = this.mapRule(raw);
          seenEvents.add(rule.eventType);
          mappedList.push(rule);
        }

        for (const meta of this.systemCatalog) {
          if (!seenEvents.has(meta.eventType)) {
            const channelFlags: Record<NotificationChannel, boolean> = {
              [NotificationChannel.Email]: false,
              [NotificationChannel.Sms]: false,
              [NotificationChannel.Whatsapp]: false,
              [NotificationChannel.Telegram]: false,
              [NotificationChannel.Push]: true,
              [NotificationChannel.InApp]: true,
            };
            const rule: RuleWithChannels = {
              eventType: meta.eventType,
              channels: NotificationChannel.InApp | NotificationChannel.Push,
              isActive: true,
              channelNames: ['InApp', 'Push'],
              channelFlags,
              metadata: meta,
              customTemplate: meta.defaultMessage,
            };
            mappedList.push(rule);
          }
        }

        this.rules.set(mappedList);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Erreur lors du chargement des règles de notification');
      },
    });
  }

  private mapRule(rule: any): RuleWithChannels {
    const eventType = rule.eventType ?? rule.EventType;
    const channels = rule.channels ?? rule.Channels ?? 0;
    const isActive = rule.isActive ?? rule.IsActive ?? true;
    const channelNames = rule.channelNames ?? rule.ChannelNames ?? [];

    const channelFlags: Record<NotificationChannel, boolean> = {
      [NotificationChannel.Email]: (channels & NotificationChannel.Email) === NotificationChannel.Email,
      [NotificationChannel.Sms]: (channels & NotificationChannel.Sms) === NotificationChannel.Sms,
      [NotificationChannel.Whatsapp]:
        (channels & NotificationChannel.Whatsapp) === NotificationChannel.Whatsapp,
      [NotificationChannel.Telegram]:
        (channels & NotificationChannel.Telegram) === NotificationChannel.Telegram,
      [NotificationChannel.Push]: (channels & NotificationChannel.Push) === NotificationChannel.Push,
      [NotificationChannel.InApp]: (channels & NotificationChannel.InApp) === NotificationChannel.InApp,
    };

    const metadata = this.systemCatalog.find((m) => m.eventType === eventType);

    return {
      eventType,
      channels,
      isActive,
      channelNames,
      channelFlags,
      metadata,
      customTemplate: metadata?.defaultMessage || '',
    };
  }

  getChannelKeys(rule: RuleWithChannels): NotificationChannel[] {
    return this.allChannels;
  }

  getEventTypeLabel(rule: RuleWithChannels): string {
    return rule.metadata?.label || rule.eventType;
  }

  toggleChannel(rule: RuleWithChannels, channel: NotificationChannel) {
    rule.channelFlags[channel] = !rule.channelFlags[channel];
    let mask = 0;
    for (const ch of this.allChannels) {
      if (rule.channelFlags[ch]) {
        mask |= ch;
      }
    }
    rule.channels = mask;
  }

  onIsActiveChange(rule: RuleWithChannels) {
    this.saveRule(rule);
  }

  saveRule(rule: RuleWithChannels) {
    this.saving.set(rule.eventType);
    this.notificationService
      .upsertRule(rule.eventType, rule.channels, rule.isActive)
      .subscribe({
        next: () => {
          this.saving.set(null);
          this.toastService.show(
            `Préférences mises à jour pour ${this.getEventTypeLabel(rule)}`,
            'success'
          );
        },
        error: (err) => {
          this.saving.set(null);
          this.toastService.show(
            err.error?.error || err.error?.message || "Erreur lors de l'enregistrement",
            'danger'
          );
        },
      });
  }

  openTemplateEdit(rule: RuleWithChannels) {
    this.selectedRuleForEdit = {
      ...rule,
      channelFlags: { ...rule.channelFlags },
    };
    this.editCustomText = rule.customTemplate || rule.metadata?.defaultMessage || '';
    this.showEditModal = true;
  }

  closeTemplateEdit() {
    this.showEditModal = false;
    this.selectedRuleForEdit = null;
    this.editCustomText = '';
  }

  insertPlaceholder(placeholder: string) {
    this.editCustomText += ` ${placeholder}`;
  }

  getLivePreview(): string {
    if (!this.editCustomText) return '';
    return this.editCustomText
      .replace(/{{userName}}/g, 'Mamadou Diallo')
      .replace(/{{countryName}}/g, 'Sénégal')
      .replace(/{{email}}/g, 'mamadou.diallo@example.com')
      .replace(/{{documentTypeName}}/g, 'Passeport biométrique')
      .replace(/{{rejectionReason}}/g, 'Document expiré')
      .replace(/{{serviceTitle}}/g, 'Transport Colis Paris -> Dakar')
      .replace(/{{amount}}/g, '25 000')
      .replace(/{{currency}}/g, 'XOF')
      .replace(/{{buyerName}}/g, 'Fatou Ndiaye')
      .replace(/{{requesterName}}/g, 'Amadou Koné')
      .replace(/{{jobTitle}}/g, 'Développeur Angular')
      .replace(/{{employerName}}/g, 'Diaspora Digital');
  }

  saveTemplateModal() {
    if (!this.selectedRuleForEdit) return;

    const rule = this.selectedRuleForEdit;
    this.saving.set(rule.eventType);

    this.notificationService
      .upsertRule(rule.eventType, rule.channels, rule.isActive)
      .subscribe({
        next: () => {
          this.saving.set(null);
          const currentList = this.rules();
          const targetIndex = currentList.findIndex((r) => r.eventType === rule.eventType);
          if (targetIndex >= 0) {
            currentList[targetIndex].channels = rule.channels;
            currentList[targetIndex].channelFlags = { ...rule.channelFlags };
            currentList[targetIndex].isActive = rule.isActive;
            currentList[targetIndex].customTemplate = this.editCustomText;
            this.rules.set([...currentList]);
          }
          this.toastService.show(
            `Modèle & canaux enregistrés pour "${this.getEventTypeLabel(rule)}"`,
            'success'
          );
          this.closeTemplateEdit();
        },
        error: (err) => {
          this.saving.set(null);
          this.toastService.show(
            err.error?.error || err.error?.message || "Erreur lors de l'enregistrement",
            'danger'
          );
        },
      });
  }
}