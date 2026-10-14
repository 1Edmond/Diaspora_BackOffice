import { Component, OnInit, Input, signal } from '@angular/core'
import { DatePipe, DecimalPipe, CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Icon } from '@app/components/icon/icon'
import { RouterLink } from '@angular/router'
import { ProfileService } from '@core/services/profile.service'
import { ServiceListingSummaryDto } from '@core/models/marketplace/marketplace.model'
import {
  ListingStatus,
  ListingStatusLabels,
  ListingStatusBadgeVariants,
  PaymentMode,
  PaymentModeLabels,
} from '@core/models/shared/enums.model'
import { BaseResponse, PagedList } from '@core/models/shared/base-response.model'
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs'

@Component({
  selector: 'app-profile-services-tab',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, FormsModule, Icon, RouterLink],
  templateUrl: './profile-services-tab.html',
  styles: ``,
})
export class ProfileServicesTab implements OnInit {
  @Input() profileId!: string
  @Input() userId!: string

  private destroy$ = new Subject<void>()
  private searchSubject = new Subject<string>()

  listings = signal<ServiceListingSummaryDto[]>([])
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  loading = false
  error = ''

  search = ''
  statusFilter: number | null = null

  ListingStatus = ListingStatus
  ListingStatusLabels = ListingStatusLabels
  ListingStatusBadgeVariants = ListingStatusBadgeVariants
  PaymentModeLabels = PaymentModeLabels

  statusOptions = [
    { value: null, label: 'All' },
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Approved' },
    { value: 2, label: 'Rejected' },
    { value: 3, label: 'Suspended' },
  ]

  constructor(private profileService: ProfileService) {}

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
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadListings() {
    this.loading = true
    this.error = ''

    this.profileService.getListingsByProvider(this.profileId, this.page, this.pageSize).subscribe({
      next: (res) => {
        this.listings.set(res.items)
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: (err: any) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Failed to load listings'
      }
    })
  }

  onPageChange(page: number) {
    this.page = page
    this.loadListings()
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value)
  }

  onStatusChange() {
    this.page = 1
    this.loadListings()
  }

  getStatusBadge(status: number): string {
    return this.ListingStatusBadgeVariants[status as ListingStatus] || 'secondary'
  }

  getStatusLabel(status: number): string {
    return this.ListingStatusLabels[status as ListingStatus] || 'Unknown'
  }

  getPaymentModeLabel(mode: number): string {
    return this.PaymentModeLabels[mode as PaymentMode] || 'Unknown'
  }
}