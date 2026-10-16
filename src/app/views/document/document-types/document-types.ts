import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { DocumentService } from '@core/services/document.service'
import { ProfileService } from '@core/services/profile.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import { DocumentTypeDto } from '@core/models/document/document.model'
import { ProfileTypeDto } from '@core/models/profile/profile.model'

@Component({
  selector: 'app-document-types',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule, Icon],
  templateUrl: './document-types.html',
  styles: ``,
})
export class DocumentTypes implements OnInit {
  types: DocumentTypeDto[] = []
  profileTypes: ProfileTypeDto[] = []
  loading = false
  errorMessage = ''
  selectedCountryFilter = ''

  formData = {
    profileTypeId: '',
    name: '',
    code: '',
    description: '',
    isRenewable: false,
    renewalAlertDays: 30,
    isRequired: false,
  }

  // Translation management
  translatingDocType: DocumentTypeDto | null = null
  translatingLanguages = [
    { code: 'fr', label: 'Français (FR)', flag: '🇫🇷' },
    { code: 'en', label: 'English (EN)', flag: '🇬🇧' },
    { code: 'ru', label: 'Русский (RU)', flag: '🇷🇺' },
  ]
  selectedCulture = 'fr'
  translationData: { [culture: string]: { Name?: string; Description?: string } } = {
    fr: { Name: '', Description: '' },
    en: { Name: '', Description: '' },
    ru: { Name: '', Description: '' }
  }
  translationLoading = false
  translationSaving = false
  translationSuccess = ''
  translationError = ''
  translationModalRef: NgbModalRef | null = null

  constructor(
    private documentService: DocumentService,
    private profileService: ProfileService,
    private modalService: NgbModal,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadProfileTypes()
    this.loadTypes()
  }

  loadProfileTypes() {
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
    this.documentService.getDocumentTypes(this.selectedCountryFilter || undefined).subscribe({
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

  onFilterCountryChange() {
    this.loadTypes()
  }

  getCountryLabel(profileTypeId?: string): string {
    if (!profileTypeId) return 'Global (Tous pays)'
    const pt = this.profileTypes.find(p => p.id === profileTypeId)
    return pt ? `${pt.flag || ''} ${pt.countryName} (${pt.countryCode})` : 'Pays spécifique'
  }

  createType() {
    if (!this.formData.name || !this.formData.code) return
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
        this.toast.success('Type de document créé avec succès.')
        this.loadTypes()
      },
      error: (err) => {
        this.errorMessage = err?.status === 403 ? 'Permission refusée pour créer' : 'Erreur de création'
        console.error('createDocumentType error:', err)
      },
    })
  }

  async deactivateType(id: string) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Désactiver le type de document',
      message: 'Voulez-vous désactiver ce type de document ?',
      confirmText: 'Désactiver',
      variant: 'warning',
      icon: 'alert-triangle',
    })
    if (confirmed) {
      this.documentService.deactivateDocumentType(id).subscribe({
        next: () => {
          this.toast.warning('Type de document désactivé.')
          this.loadTypes()
        },
        error: (err) => {
          this.errorMessage = err?.status === 403 ? 'Permission refusée pour désactiver' : 'Erreur de désactivation'
          console.error('deactivateDocumentType error:', err)
        },
      })
    }
  }

  openTranslations(docType: DocumentTypeDto, content: any) {
    this.translatingDocType = docType
    this.selectedCulture = 'fr'
    this.translationSuccess = ''
    this.translationError = ''
    this.translationLoading = true
    this.translationData = {
      fr: { Name: docType.name, Description: docType.description || '' },
      en: { Name: '', Description: '' },
      ru: { Name: '', Description: '' }
    }

    this.translationModalRef = this.modalService.open(content, { centered: true, size: 'lg' })

    this.documentService.getDocumentTypeTranslations(docType.id).subscribe({
      next: (translations) => {
        this.translationLoading = false
        if (translations) {
          for (const lang of ['fr', 'en', 'ru']) {
            if (translations[lang]) {
              this.translationData[lang] = {
                Name: translations[lang]['Name'] || this.translationData[lang].Name,
                Description: translations[lang]['Description'] || this.translationData[lang].Description
              }
            }
          }
        }
      },
      error: (err) => {
        this.translationLoading = false
        console.error('Error loading translations:', err)
      }
    })
  }

  saveTranslation(culture: string) {
    if (!this.translatingDocType) return
    this.translationSaving = true
    this.translationSuccess = ''
    this.translationError = ''

    const fields: { [field: string]: string } = {
      Name: this.translationData[culture]?.Name || '',
      Description: this.translationData[culture]?.Description || ''
    }

    this.documentService.updateDocumentTypeTranslation(this.translatingDocType.id, culture, fields).subscribe({
      next: () => {
        this.translationSaving = false
        this.translationSuccess = `Traduction (${culture.toUpperCase()}) enregistrée avec succès.`
        this.loadTypes()
      },
      error: (err) => {
        this.translationSaving = false
        this.translationError = err.error?.error || err.error?.message || 'Erreur lors de l\'enregistrement de la traduction.'
      }
    })
  }

  closeTranslationModal() {
    this.translationModalRef?.close()
    this.translationModalRef = null
    this.translatingDocType = null
  }
}

