import { Component, OnInit, Input, signal } from '@angular/core'
import { DatePipe, CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Icon } from '@app/components/icon/icon'
import { ProfileService } from '@core/services/profile.service'
import { KycVerification } from '@core/models/kyc/kyc.model'
import {
  KYCStatus,
  KYCStatusLabels,
  KYCStatusBadgeVariants,
} from '@core/models/shared/enums.model'
import { BaseResponse } from '@core/models/shared/base-response.model'
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

  kycVerification: KycVerification | null = null
  loading = false
  error = ''
  success = ''

  // Modal refs
  modalRef: NgbModalRef | null = null
  modalContent: any = null
  modalAction: 'approve' | 'reject' | 'request-info' | 'start-review' = 'approve'
  modalNotes = ''
  modalReason = ''

  KYCStatus = KYCStatus
  KYCStatusLabels = KYCStatusLabels
  KYCStatusBadgeVariants = KYCStatusBadgeVariants

  constructor(
    private profileService: ProfileService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadKycVerification()
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
        // KYC might not exist for this user
        if (err.status === 404) {
          this.kycVerification = null
        } else {
          this.error = err.error?.error || err.error?.message || 'Failed to load KYC'
        }
        this.loading = false
      }
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
        action$ = this.profileService.approveKycVerification(this.kycVerification.id, this.modalNotes)
        break
      case 'reject':
        if (!this.modalReason.trim()) {
          alert('Rejection reason is required')
          return
        }
        action$ = this.profileService.rejectKycVerification(this.kycVerification.id, this.modalReason, this.modalNotes)
        break
      case 'request-info':
        if (!this.modalReason.trim()) {
          alert('Message is required')
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
        this.success = `KYC ${this.modalAction} successful`
        this.closeModal()
        this.loadKycVerification()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || `Failed to ${this.modalAction}`
      }
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
      }
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