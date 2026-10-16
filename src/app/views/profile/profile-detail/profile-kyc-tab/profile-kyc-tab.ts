import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { DatePipe, CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Icon } from '@app/components/icon/icon'
import { ProfileService } from '@core/services/profile.service'
import { KycService } from '@core/services/kyc.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import { KycVerification } from '@core/models/kyc/kyc.model'
import {
  CountryKycRequirementDto,
  KycComplianceDto,
} from '@core/models/kyc/kyc-requirement.model'
import {
  KYCStatus,
  KYCStatusLabels,
  KYCStatusBadgeVariants,
} from '@core/models/shared/enums.model'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-profile-kyc-tab',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, Icon],
  templateUrl: './profile-kyc-tab.html',
  styles: ``,
})
export class ProfileKycTab implements OnInit {
  @Input() userId!: string
  @Input() profileId!: string
  @Input() profileTypeId?: string
  @Output() kycUpdated = new EventEmitter<void>()

  kycVerification: KycVerification | null = null
  requirements: CountryKycRequirementDto[] = []
  compliance: KycComplianceDto | null = null

  loading = false
  loadingCompliance = false
  error = ''
  success = ''

  // Modal refs
  modalRef: NgbModalRef | null = null
  modalAction: 'approve' | 'reject' | 'request-info' | 'start-review' = 'approve'
  modalNotes = ''
  modalReason = ''
  modalLevel = 'Intermediate'

  KYCStatus = KYCStatus
  KYCStatusLabels = KYCStatusLabels
  KYCStatusBadgeVariants = KYCStatusBadgeVariants

  constructor(
    private profileService: ProfileService,
    private kycService: KycService,
    private modalService: NgbModal,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadKycVerification()
    this.loadRequirementsAndCompliance()
  }

  loadRequirementsAndCompliance() {
    if (this.profileTypeId) {
      this.kycService.getRequirements(this.profileTypeId).subscribe({
        next: (reqs) => {
          this.requirements = (reqs || []).filter((r) => r.isActive)
        },
        error: () => {},
      })
    }

    if (this.userId) {
      this.loadingCompliance = true
      this.kycService.getUserCompliance(this.userId, this.profileTypeId).subscribe({
        next: (comp) => {
          this.compliance = comp
          this.loadingCompliance = false
        },
        error: () => {
          this.loadingCompliance = false
        },
      })
    }
  }

  isDocumentMissing(docTypeCode: string): boolean {
    if (this.compliance?.missingMandatoryDocuments) {
      return this.compliance.missingMandatoryDocuments.some(
        (m) => m.toUpperCase() === docTypeCode.toUpperCase()
      )
    }
    const docs = this.kycVerification?.documents || []
    return !docs.some(
      (d) =>
        (d.documentType || '').toUpperCase() === docTypeCode.toUpperCase() ||
        (d.fileName || '').toUpperCase().includes(docTypeCode.toUpperCase())
    )
  }

  loadKycVerification() {
    this.loading = true
    this.error = ''

    this.profileService.getKycVerificationByUser(this.userId).subscribe({
      next: (kyc) => {
        this.kycVerification = kyc
        this.loading = false
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.kycVerification = null
        } else {
          this.error = err.error?.error || err.error?.message || 'Failed to load KYC'
        }
        this.loading = false
      },
    })
  }

  openActionModal(content: any, action: 'approve' | 'reject' | 'request-info' | 'start-review') {
    this.modalAction = action
    this.modalNotes = ''
    this.modalReason = ''
    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg' })
  }

  closeModal() {
    this.modalRef?.close()
    this.modalRef = null
  }

  executeAction() {
    if (!this.kycVerification) return

    let action$: any

    switch (this.modalAction) {
      case 'approve':
        action$ = this.profileService.approveKycVerification(this.kycVerification.id, this.modalLevel, this.modalNotes)
        break
      case 'reject':
        if (!this.modalReason.trim()) {
          this.toast.warning('Veuillez saisir le motif du rejet.')
          return
        }
        action$ = this.profileService.rejectKycVerification(this.kycVerification.id, this.modalReason, this.modalNotes)
        break
      case 'request-info':
        if (!this.modalReason.trim()) {
          this.toast.warning('Veuillez saisir le message de demande d\'informations complémentaires.')
          return
        }
        action$ = this.profileService.requestMoreInfoKyc(this.kycVerification.id, this.modalReason)
        break
      case 'start-review':
        action$ = this.profileService.startKycReview(this.kycVerification.id)
        break
    }

    action$.subscribe({
      next: () => {
        this.success = `Action KYC (${this.modalAction}) effectuée avec succès.`
        this.toast.success(this.success)
        this.closeModal()
        this.loadKycVerification()
        this.loadRequirementsAndCompliance()
        this.kycUpdated.emit()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || `Failed to ${this.modalAction}`
        this.toast.error(this.error)
      },
    })
  }

  async manualVerifyProfile(level: number) {
    if (!this.profileId) return
    const levelLabel =
      level === 1
        ? 'L1 - Identité déclarée'
        : level === 2
          ? 'L2 - Identité vérifiée (KYC)'
          : 'L3 - Vérification renforcée'

    const confirmed = await this.confirmModal.confirm({
      title: `Valider manuellement le niveau ${levelLabel}`,
      message: `Voulez-vous définir manuellement le niveau de vérification de ce profil à ${levelLabel} ?`,
      confirmText: `Valider L${level}`,
      variant: level >= 2 ? 'success' : 'info',
      icon: 'shield-check',
    })
    if (!confirmed) return

    this.profileService.setVerificationLevel(this.profileId, level).subscribe({
      next: () => {
        this.success = `Niveau de vérification défini à L${level} avec succès.`
        this.toast.success(this.success)
        this.loadKycVerification()
        this.loadRequirementsAndCompliance()
        this.kycUpdated.emit()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Erreur lors de la mise à jour.'
        this.toast.error(this.error)
      },
    })
  }

  downloadDocument(documentId: string, fileName: string) {
    if (!this.kycVerification) return
    this.profileService.downloadKycDocument(this.kycVerification.id, documentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        window.URL.revokeObjectURL(url)
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to download'
        this.toast.error(this.error)
      },
    })
  }

  clearMessages() {
    this.error = ''
    this.success = ''
  }

  getStatusIcon(status: number): string {
    switch (status) {
      case KYCStatus.Draft: return 'file-text'
      case KYCStatus.Pending: return 'clock'
      case KYCStatus.UnderReview: return 'loader'
      case KYCStatus.MoreInfoRequired: return 'alert-circle'
      case KYCStatus.Approved: return 'check-circle'
      case KYCStatus.Rejected: return 'x-circle'
      case KYCStatus.Expired: return 'calendar-x'
      case KYCStatus.RequiresUpdate: return 'refresh-cw'
      default: return 'help-circle'
    }
  }

  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return 'image'
    if (fileType === 'application/pdf') return 'file-text'
    if (fileType.startsWith('video/')) return 'video'
    if (fileType.startsWith('audio/')) return 'music'
    if (fileType.includes('word') || fileType.includes('document')) return 'file-text'
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'table'
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'presentation'
    if (fileType.includes('zip') || fileType.includes('compressed')) return 'archive'
    return 'file'
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}