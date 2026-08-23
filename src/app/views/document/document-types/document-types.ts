import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { DocumentService } from '@core/services/document.service'
import { ProfileService } from '@core/services/profile.service'
import { DocumentTypeDto } from '@core/models/document/document.model'
import { ProfileTypeDto } from '@core/models/profile/profile.model'

@Component({
  selector: 'app-document-types',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule],
  templateUrl: './document-types.html',
  styles: ``,
})
export class DocumentTypes implements OnInit {
  types: DocumentTypeDto[] = []
  profileTypes: ProfileTypeDto[] = []
  loading = false
  errorMessage = ''

  formData = {
    profileTypeId: '',
    name: '',
    code: '',
    description: '',
    isRenewable: false,
    renewalAlertDays: 30,
    isRequired: false,
  }

  constructor(
    private documentService: DocumentService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.loadTypes()
    this.profileService.getProfileTypes().subscribe({
      next: (res) => {
        this.profileTypes = res
      },
      error: (err) => {
        console.error('getProfileTypes error:', err)
      },
    })
  }

  loadTypes() {
    this.loading = true
    this.errorMessage = ''
    this.documentService.getDocumentTypes().subscribe({
      next: (res) => {
        this.types = res
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.errorMessage = err?.status === 403 ? 'Accès refusé — permission document.type:list requise' : 'Erreur de chargement'
        console.error('getDocumentTypes error:', err)
      },
    })
  }

  createType() {
    if (!this.formData.name || !this.formData.code || !this.formData.profileTypeId) return
    this.documentService.createDocumentType({
      profileTypeId: this.formData.profileTypeId,
      name: this.formData.name,
      code: this.formData.code,
      description: this.formData.description || undefined,
      isRenewable: this.formData.isRenewable,
      renewalAlertDays: this.formData.renewalAlertDays,
      isRequired: this.formData.isRequired,
    }).subscribe({
      next: () => {
        this.formData = {
          profileTypeId: '',
          name: '',
          code: '',
          description: '',
          isRenewable: false,
          renewalAlertDays: 30,
          isRequired: false,
        }
        this.loadTypes()
      },
      error: (err) => {
        this.errorMessage = err?.status === 403 ? 'Permission refusée pour créer' : 'Erreur de création'
        console.error('createDocumentType error:', err)
      },
    })
  }

  deactivateType(id: string) {
    if (confirm('Deactivate this document type?')) {
      this.documentService.deactivateDocumentType(id).subscribe({
        next: () => this.loadTypes(),
        error: (err) => {
          this.errorMessage = err?.status === 403 ? 'Permission refusée pour désactiver' : 'Erreur de désactivation'
          console.error('deactivateDocumentType error:', err)
        },
      })
    }
  }
}
