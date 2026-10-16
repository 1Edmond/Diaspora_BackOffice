import { Component, OnInit, inject, TemplateRef } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { KycService } from '@core/services/kyc.service'
import { ToastService } from '@core/services/toast.service'
import { KycVerification } from '@core/models/kyc/kyc.model'
import {
  CountryKycRequirementDto,
  KycComplianceDto,
} from '@core/models/kyc/kyc-requirement.model'
import { KYCStatus, KYCStatusBadgeVariants, KYCStatusLabels } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-kyc-detail',
  standalone: true,
  imports: [CommonModule, PageBreadcrumb, DatePipe, RouterLink, FormsModule, Icon],
  templateUrl: './kyc-detail.html',
  styles: ``,
})
export class KycDetail implements OnInit {
  verification: KycVerification | null = null
  compliance: KycComplianceDto | null = null
  requirements: CountryKycRequirementDto[] = []

  loading = true
  error = ''
  success = ''

  rejectReason = ''
  approveNotes = ''
  approveLevel = 'Intermediate'
  infoMessage = ''

  KYCStatus = KYCStatus
  statusLabels = KYCStatusLabels
  statusBadges = KYCStatusBadgeVariants

  private modalService = inject(NgbModal)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private kycService: KycService,
    private toast: ToastService
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
        if (v.userId) {
          this.loadComplianceAndRequirements(v.userId)
        }
      },
      error: () => {
        this.loading = false
        this.router.navigate(['/kyc/list'])
      },
    })
  }

  loadComplianceAndRequirements(userId: string) {
    this.kycService.getUserCompliance(userId).subscribe({
      next: (comp) => {
        this.compliance = comp
        if (comp.profileTypeId) {
          this.kycService.getRequirements(comp.profileTypeId).subscribe({
            next: (reqs) => {
              this.requirements = (reqs || []).filter((r) => r.isActive)
            },
            error: () => {},
          })
        }
      },
      error: () => {},
    })
  }

  isDocumentMissing(docTypeCode: string): boolean {
    if (this.compliance?.missingMandatoryDocuments) {
      return this.compliance.missingMandatoryDocuments.some(
        (m) => m.toUpperCase() === docTypeCode.toUpperCase()
      )
    }
    const docs = this.verification?.documents || []
    return !docs.some(
      (d) =>
        (d.documentType || '').toUpperCase() === docTypeCode.toUpperCase() ||
        (d.fileName || '').toUpperCase().includes(docTypeCode.toUpperCase())
    )
  }

  startReview() {
    if (!this.verification) return
    this.kycService.startReview(this.verification.id).subscribe({
      next: (v) => {
        this.verification = v
        this.success = 'Review started'
        this.toast.info(this.success)
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to start review'
        this.toast.error(this.error)
      },
    })
  }

  openApproveModal(content: TemplateRef<any>) {
    this.approveNotes = ''
    this.approveLevel = 'Intermediate'
    this.modalService.open(content, { centered: true })
  }

  approve() {
    if (!this.verification) return
    this.kycService
      .approve(this.verification.id, {
        level: this.approveLevel,
        notes: this.approveNotes || undefined,
      } as any)
      .subscribe({
        next: (v) => {
          this.verification = v
          this.success = 'Verification approved'
          this.toast.success(this.success)
          this.modalService.dismissAll()
          if (v.userId) this.loadComplianceAndRequirements(v.userId)
        },
        error: (err: any) => {
          this.error = err.error?.error || err.error?.message || 'Failed to approve'
          this.toast.error(this.error)
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
        this.toast.warning(this.success)
        this.modalService.dismissAll()
        if (v.userId) this.loadComplianceAndRequirements(v.userId)
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to reject'
        this.toast.error(this.error)
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
        this.toast.info(this.success)
        this.modalService.dismissAll()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to request info'
        this.toast.error(this.error)
      },
    })
  }

  clearMessages() {
    this.error = ''
    this.success = ''
  }
}
