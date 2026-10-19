import { Component, OnInit, signal } from '@angular/core'
import { CommonModule, DecimalPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ProfileSearchDropdown } from '@shared/components/profile-search-dropdown/profile-search-dropdown'

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
  imports: [CommonModule, PageBreadcrumb, FormsModule, Icon, DecimalPipe, ProfileSearchDropdown],
  templateUrl: './providers.html',
  styles: ``,
})
export class Providers implements OnInit {
  stats = signal<StatsView | null>(null)
  loading = false
  error = ''
  selectedProviderId = ''
  searchedProviderId = ''

  constructor(private marketplaceService: MarketplaceService) {}

  ngOnInit() {}

  onProfileSelect(profileId: string) {
    this.selectedProviderId = profileId
    this.searchProvider()
  }

  searchProvider() {
    const providerId = (this.selectedProviderId || '').trim()
    if (!providerId) {
      this.error = 'Veuillez sélectionner un prestataire.'
      return
    }

    this.loading = true
    this.error = ''

    this.marketplaceService.getProviderStats(providerId).subscribe({
      next: (res) => {
        this.stats.set(res)
        this.searchedProviderId = providerId
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Prestataire introuvable ou aucune donnée disponible.'
        this.stats.set(null)
      }
    })
  }

  clearSearch() {
    this.selectedProviderId = ''
    this.stats.set(null)
    this.searchedProviderId = ''
    this.error = ''
  }

  viewListings() {
    if (this.searchedProviderId) {
      window.open(`/marketplace/listings?providerId=${this.searchedProviderId}`, '_blank')
    }
  }

  viewRequests() {
    if (this.searchedProviderId) {
      window.open(`/marketplace/requests?providerId=${this.searchedProviderId}`, '_blank')
    }
  }

  viewProfile() {
    if (this.searchedProviderId) {
      window.open(`/profiles/${this.searchedProviderId}`, '_blank')
    }
  }
}