import { Component, OnInit, signal, computed } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ProviderStatsDto } from '@core/models/marketplace/marketplace.model'
import { DecimalPipe } from '@angular/common'

interface StatsView {
  totalListings: number
  activeListings: number
  totalRequests: number
  acceptedRequests: number
  completedRequests: number
  acceptanceRate: number
  avgResponseHours: number | null
  totalRevenue: number
  averageRating: number
  reviewCount: number
  favoritesCount: number
}

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule, Icon, DecimalPipe],
  templateUrl: './providers.html',
  styles: ``,
})
export class Providers implements OnInit {
  stats = signal<StatsView | null>(null)
  loading = false
  error = ''
  search = ''
  searchedProviderId = ''

  constructor(private marketplaceService: MarketplaceService) {}

  ngOnInit() {}

  onSearchChange(value: string) {
    this.search = value
  }

  searchProvider() {
    if (!this.search.trim()) return

    this.loading = true
    this.error = ''

    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const providerId = guidRegex.test(this.search.trim()) ? this.search.trim() : ''

    if (!providerId) {
      this.error = 'Please enter a valid Provider ID (GUID)'
      this.loading = false
      return
    }

    this.marketplaceService.getProviderStats(providerId).subscribe({
      next: (res) => {
        this.stats.set(res)
        this.searchedProviderId = providerId
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Provider not found'
        this.stats.set(null)
      }
    })
  }

  clearSearch() {
    this.search = ''
    this.stats.set(null)
    this.searchedProviderId = ''
    this.error = ''
  }

  viewListings() {
    if (this.searchedProviderId) {
      window.open(`/marketplace/listings?providerId=${this.searchedProviderId}`, '_blank')
    }
  }
}