import { Component, OnInit, inject, TemplateRef } from '@angular/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { KycService } from '@core/services/kyc.service'
import { KycVerification } from '@core/models/kyc/kyc.model'
import { KYCStatus, KYCStatusBadgeVariants, KYCStatusLabels } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-kyc-detail',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, RouterLink, FormsModule, Icon],
  templateUrl: './kyc-detail.html',
  styles: ``,
})
export class KycDetail implements OnInit {
  verification: KycVerification | null = null
  loading = true
  error = ''
  success = ''

  rejectReason = ''
  approveNotes = ''
  infoMessage = ''

  KYCStatus = KYCStatus
  statusLabels = KYCStatusLabels
  statusBadges = KYCStatusBadgeVariants

  private modalService = inject(NgbModal)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private kycService: KycService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!
    this.loadVerification(id)
  }

  loadVerification(id: string) {
    this.loading = true
    this.kycService.getVerification(id).subscribe({
      next: (v) => {
        this.verification = v
        this.loading = false
      },
      error: () => {
        this.loading = false
        this.router.navigate(['/kyc/list'])
      },
    })
  }

  startReview() {
    if (!this.verification) return
    this.kycService.startReview(this.verification.id).subscribe({
      next: (v) => {
        this.verification = v
        this.success = 'Review started'
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to start review'
      },
    })
  }

  openApproveModal(content: TemplateRef<any>) {
    this.approveNotes = ''
    this.modalService.open(content, { centered: true })
  }

  approve() {
    if (!this.verification) return
    this.kycService.approve(this.verification.id, { notes: this.approveNotes || undefined }).subscribe({
      next: (v) => {
        this.verification = v
        this.success = 'Verification approved'
        this.modalService.dismissAll()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to approve'
      },
    })
  }

  openRejectModal(content: TemplateRef<any>) {
    this.rejectReason = ''
    this.modalService.open(content, { centered: true })
  }

  reject() {
    if (!this.verification || !this.rejectReason) return
    this.kycService.reject(this.verification.id, { reason: this.rejectReason }).subscribe({
      next: (v) => {
        this.verification = v
        this.success = 'Verification rejected'
        this.modalService.dismissAll()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to reject'
      },
    })
  }

  openInfoModal(content: TemplateRef<any>) {
    this.infoMessage = ''
    this.modalService.open(content, { centered: true })
  }

  requestMoreInfo() {
    if (!this.verification || !this.infoMessage) return
    this.kycService.requestMoreInfo(this.verification.id, { message: this.infoMessage }).subscribe({
      next: (v) => {
        this.verification = v
        this.success = 'More info requested'
        this.modalService.dismissAll()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to request info'
      },
    })
  }

  clearMessages() {
    this.error = ''
    this.success = ''
  }
}
