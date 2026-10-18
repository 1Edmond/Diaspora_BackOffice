import { Component, OnInit } from '@angular/core'
import { DatePipe, CurrencyPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import { ServiceRequestDto, AdminServiceRequestQuery } from '@core/models/marketplace/marketplace.model'
import {
  ServiceRequestStatus,
  ServiceRequestStatusLabels,
  ServiceRequestStatusBadgeVariants,
  PaymentStatus,
  PaymentStatusLabels,
  PaymentStatusBadgeVariants,
} from '@core/models/shared/enums.model'
import {
  PaymentSettlementType,
  DirectCashTiming,
  DirectCashTimingLabels,
} from '@core/models/marketplace/payment-policy.model'

@Component({
  selector: 'app-service-requests',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, CurrencyPipe, FormsModule, Icon],
  templateUrl: './service-requests.html',
  styles: ``,
})
export class ServiceRequests implements OnInit {
  requests: ServiceRequestDto[] = []
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  loading = false
  selectedStatus: number | null = null
  selectedPaymentStatus: number | null = null

  selectedRequest: ServiceRequestDto | null = null

  ServiceRequestStatus = ServiceRequestStatus
  ServiceRequestStatusLabels = ServiceRequestStatusLabels
  ServiceRequestStatusBadgeVariants = ServiceRequestStatusBadgeVariants
  PaymentStatusLabels = PaymentStatusLabels
  PaymentStatusBadgeVariants = PaymentStatusBadgeVariants
  PaymentSettlementType = PaymentSettlementType
  DirectCashTiming = DirectCashTiming
  DirectCashTimingLabels = DirectCashTimingLabels

  getCashTimingLabel(timing?: number): string {
    if (timing === DirectCashTiming.AtPickup) return 'À la remise'
    if (timing === DirectCashTiming.AtDelivery) return 'À la livraison'
    if (timing === DirectCashTiming.FreeChoice) return 'Libre choix'
    return 'Non précisé'
  }

  constructor(
    private marketplaceService: MarketplaceService,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadRequests()
  }

  loadRequests() {
    this.loading = true
    const query: AdminServiceRequestQuery = {
      page: this.page,
      pageSize: this.pageSize,
      status: this.selectedStatus != null ? (this.selectedStatus as ServiceRequestStatus) : undefined,
      paymentStatus: this.selectedPaymentStatus != null ? (this.selectedPaymentStatus as PaymentStatus) : undefined,
    }
    this.marketplaceService.getAllServiceRequestsAdmin(query).subscribe({
      next: (res) => {
        this.requests = res.items
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  onFilterChange() {
    this.page = 1
    this.loadRequests()
  }

  viewDetail(req: ServiceRequestDto) {
    this.selectedRequest = req
  }

  closeDetail() {
    this.selectedRequest = null
  }

  async cancel(id: string) {
    const reason = await this.confirmModal.prompt({
      title: 'Annuler la demande de service',
      message: 'Veuillez indiquer le motif administratif de l\'annulation :',
      inputLabel: 'Motif d\'annulation',
      inputPlaceholder: 'Ex: Demande frauduleuse ou à la demande des parties...',
      confirmText: 'Annuler la demande',
      variant: 'danger',
      icon: 'x',
    })
    if (!reason) return
    this.marketplaceService.cancelServiceRequest(id, reason).subscribe({
      next: () => {
        this.toast.warning('Demande annulée.')
        this.loadRequests()
      },
      error: () => {
        this.toast.error('Erreur lors de l\'annulation.')
      },
    })
  }

  onPageChange(page: number) {
    this.page = page
    this.loadRequests()
  }
}
