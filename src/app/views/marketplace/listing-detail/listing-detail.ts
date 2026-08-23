import { Component, OnInit } from '@angular/core'
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ServiceListingDto } from '@core/models/marketplace/marketplace.model'
import { ListingStatus, ListingStatusLabels, ListingStatusBadgeVariants, PaymentModeLabels } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, CurrencyPipe, DecimalPipe, RouterLink, Icon],
  templateUrl: './listing-detail.html',
  styles: ``,
})
export class ListingDetail implements OnInit {
  listing: ServiceListingDto | null = null
  loading = true
  error = ''
  success = ''

  ListingStatus = ListingStatus
  ListingStatusLabels = ListingStatusLabels
  ListingStatusBadgeVariants = ListingStatusBadgeVariants
  PaymentModeLabels = PaymentModeLabels

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!
    this.marketplaceService.getListing(id).subscribe({
      next: (l) => {
        this.listing = l
        this.loading = false
      },
      error: () => {
        this.loading = false
        this.router.navigate(['/marketplace/listings'])
      },
    })
  }

  approve() {
    if (!this.listing) return
    this.marketplaceService.approveListing(this.listing.id).subscribe({
      next: (res) => {
        this.success = res.message || 'Listing approved'
        this.reload()
      },
      error: (err: any) => { this.error = err.error?.error || err.error?.message || 'Failed to approve' },
    })
  }

  reject() {
    if (!this.listing) return
    const reason = prompt('Rejection reason:')
    if (reason == null) return
    this.marketplaceService.rejectListing(this.listing.id, reason).subscribe({
      next: (res) => {
        this.success = res.message || 'Listing rejected'
        this.reload()
      },
      error: (err: any) => { this.error = err.error?.error || err.error?.message || 'Failed to reject' },
    })
  }

  suspend() {
    if (!this.listing) return
    this.marketplaceService.suspendListing(this.listing.id).subscribe({
      next: (res) => {
        this.success = res.message || 'Listing suspended'
        this.reload()
      },
      error: (err: any) => { this.error = err.error?.error || err.error?.message || 'Failed to suspend' },
    })
  }

  reload() {
    const id = this.route.snapshot.paramMap.get('id')!
    this.marketplaceService.getListing(id).subscribe({
      next: (l) => { this.listing = l },
      error: () => {},
    })
  }

  clearMessages() {
    this.error = ''
    this.success = ''
  }
}
