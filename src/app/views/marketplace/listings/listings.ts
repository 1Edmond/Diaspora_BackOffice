import { Component, OnInit, signal, computed, OnDestroy } from '@angular/core'
import { DecimalPipe, DatePipe, CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import {
  ListingStatus,
  ListingStatusLabels,
  ListingStatusBadgeVariants,
  PaymentMode,
  PaymentModeLabels,
  ServiceListingSummaryDto,
} from '@core/models/marketplace/marketplace.model'
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs'

interface ListingWithActions extends ServiceListingSummaryDto {
  selected?: boolean
}

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, FormsModule, PageBreadcrumb, Icon],
  templateUrl: './listings.html',
  styles: ``,
})
export class Listings implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()
  private searchSubject = new Subject<string>()

  listings = signal<any[]>([])
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  loading = false
  error = ''

  search = ''
  categoryId = ''
  statusFilter: number | null = null
  paymentModeFilter: 0 | 1 | 2 | null = null
  cityFilter = ''
  countryFilter = ''
  providerFilter = ''
  minPrice: number | null = null
  maxPrice: number | null = null
  sortBy = 0
  showFilters = false

  bulkActionLoading = false
  selectedCount = computed(() => this.listings().filter(l => l.selected).length)
  allSelected = computed(() => this.listings().length > 0 && this.listings().every(l => l.selected))

  detailListing: any = null
  detailLoading = false
  detailError = ''

  ListingStatus = ListingStatus
  ListingStatusLabels = ListingStatusLabels
  ListingStatusBadgeVariants = ListingStatusBadgeVariants
  PaymentModeLabels = PaymentModeLabels

  statusOptions = [
    { value: null, label: 'Tous les statuts' },
    { value: 0, label: 'En attente' },
    { value: 1, label: 'Validée' },
    { value: 2, label: 'Rejetée' },
    { value: 3, label: 'Suspendue' },
  ]

  categories: { id: string; name: string }[] = []

  constructor(
    private marketplaceService: MarketplaceService,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.page = 1
      this.loadListings()
    })
    this.loadListings()
    this.loadCategories()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadCategories() {
    this.marketplaceService.getCategories(false).subscribe({
      next: (res) => { this.categories = res },
      error: () => {}
    })
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value)
  }

  loadListings() {
    this.loading = true
    this.error = ''

    const query: any = {
      page: this.page,
      pageSize: this.pageSize,
      search: this.search || undefined,
      categoryId: this.categoryId || undefined,
      status: this.statusFilter ?? undefined,
      paymentMode: this.paymentModeFilter ?? undefined,
      city: this.cityFilter || undefined,
      country: this.countryFilter || undefined,
      minPrice: this.minPrice ?? undefined,
      maxPrice: this.maxPrice ?? undefined,
      sortBy: this.sortBy,
      providerId: this.providerFilter || undefined,
    }

    this.marketplaceService.getAllListingsAdmin(query).subscribe({
      next: (res) => {
        let items = res.items || []
        if (this.providerFilter?.trim()) {
          const pf = this.providerFilter.trim().toLowerCase()
          items = items.filter(
            (l) =>
              (l.providerName && l.providerName.toLowerCase().includes(pf)) ||
              (l.providerId && l.providerId.toLowerCase().includes(pf))
          )
        }
        this.listings.set(items.map((l) => ({ ...l, selected: false })))
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Échec du chargement des annonces'
      }
    })
  }

  onPageChange(page: number) {
    this.page = page
    this.loadListings()
  }

  toggleSelect(listing: any) {
    listing.selected = !listing.selected
  }

  toggleSelectAll() {
    const selectAll = !this.allSelected()
    this.listings.update(list => list.map(l => ({ ...l, selected: selectAll })))
  }

  canBulkApprove(): boolean {
    return this.listings().some(l => l.selected && l.status === 0)
  }

  canBulkReject(): boolean {
    return this.listings().some(l => l.selected && l.status === 0)
  }

  canBulkSuspend(): boolean {
    return this.listings().some(l => l.selected && l.status === 1)
  }

  async bulkApprove() {
    const selected = this.listings().filter(l => l.selected && l.status === 0)
    if (selected.length === 0) return
    const confirmed = await this.confirmModal.confirm({
      title: 'Approuver la sélection',
      message: `Voulez-vous approuver ${selected.length} annonce(s) sélectionnée(s) ?`,
      confirmText: 'Approuver',
      variant: 'success'
    })
    if (!confirmed) return
    this.bulkActionLoading = true
    for (const l of selected) {
      try {
        await this.marketplaceService.approveListing(l.id).toPromise()
      } catch (e) {
        console.error('Failed to approve listing', e)
      }
    }
    this.bulkActionLoading = false
    this.toast.success(`${selected.length} annonce(s) approuvée(s).`)
    this.loadListings()
  }

  async bulkReject() {
    const selected = this.listings().filter(l => l.selected && l.status === 0)
    if (selected.length === 0) return
    const reason = await this.confirmModal.prompt({
      title: 'Rejeter la sélection',
      message: `Indiquez le motif de rejet pour les ${selected.length} annonce(s) sélectionnée(s) :`,
      inputPlaceholder: 'Motif du rejet...',
      confirmText: 'Rejeter',
      variant: 'danger'
    })
    if (!reason) return
    this.bulkActionLoading = true
    for (const l of selected) {
      try {
        await this.marketplaceService.rejectListing(l.id, reason).toPromise()
      } catch (e) {
        console.error('Failed to reject listing', e)
      }
    }
    this.bulkActionLoading = false
    this.toast.success(`${selected.length} annonce(s) rejetée(s).`)
    this.loadListings()
  }

  async bulkSuspend() {
    const selected = this.listings().filter(l => l.selected && l.status === 1)
    if (selected.length === 0) return
    const confirmed = await this.confirmModal.confirm({
      title: 'Suspendre la sélection',
      message: `Voulez-vous suspendre ${selected.length} annonce(s) sélectionnée(s) ?`,
      confirmText: 'Suspendre',
      variant: 'warning'
    })
    if (!confirmed) return
    this.bulkActionLoading = true
    for (const l of selected) {
      try {
        await this.marketplaceService.suspendListing(l.id).toPromise()
      } catch (e) {
        console.error('Failed to suspend listing', e)
      }
    }
    this.bulkActionLoading = false
    this.toast.success(`${selected.length} annonce(s) suspendue(s).`)
    this.loadListings()
  }

  async bulkDelete() {
    const selected = this.listings().filter(l => l.selected)
    if (selected.length === 0) return
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer la sélection',
      message: `Voulez-vous vraiment supprimer ${selected.length} annonce(s) ?`,
      confirmText: 'Supprimer',
      variant: 'danger'
    })
    if (!confirmed) return
    this.bulkActionLoading = true
    for (const l of selected) {
      try {
        await this.marketplaceService.deleteListing(l.id).toPromise()
      } catch (e) {
        console.error('Failed to delete listing', e)
      }
    }
    this.bulkActionLoading = false
    this.toast.success(`${selected.length} annonce(s) supprimée(s).`)
    this.loadListings()
  }

  async approveSingle(id: string) {
    try {
      await this.marketplaceService.approveListing(id).toPromise()
      this.toast.success('Annonce approuvée.')
      this.loadListings()
    } catch (e) {
      console.error('Failed to approve', e)
      this.toast.error('Erreur lors de l\'approbation.')
    }
  }

  async rejectSingle(id: string) {
    const reason = await this.confirmModal.prompt({
      title: 'Rejeter l\'annonce',
      message: 'Veuillez indiquer le motif du rejet :',
      inputPlaceholder: 'Motif du rejet...',
      confirmText: 'Rejeter',
      variant: 'danger'
    })
    if (!reason) return
    try {
      await this.marketplaceService.rejectListing(id, reason).toPromise()
      this.toast.success('Annonce rejetée.')
      this.loadListings()
    } catch (e) {
      console.error('Failed to reject', e)
      this.toast.error('Erreur lors du rejet.')
    }
  }

  async suspendSingle(id: string) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Suspendre l\'annonce',
      message: 'Voulez-vous suspendre cette annonce ?',
      confirmText: 'Suspendre',
      variant: 'warning'
    })
    if (!confirmed) return
    try {
      await this.marketplaceService.suspendListing(id).toPromise()
      this.toast.success('Annonce suspendue.')
      this.loadListings()
    } catch (e) {
      console.error('Failed to suspend', e)
      this.toast.error('Erreur lors de la suspension.')
    }
  }

  async deleteSingle(id: string) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer l\'annonce',
      message: 'Voulez-vous vraiment supprimer cette annonce ?',
      confirmText: 'Supprimer',
      variant: 'danger'
    })
    if (!confirmed) return
    try {
      await this.marketplaceService.deleteListing(id).toPromise()
      this.toast.success('Annonce supprimée.')
      this.loadListings()
    } catch (e) {
      console.error('Failed to delete', e)
      this.toast.error('Erreur lors de la suppression.')
    }
  }

  openDetail(listing: any) {
    this.detailListing = listing
    this.detailLoading = true
    this.detailError = ''
    this.marketplaceService.getListing(listing.id).subscribe({
      next: (res) => {
        this.detailListing = { ...this.detailListing!, ...res }
        this.detailLoading = false
      },
      error: (err) => {
        this.detailLoading = false
        this.detailError = err.error?.error || err.error?.message || 'Failed to load details'
      }
    })
  }

  closeDetail() {
    this.detailListing = null
  }

  onProviderClick(providerId: string) {
    window.open(`/identity/users/${providerId}`, '_blank')
  }

  clearFilters() {
    this.search = ''
    this.categoryId = ''
    this.statusFilter = null
    this.paymentModeFilter = null
    this.cityFilter = ''
    this.countryFilter = ''
    this.providerFilter = ''
    this.minPrice = null
    this.maxPrice = null
    this.sortBy = 0
    this.page = 1
    this.loadListings()
  }

  hasActiveFilters(): boolean {
    return !!(
      this.search ||
      this.categoryId ||
      this.statusFilter !== null ||
      this.paymentModeFilter !== null ||
      this.cityFilter ||
      this.countryFilter ||
      this.providerFilter ||
      this.minPrice != null ||
      this.maxPrice != null
    )
  }

  getStatusBadge(status: number): string {
    return ListingStatusBadgeVariants[status as ListingStatus] || 'secondary'
  }

  getStatusLabel(status: number): string {
    return ListingStatusLabels[status as ListingStatus] || 'Unknown'
  }

  getPaymentModeLabel(mode: number): string {
    return PaymentModeLabels[mode as PaymentMode] || 'Unknown'
  }
}
