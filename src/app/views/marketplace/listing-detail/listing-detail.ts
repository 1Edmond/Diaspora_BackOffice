import { Component, OnInit } from '@angular/core'
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
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
    private marketplaceService: MarketplaceService,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
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

  async approve() {
    if (!this.listing) return
    const confirmed = await this.confirmModal.confirm({
      title: 'Approuver l\'annonce',
      message: `Voulez-vous approuver l'annonce "${this.listing.title}" ?`,
      confirmText: 'Approuver',
      variant: 'success'
    })
    if (!confirmed) return
    this.marketplaceService.approveListing(this.listing.id).subscribe({
      next: (res) => {
        this.success = res.message || 'Annonce approuvée'
        this.toast.success(this.success)
        this.reload()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Erreur lors de l\'approbation'
        this.toast.error(this.error)
      },
    })
  }

  async reject() {
    if (!this.listing) return
    const reason = await this.confirmModal.prompt({
      title: 'Rejeter l\'annonce',
      message: 'Veuillez indiquer le motif du rejet :',
      inputPlaceholder: 'Motif du rejet...',
      confirmText: 'Rejeter',
      variant: 'danger'
    })
    if (reason == null) return
    this.marketplaceService.rejectListing(this.listing.id, reason).subscribe({
      next: (res) => {
        this.success = res.message || 'Annonce rejetée'
        this.toast.success(this.success)
        this.reload()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Erreur lors du rejet'
        this.toast.error(this.error)
      },
    })
  }

  async suspend() {
    if (!this.listing) return
    const confirmed = await this.confirmModal.confirm({
      title: 'Suspendre l\'annonce',
      message: `Voulez-vous suspendre l'annonce "${this.listing.title}" ?`,
      confirmText: 'Suspendre',
      variant: 'warning'
    })
    if (!confirmed) return
    this.marketplaceService.suspendListing(this.listing.id).subscribe({
      next: (res) => {
        this.success = res.message || 'Annonce suspendue'
        this.toast.success(this.success)
        this.reload()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Erreur lors de la suspension'
        this.toast.error(this.error)
      },
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
