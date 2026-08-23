import { Component, OnInit, inject, TemplateRef, effect } from '@angular/core'
import { DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DocumentService } from '@core/services/document.service'
import { ProfileStateService } from '@core/services/profile-state.service'
import { DocumentDto, DocumentTypeDto } from '@core/models/document/document.model'
import { DocumentStatus, DocumentStatusLabels, DocumentStatusBadgeVariants } from '@core/models/shared/enums.model'
import { ProfileSearchDropdown } from '@shared/components/profile-search-dropdown/profile-search-dropdown'
import { Icon } from '@app/components/icon/icon'

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, RouterLink, FormsModule, ProfileSearchDropdown, Icon],
  templateUrl: './document-list.html',
  styles: ``,
})
export class DocumentList implements OnInit {
  documents: DocumentDto[] = []
  documentTypes: DocumentTypeDto[] = []
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  loading = false
  profileId = ''
  manualProfileId = ''

  selectedDocumentTypeId = ''
  selectedFile: File | null = null
  uploading = false
  uploadError = ''

  DocumentStatus = DocumentStatus
  statusLabels = DocumentStatusLabels
  statusBadges = DocumentStatusBadgeVariants

  private modalService = inject(NgbModal)

  constructor(
    private documentService: DocumentService,
    public profileState: ProfileStateService
  ) {
    effect(() => {
      const pid = this.profileState.selectedProfileId()
      if (pid && pid !== this.profileId) {
        this.profileId = pid
        this.manualProfileId = pid
        this.page = 1
        this.loadDocuments()
      }
    })
  }

  ngOnInit() {
    if (this.profileState.selectedProfileId()) {
      this.profileId = this.profileState.selectedProfileId()
      this.manualProfileId = this.profileId
      this.loadDocuments()
    }
    this.loadDocumentTypes()
  }

  onProfileSelect(profileId: string) {
    this.profileId = profileId
    this.manualProfileId = profileId
    this.page = 1
    this.loadDocuments()
  }

  applyManualProfileId() {
    const pid = this.manualProfileId.trim()
    if (pid) {
      this.profileState.selectProfile(pid)
      this.onProfileSelect(pid)
    }
  }

  loadDocumentTypes() {
    this.documentService.getDocumentTypes().subscribe({
      next: (types) => { this.documentTypes = types },
      error: () => {},
    })
  }

  loadDocuments() {
    if (!this.profileId) return
    this.loading = true
    this.documentService.getProfileDocuments(this.profileId, { pageNumber: this.page, pageSize: this.pageSize }).subscribe({
      next: (res) => {
        this.documents = res.items
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  onPageChange(page: number) {
    this.page = page
    this.loadDocuments()
  }

  openUploadModal(content: TemplateRef<any>) {
    this.selectedDocumentTypeId = ''
    this.selectedFile = null
    this.uploadError = ''
    this.modalService.open(content, { centered: true })
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]
    }
  }

  uploadDocument() {
    if (!this.profileId || !this.selectedDocumentTypeId || !this.selectedFile) {
      this.uploadError = 'Please select a profile, document type, and file.'
      return
    }
    this.uploading = true
    this.uploadError = ''
    this.documentService.uploadDocument(this.profileId, this.selectedDocumentTypeId, this.selectedFile).subscribe({
      next: () => {
        this.uploading = false
        this.modalService.dismissAll()
        this.loadDocuments()
      },
      error: (err) => {
        this.uploading = false
        this.uploadError = err.error?.error || err.error?.message || 'Failed to upload document'
      },
    })
  }

  downloadDocument(doc: DocumentDto) {
    this.documentService.downloadDocument(doc.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = doc.fileName
        a.click()
        window.URL.revokeObjectURL(url)
      },
      error: () => {},
    })
  }

  onDelete(doc: DocumentDto) {
    if (confirm(`Delete document ${doc.fileName}?`)) {
      this.documentService.deleteDocument(doc.id).subscribe({
        next: () => this.loadDocuments(),
        error: () => {},
      })
    }
  }
}
