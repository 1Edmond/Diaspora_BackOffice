import { Component, OnInit } from '@angular/core'
import { DatePipe, CurrencyPipe } from '@angular/common'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ServiceRequestDto } from '@core/models/marketplace/marketplace.model'
import { ServiceRequestStatus, ServiceRequestStatusLabels, ServiceRequestStatusBadgeVariants, PaymentStatusLabels, PaymentStatusBadgeVariants } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-service-requests',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, CurrencyPipe, Icon],
  templateUrl: './service-requests.html',
  styles: ``,
})
export class ServiceRequests implements OnInit {
  requests: ServiceRequestDto[] = []
  tab: 'received' | 'sent' = 'received'
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  loading = false

  ServiceRequestStatus = ServiceRequestStatus
  ServiceRequestStatusLabels = ServiceRequestStatusLabels
  ServiceRequestStatusBadgeVariants = ServiceRequestStatusBadgeVariants
  PaymentStatusLabels = PaymentStatusLabels
  PaymentStatusBadgeVariants = PaymentStatusBadgeVariants

  constructor(
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit() {
    this.loadRequests()
  }

  loadRequests() {
    this.loading = true
    const obs = this.tab === 'received'
      ? this.marketplaceService.getReceivedRequests(this.page, this.pageSize)
      : this.marketplaceService.getSentRequests(this.page, this.pageSize)

    obs.subscribe({
      next: (res) => {
        this.requests = res.items
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  switchTab(tab: 'received' | 'sent') {
    this.tab = tab
    this.page = 1
    this.loadRequests()
  }

  accept(id: string) {
    this.marketplaceService.acceptServiceRequest(id).subscribe({ next: () => this.loadRequests(), error: () => {} })
  }

  decline(id: string) {
    const reason = prompt('Decline reason:')
    if (reason == null) return
    this.marketplaceService.declineServiceRequest(id, reason).subscribe({ next: () => this.loadRequests(), error: () => {} })
  }

  complete(id: string) {
    this.marketplaceService.completeServiceRequest(id).subscribe({ next: () => this.loadRequests(), error: () => {} })
  }

  cancel(id: string) {
    const reason = prompt('Cancellation reason:')
    if (reason == null) return
    this.marketplaceService.cancelServiceRequest(id, reason).subscribe({ next: () => this.loadRequests(), error: () => {} })
  }

  onPageChange(page: number) {
    this.page = page
    this.loadRequests()
  }
}
