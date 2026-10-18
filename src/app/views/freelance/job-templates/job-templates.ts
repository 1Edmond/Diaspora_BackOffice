import { Component, OnInit } from '@angular/core'
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { FreelanceService } from '@core/services/freelance.service'
import { ToastService } from '@core/services/toast.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import {
  JobTemplateDto,
  PaymentType,
  PaymentTiming,
  CheckInMethod,
} from '@core/models/freelance/freelance.model'

@Component({
  selector: 'app-job-templates',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, PageBreadcrumb, Icon],
  templateUrl: './job-templates.html',
  styles: [`
    .template-card {
      border: 1px solid #e9ebec;
      border-radius: 8px;
      transition: all 0.2s ease;
      background: #ffffff;
    }
    .template-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border-color: #405189;
    }
  `],
})
export class JobTemplatesComponent implements OnInit {
  templates: JobTemplateDto[] = []
  page = 1
  pageSize = 12
  totalCount = 0
  totalPages = 1
  loading = false

  paymentTypeLabels: Record<number, string> = {
    [PaymentType.Fixed]: 'Forfait fixe',
    [PaymentType.Hourly]: 'Taux horaire',
    [PaymentType.Daily]: 'Taux journalier',
  }

  paymentTimingLabels: Record<number, string> = {
    [PaymentTiming.HoldFundsUpfront]: 'Séquestre préalable',
    [PaymentTiming.PayOnCompletion]: 'Paiement à la livraison',
  }

  checkInMethodLabels: Record<number, string> = {
    [CheckInMethod.None]: 'Aucun pointage',
    [CheckInMethod.QRCode]: 'QR Code',
    [CheckInMethod.GeoLocation]: 'Géolocalisation',
    [CheckInMethod.Manual]: 'Pointage manuel',
  }

  constructor(
    private freelanceService: FreelanceService,
    private toast: ToastService,
    private confirmModal: ConfirmModalService
  ) {}

  ngOnInit() {
    this.loadTemplates()
  }

  loadTemplates() {
    this.loading = true
    this.freelanceService.getJobTemplatesAdmin(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.templates = res.items
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: () => {
        this.toast.error('Erreur lors du chargement des modèles de mission.')
        this.loading = false
      },
    })
  }

  onPageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return
    this.page = newPage
    this.loadTemplates()
  }

  async deleteTemplate(template: JobTemplateDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer ce modèle de mission ?',
      message: `Voulez-vous vraiment supprimer le modèle "${template.title}" ?`,
      confirmText: 'Supprimer le modèle',
      cancelText: 'Annuler',
      variant: 'danger',
      icon: 'trash-2',
    })

    if (!confirmed) return

    this.freelanceService.deleteJobTemplate(template.id).subscribe({
      next: () => {
        this.toast.success('Modèle de mission supprimé avec succès.')
        this.loadTemplates()
      },
      error: () => {
        this.toast.error('Erreur lors de la suppression du modèle.')
      },
    })
  }
}
