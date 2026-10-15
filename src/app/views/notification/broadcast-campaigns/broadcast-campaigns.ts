import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb';
import { Icon } from '@app/components/icon/icon';
import { NotificationService } from '@core/services/notification.service';
import { ProfileService } from '@core/services/profile.service';
import { ProfileTypeDto } from '@core/models/profile/profile.model';

interface SentCampaign {
  id: string;
  title: string;
  message: string;
  channel: string;
  targetRole: string;
  sentAt: Date;
}

@Component({
  selector: 'app-broadcast-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumb, Icon, DatePipe],
  templateUrl: './broadcast-campaigns.html',
})
export class BroadcastCampaignsComponent implements OnInit {
  // Champs du formulaire
  title = '';
  message = '';
  channel = 'All'; // 'InApp', 'Push', 'Email', 'All'
  targetRole = 'All'; // 'All', 'Citizen', 'Provider', 'Freelancer'
  selectedProfileTypeId = '';

  profileTypes: ProfileTypeDto[] = [];
  sending = false;
  successMessage = '';
  errorMessage = '';

  recentCampaigns: SentCampaign[] = [];

  constructor(
    private notificationService: NotificationService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.loadProfileTypes();
  }

  loadProfileTypes() {
    this.profileService.getProfileTypes().subscribe({
      next: (types) => (this.profileTypes = types || []),
      error: () => {},
    });
  }

  sendCampaign() {
    if (!this.title.trim() || !this.message.trim()) {
      this.errorMessage = 'Le titre et le message de la campagne sont obligatoires.';
      return;
    }

    if (!confirm(`Confirmez-vous l'envoi immédiat de cette campagne de diffusion (${this.channel}) aux utilisateurs ciblés ?`)) {
      return;
    }

    this.sending = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      title: this.title.trim(),
      message: this.message.trim(),
      channel: this.channel,
      targetRole: this.targetRole,
      profileTypeId: this.selectedProfileTypeId || undefined,
    };

    this.notificationService.broadcastCampaign(payload).subscribe({
      next: (res) => {
        this.sending = false;
        this.successMessage = `Campagne diffusée avec succès (Réf: ${res.id || 'N/A'}).`;
        this.recentCampaigns.unshift({
          id: res.id || 'ID-' + Date.now(),
          title: this.title,
          message: this.message,
          channel: this.channel,
          targetRole: this.targetRole,
          sentAt: new Date(),
        });

        // Reset formulaire
        this.title = '';
        this.message = '';
      },
      error: (err) => {
        this.sending = false;
        this.errorMessage = err?.error?.error || 'Erreur lors de la diffusion de la campagne.';
      },
    });
  }
}
