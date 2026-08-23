import { Component, OnInit } from '@angular/core'
import { DatePipe, CurrencyPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { MarketplaceService } from '@core/services/marketplace.service'
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
    private marketplaceService: MarketplaceService
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

  approve(id: string) {
    this.marketplaceService.approveListing(id).subscribe({ next: () => this.loadPending(), error: () => {} })
  }

  reject(id: string) {
    const reason = prompt('Rejection reason:')
    if (reason == null) return
    this.marketplaceService.rejectListing(id, reason).subscribe({ next: () => this.loadPending(), error: () => {} })
  }

  onPageChange(page: number) {
    this.page = page
    this.loadPending()
  }
}
