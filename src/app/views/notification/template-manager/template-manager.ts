import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb';
import { NotificationService } from '@core/services/notification.service';
import { NotificationRuleDto } from '@core/models/notification/notification.model';

interface SystemTemplate {
  eventType: string;
  label: string;
  category: string;
  defaultMessage: string;
  supportedPlaceholders: string[];
}

@Component({
  selector: 'app-template-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumb],
  templateUrl: './template-manager.html',
})
export class TemplateManagerComponent implements OnInit {
  rules: NotificationRuleDto[] = [];
  loading = false;
  saving = false;

  successMessage = '';
  errorMessage = '';

  // Modèle en cours d'édition
  selectedTemplate: SystemTemplate | null = null;
  editInApp = true;
  editPush = true;
  editEmail = false;
  editIsActive = true;
  editCustomText = '';
  showEditModal = false;

  // Catalogue des templates par événement métier
  systemCatalog: SystemTemplate[] = [
    {
      eventType: 'ProfileVerifiedIntegrationEvent',
      label: 'Vérification de Profil Validée',
      category: 'Identité & KYC',
      defaultMessage: 'Félicitations {{userName}}, votre profil a été vérifié avec succès.',
      supportedPlaceholders: ['{{userName}}', '{{countryName}}'],
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
      defaultMessage: 'Les fonds pour la prestation {{serviceTitle}} ont été crédités sur votre portefeuille.',
      supportedPlaceholders: ['{{serviceTitle}}', '{{amount}}', '{{currency}}'],
    },
    {
      eventType: 'DisputeOpenedIntegrationEvent',
      label: 'Ouverture d\'un Litige',
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
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadRules();
  }

  loadRules() {
    this.loading = true;
    this.notificationService.getRules(1, 100).subscribe({
      next: (res) => {
        this.rules = res.items || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getRuleFor(eventType: string): NotificationRuleDto | undefined {
    return this.rules.find((r) => r.eventType === eventType);
  }

  hasChannel(eventType: string, bit: number): boolean {
    const rule = this.getRuleFor(eventType);
    if (!rule) {
      // Par défaut : In-App (bit 1) et Push (bit 2) sont activés
      return bit === 1 || bit === 2;
    }
    return (rule.channels & bit) !== 0;
  }

  openEdit(template: SystemTemplate) {
    this.selectedTemplate = template;
    const existingRule = this.getRuleFor(template.eventType);

    if (existingRule) {
      this.editIsActive = existingRule.isActive;
      // Décomposition des bits de flags de canaux (1=InApp, 2=Push, 4=Email)
      this.editInApp = (existingRule.channels & 1) !== 0;
      this.editPush = (existingRule.channels & 2) !== 0;
      this.editEmail = (existingRule.channels & 4) !== 0;
    } else {
      this.editIsActive = true;
      this.editInApp = true;
      this.editPush = true;
      this.editEmail = false;
    }

    this.editCustomText = template.defaultMessage;
    this.showEditModal = true;
  }

  closeEdit() {
    this.showEditModal = false;
    this.selectedTemplate = null;
  }

  insertPlaceholder(ph: string) {
    this.editCustomText += ' ' + ph;
  }

  saveRule() {
    if (!this.selectedTemplate) return;
    this.saving = true;

    // Calcul du bitmask : InApp=1, Push=2, Email=4
    let channels = 0;
    if (this.editInApp) channels |= 1;
    if (this.editPush) channels |= 2;
    if (this.editEmail) channels |= 4;

    this.notificationService
      .upsertRule(this.selectedTemplate.eventType, channels, this.editIsActive)
      .subscribe({
        next: () => {
          this.saving = false;
          this.closeEdit();
          this.showMessage('success', 'Modèle et règles de notification sauvegardés.');
          this.loadRules();
        },
        error: (err) => {
          this.saving = false;
          this.showMessage('error', err?.error?.error || 'Erreur lors de la sauvegarde.');
        },
      });
  }

  private showMessage(type: 'success' | 'error', msg: string) {
    if (type === 'success') {
      this.successMessage = msg;
      setTimeout(() => (this.successMessage = ''), 5000);
    } else {
      this.errorMessage = msg;
      setTimeout(() => (this.errorMessage = ''), 6000);
    }
  }
}
