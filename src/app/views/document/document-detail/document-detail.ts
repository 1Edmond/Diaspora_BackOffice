import { Component, OnInit, inject, TemplateRef } from '@angular/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DocumentService } from '@core/services/document.service'
import { DocumentDto } from '@core/models/document/document.model'
import { DocumentStatus, DocumentStatusLabels, DocumentStatusBadgeVariants } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, RouterLink, FormsModule],
  templateUrl: './document-detail.html',
  styles: ``,
})
export class DocumentDetail implements OnInit {
  document: DocumentDto | null = null
  loading = true
  error = ''
  success = ''

  rejectReason = ''
  validateNotes = ''

  DocumentStatus = DocumentStatus
  statusLabels = DocumentStatusLabels
  statusBadges = DocumentStatusBadgeVariants

  private modalService = inject(NgbModal)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!
    this.documentService.getDocument(id).subscribe({
      next: (doc) => {
        this.document = doc
        this.loading = false
      },
      error: () => {
        this.loading = false
        this.router.navigate(['/documents'])
      },
    })
  }

  openValidateModal(content: TemplateRef<any>) {
    this.validateNotes = ''
    this.modalService.open(content, { centered: true })
  }

  validate() {
    if (!this.document) return
    this.documentService.validateDocument(this.document.id, { notes: this.validateNotes || undefined }).subscribe({
      next: () => {
        this.success = 'Document validated'
        this.modalService.dismissAll()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to validate'
      },
    })
  }

  openRejectModal(content: TemplateRef<any>) {
    this.rejectReason = ''
    this.modalService.open(content, { centered: true })
  }

  reject() {
    if (!this.document || !this.rejectReason) return
    this.documentService.rejectDocument(this.document.id, { reason: this.rejectReason }).subscribe({
      next: () => {
        this.success = 'Document rejected'
        this.modalService.dismissAll()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to reject'
      },
    })
  }

  clearMessages() {
    this.error = ''
    this.success = ''
  }
}
