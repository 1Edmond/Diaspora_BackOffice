import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { KycService } from '@core/services/kyc.service'
import { KycVerification } from '@core/models/kyc/kyc.model'
import { KYCStatus, KYCStatusBadgeVariants, KYCStatusLabels } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-kyc-list',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, RouterLink, FormsModule],
  templateUrl: './kyc-list.html',
  styles: ``,
})
export class KycList implements OnInit {
  verifications: KycVerification[] = []
  page = 1
  pageSize = 10
  totalCount = 0
  searchTerm = ''
  statusFilter = ''
  loading = false

  KYCStatus = KYCStatus
  statusLabels = KYCStatusLabels
  statusBadges = KYCStatusBadgeVariants

  statusOptions = [
    { value: KYCStatus.Draft, label: KYCStatusLabels[KYCStatus.Draft] },
    { value: KYCStatus.Pending, label: KYCStatusLabels[KYCStatus.Pending] },
    { value: KYCStatus.UnderReview, label: KYCStatusLabels[KYCStatus.UnderReview] },
    { value: KYCStatus.MoreInfoRequired, label: KYCStatusLabels[KYCStatus.MoreInfoRequired] },
    { value: KYCStatus.Approved, label: KYCStatusLabels[KYCStatus.Approved] },
    { value: KYCStatus.Rejected, label: KYCStatusLabels[KYCStatus.Rejected] },
    { value: KYCStatus.Expired, label: KYCStatusLabels[KYCStatus.Expired] },
    { value: KYCStatus.RequiresUpdate, label: KYCStatusLabels[KYCStatus.RequiresUpdate] },
  ]

  constructor(
    private kycService: KycService
  ) {}

  ngOnInit() {
    this.loadVerifications()
  }

  loadVerifications() {
    this.loading = true
    this.kycService.getVerifications({
      pageNumber: this.page,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      status: this.statusFilter ? (Number(this.statusFilter) as KYCStatus) : undefined,
    }).subscribe({
      next: (res) => {
        this.verifications = res.items
        this.totalCount = res.totalCount
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  onSearch() {
    this.page = 1
    this.loadVerifications()
  }

  onFilterChange() {
    this.page = 1
    this.loadVerifications()
  }

  onPageChange(page: number) {
    this.page = page
    this.loadVerifications()
  }
}
