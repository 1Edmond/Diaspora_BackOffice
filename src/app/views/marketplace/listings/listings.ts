import { Component, OnInit } from '@angular/core'
import { CurrencyPipe, DecimalPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ServiceListingSummaryDto } from '@core/models/marketplace/marketplace.model'
import { PaymentModeLabels } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [PageBreadcrumb, CurrencyPipe, DecimalPipe, RouterLink, FormsModule, Icon],
  templateUrl: './listings.html',
  styles: ``,
})
export class Listings implements OnInit {
  listings: ServiceListingSummaryDto[] = []
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  search = ''
  loading = false

  PaymentModeLabels = PaymentModeLabels

  constructor(
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit() {
    this.loadListings()
  }

  loadListings() {
    this.loading = true
    this.marketplaceService.getListings({
      page: this.page,
      pageSize: this.pageSize,
      search: this.search || undefined,
    }).subscribe({
      next: (res) => {
        this.listings = res.items
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  onSearch() {
    this.page = 1
    this.loadListings()
  }

  onDelete(id: string) {
    if (confirm('Delete this listing?')) {
      this.marketplaceService.deleteListing(id).subscribe({
        next: () => this.loadListings(),
        error: () => {},
      })
    }
  }

  onPageChange(page: number) {
    this.page = page
    this.loadListings()
  }
}
