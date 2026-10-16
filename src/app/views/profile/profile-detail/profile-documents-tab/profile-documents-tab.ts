import { Component, OnInit, Input, signal } from '@angular/core'
import { DatePipe, CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Icon } from '@app/components/icon/icon'
import { ProfileService } from '@core/services/profile.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import { DocumentDto } from '@core/models/document/document.model'
import {
  DocumentStatus,
  DocumentStatusLabels,
  DocumentStatusBadgeVariants,
} from '@core/models/shared/enums.model'
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs'

@Component({
  selector: 'app-profile-documents-tab',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, Icon],
  templateUrl: './profile-documents-tab.html',
  styles: ``,
})
export class ProfileDocumentsTab implements OnInit {
  @Input() profileId!: string
  @Input() userId!: string

  private destroy$ = new Subject<void>()
  private searchSubject = new Subject<string>()

  documents = signal<DocumentDto[]>([])
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  loading = false
  error = ''
  success = ''

  search = ''
  statusFilter: number | null = null

  DocumentStatus = DocumentStatus
  DocumentStatusLabels = DocumentStatusLabels
  DocumentStatusBadgeVariants = DocumentStatusBadgeVariants

  statusOptions = [
    { value: null, label: 'All' },
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Validated' },
    { value: 2, label: 'Rejected' },
    { value: 3, label: 'Expired' },
  ]

  constructor(
    private profileService: ProfileService,
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
      this.loadDocuments()
    })
    this.loadDocuments()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadDocuments() {
    this.loading = true
    this.error = ''

    this.profileService.getDocumentsByProfile(this.profileId, this.page, this.pageSize).subscribe({
      next: (res) => {
        this.documents.set(res.items)
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Failed to load documents'
      }
    })
  }

  onPageChange(page: number) {
    this.page = page
    this.loadDocuments()
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value)
  }

  onStatusChange() {
    this.page = 1
    this.loadDocuments()
  }

  async validateDocument(documentId: string) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Valider le document',
      message: 'Voulez-vous valider ce document ?',
      confirmText: 'Valider',
      variant: 'success'
    })
    if (!confirmed) return
    this.profileService.validateDocument(documentId).subscribe({
      next: () => {
        this.success = 'Document validé'
        this.toast.success('Document validé avec succès.')
        this.loadDocuments()
      },
      error: (err) => {
        this.error = err.error?.error || err.error?.message || 'Erreur lors de la validation'
        this.toast.error(this.error)
      }
    })
  }

  async rejectDocument(documentId: string) {
    const reason = await this.confirmModal.prompt({
      title: 'Rejeter le document',
      message: 'Veuillez indiquer le motif du rejet :',
      inputPlaceholder: 'Motif du rejet...',
      confirmText: 'Rejeter',
      variant: 'danger'
    })
    if (!reason) return
    this.profileService.rejectDocument(documentId, reason).subscribe({
      next: () => {
        this.success = 'Document rejeté'
        this.toast.success('Document rejeté.')
        this.loadDocuments()
      },
      error: (err) => {
        this.error = err.error?.error || err.error?.message || 'Erreur lors du rejet'
        this.toast.error(this.error)
      }
    })
  }

  async deleteDocument(documentId: string) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer le document',
      message: 'Voulez-vous vraiment supprimer ce document ?',
      confirmText: 'Supprimer',
      variant: 'danger'
    })
    if (!confirmed) return
    this.profileService.deleteDocument(documentId).subscribe({
      next: () => {
        this.success = 'Document supprimé'
        this.toast.success('Document supprimé.')
        this.loadDocuments()
      },
      error: (err) => {
        this.error = err.error?.error || err.error?.message || 'Erreur lors de la suppression'
        this.toast.error(this.error)
      }
    })
  }

  downloadDocument(documentId: string, fileName: string) {
    this.profileService.downloadDocument(documentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        window.URL.revokeObjectURL(url)
      },
      error: (err) => {
        this.error = err.error?.error || err.error?.message || 'Failed to download'
        this.toast.error(this.error)
      }
    })
  }

  clearMessages() {
    this.error = ''
    this.success = ''
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType === 'application/pdf') return 'file-text'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'music'
    if (mimeType.includes('word') || mimeType.includes('document')) return 'file-text'
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'table'
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation'
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'archive'
    return 'file'
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  isExpiringSoon(expiresAt: string): boolean {
    const expiry = new Date(expiresAt)
    const now = new Date()
    const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays <= 30 && diffDays > 0
  }
}