import { Component, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ToastService } from '@core/services/toast.service'
import { ReportDto } from '@core/models/marketplace/marketplace.model'

interface ReportWithActions extends ReportDto {
  selected?: boolean
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, PageBreadcrumb, FormsModule, Icon, RouterModule],
  templateUrl: './reports.html',
  styles: ``,
})
export class Reports implements OnInit {
  reports = signal<any[]>([])
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  loading = false
  error = ''

  // Filters
  statusFilter: number | null = null
  targetTypeFilter: number | null = null
  dateFrom: string = ''
  dateTo: string = ''

  // Resolve modal
  resolveModalRef: any = null
  resolvingReport: any = null
  resolveLoading = false
  resolveStatus = 1
  resolveNotes = ''

  ReportStatus: any
  ReportStatusLabels: any
  ReportStatusBadgeVariants: any
  ReportTargetType: any
  ReportTargetTypeLabels: any

  statusOptions = [
    { value: null, label: 'All' },
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Reviewed' },
    { value: 2, label: 'Dismissed' },
    { value: 3, label: 'Action Taken' },
  ]

  targetTypeOptions = [
    { value: null, label: 'All' },
    { value: 0, label: 'Listing' },
    { value: 1, label: 'Review' },
    { value: 2, label: 'User' },
  ]

  constructor(
    private marketplaceService: MarketplaceService,
    private modalService: NgbModal,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.ReportStatus = { Pending: 0, Reviewed: 1, Dismissed: 2, ActionTaken: 3 }
    this.ReportStatusLabels = { 0: 'Pending', 1: 'Reviewed', 2: 'Dismissed', 3: 'Action Taken' }
    this.ReportStatusBadgeVariants = { 0: 'warning', 1: 'success', 2: 'secondary', 3: 'primary' }
    this.ReportTargetType = { Listing: 0, Review: 1, User: 2 }
    this.ReportTargetTypeLabels = { 0: 'Listing', 1: 'Review', 2: 'User' }
    this.loadReports()
  }

  loadReports() {
    this.loading = true
    this.error = ''

    this.marketplaceService.getPendingReports(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.reports.set(res.items.map(r => ({ ...r, selected: false })))
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Failed to load reports'
      }
    })
  }

  onPageChange(page: number) {
    this.page = page
    this.loadReports()
  }

  openResolveModal(content: any, report: any) {
    this.resolvingReport = report
    this.resolveStatus = 1
    this.resolveNotes = ''
    this.resolveModalRef = this.modalService.open(content, { centered: true, size: 'lg' })
  }

  closeResolveModal() {
    this.resolveModalRef?.close()
    this.resolveModalRef = null
    this.resolvingReport = null
  }

  async resolveReport() {
    if (!this.resolvingReport) return
    if (this.resolveStatus === 3 && !this.resolveNotes.trim()) {
      this.toast.warning('Veuillez renseigner une note justificative pour cette action.')
      return
    }

    this.resolveLoading = true
    try {
      await this.marketplaceService.resolveReport(this.resolvingReport.id, this.resolveStatus, this.resolveNotes).toPromise()
      this.toast.success('Signalement résolu avec succès.')
      this.closeResolveModal()
      this.loadReports()
    } catch (e) {
      console.error('Failed to resolve report', e)
      this.toast.error('Erreur lors du traitement du signalement.')
    } finally {
      this.resolveLoading = false
    }
  }

  getTargetLink(report: any): string {
    switch (report.targetType) {
      case 0:
        return `/marketplace/listings/${report.targetId}`
      case 1:
        return `/marketplace/reviews?listingId=${report.targetId}`
      case 2:
        return `/identity/users/${report.targetId}`
      default:
        return '#'
    }
  }

  clearFilters() {
    this.statusFilter = null
    this.targetTypeFilter = null
    this.dateFrom = ''
    this.dateTo = ''
    this.page = 1
    this.loadReports()
  }
}