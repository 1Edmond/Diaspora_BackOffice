import { Component, OnInit } from '@angular/core'
import { DatePipe, CurrencyPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import { ServiceListingSummaryDto } from '@core/models/marketplace/marketplace.model'

@Component({
  selector: 'app-pending-listings',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, CurrencyPipe, RouterLink, Icon],
  templateUrl: './pending-listings.html',
  styles: ``,
})
export class PendingListings implements OnInit {
  listings: ServiceListingSummaryDto[] = []
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  loading = false

  constructor(
    private marketplaceService: MarketplaceService,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadPending()
  }

  loadPending() {
    this.loading = true
    this.marketplaceService.getPendingListings(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.listings = res.items
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  async approve(id: string) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Approuver l\'annonce',
      message: 'Voulez-vous approuver cette annonce en attente ?',
      confirmText: 'Approuver',
      variant: 'success'
    })
    if (!confirmed) return
    this.marketplaceService.approveListing(id).subscribe({
      next: () => {
        this.toast.success('Annonce approuvée.')
        this.loadPending()
      },
      error: () => this.toast.error('Erreur lors de l\'approbation.'),
    })
  }

  async reject(id: string) {
    const reason = await this.confirmModal.prompt({
      title: 'Rejeter l\'annonce',
      message: 'Veuillez indiquer le motif du rejet :',
      inputPlaceholder: 'Motif du rejet...',
      confirmText: 'Rejeter',
      variant: 'danger'
    })
    if (reason == null) return
    this.marketplaceService.rejectListing(id, reason).subscribe({
      next: () => {
        this.toast.success('Annonce rejetée.')
        this.loadPending()
      },
      error: () => this.toast.error('Erreur lors du rejet.'),
    })
  }

  onPageChange(page: number) {
    this.page = page
    this.loadPending()
  }
}
