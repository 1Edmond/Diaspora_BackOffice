import { Component, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { MarketplaceService } from '@core/services/marketplace.service'

@Component({
  selector: 'app-marketplace-dashboard',
  standalone: true,
  imports: [PageBreadcrumb, RouterLink, Icon],
  templateUrl: './marketplace-dashboard.html',
  styles: ``,
})
export class MarketplaceDashboard implements OnInit {
  stats = {
    totalListings: 0,
    pendingListings: 0,
    totalRequests: 0,
    totalCategories: 0,
  }
  loading = true

  constructor(
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit() {
    this.loadStats()
  }

  loadStats() {
    this.marketplaceService.getListings({ page: 1, pageSize: 1 }).subscribe({
      next: (res) => { this.stats.totalListings = res.totalCount; this.loading = false },
      error: () => { this.loading = false },
    })
    this.marketplaceService.getPendingListings(1, 1).subscribe({
      next: (res) => { this.stats.pendingListings = res.totalCount },
      error: () => {},
    })
    this.marketplaceService.getReceivedRequests(1, 1).subscribe({
      next: (res) => { this.stats.totalRequests = res.totalCount },
      error: () => {},
    })
    this.marketplaceService.getCategories(false).subscribe({
      next: (res) => { this.stats.totalCategories = res.length },
      error: () => {},
    })
  }
}
