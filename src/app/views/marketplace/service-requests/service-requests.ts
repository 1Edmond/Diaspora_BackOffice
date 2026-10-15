import { Component, OnInit } from '@angular/core'
import { DatePipe, CurrencyPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ServiceRequestDto, AdminServiceRequestQuery } from '@core/models/marketplace/marketplace.model'
import {
  ServiceRequestStatus,
  ServiceRequestStatusLabels,
  ServiceRequestStatusBadgeVariants,
  PaymentStatus,
  PaymentStatusLabels,
  PaymentStatusBadgeVariants,
} from '@core/models/shared/enums.model'

@Component({
  selector: 'app-service-requests',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './service-requests.html',
  styles: ``,
})
export class ServiceRequests implements OnInit {
  requests: ServiceRequestDto[] = []
  tab: 'all' | 'received' | 'sent' = 'all'
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

  constructor(
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit() {
    this.loadRequests()
  }

  loadRequests() {
    this.loading = true
    if (this.tab === 'all') {
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
        error: () => { this.loading = false },
      })
    } else {
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
  }

  switchTab(tab: 'all' | 'received' | 'sent') {
    this.tab = tab
    this.page = 1
    this.selectedRequest = null
    this.loadRequests()
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
