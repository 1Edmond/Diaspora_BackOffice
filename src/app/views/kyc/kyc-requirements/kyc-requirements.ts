import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { KycService } from '@core/services/kyc.service'
import { ProfileService } from '@core/services/profile.service'
import { DocumentService } from '@core/services/document.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import { ProfileTypeDto } from '@core/models/profile/profile.model'
import { DocumentTypeDto } from '@core/models/document/document.model'
import {
  CountryKycRequirementDto,
  CreateCountryKycRequirementRequest,
  UpdateCountryKycRequirementRequest,
} from '@core/models/kyc/kyc-requirement.model'

@Component({
  selector: 'app-kyc-requirements',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumb, DatePipe, Icon],
  templateUrl: './kyc-requirements.html',
  styles: ``,
})
export class KycRequirements implements OnInit {
  @ViewChild('requirementModal') requirementModal!: TemplateRef<any>

  profileTypes: ProfileTypeDto[] = []
  documentTypes: DocumentTypeDto[] = []
  requirements: CountryKycRequirementDto[] = []

  selectedProfileTypeId: string = ''
  selectedProfileType: ProfileTypeDto | null = null

  loadingCountries = false
  loadingRequirements = false
  saving = false
  error = ''
  successMessage = ''

  modalRef: NgbModalRef | null = null
  isEditing = false
  editingRequirementId: string | null = null

  // Form Model
  formDocumentTypeId: string = ''
  formDocumentTypeCode: string = ''
  formPurpose: string = ''
  formIsRequired: boolean = true
  formIsActive: boolean = true
  formTargetLevel: number = 2
  formRequiredDistinctDocumentsCount: number = 1

  kycLevels = [
    {
      level: 1,
      shortLabel: 'L1',
      title: 'Niveau 1 (L1 : Identité déclarée / Basic)',
      badgeClass: 'bg-soft-info text-info',
    },
    {
      level: 2,
      shortLabel: 'L2',
      title: 'Niveau 2 (L2 : Identité vérifiée / Intermediate - Requis pour activation)',
      badgeClass: 'bg-soft-success text-success',
    },
    {
      level: 3,
      shortLabel: 'L3',
      title: 'Niveau 3 (L3 : Vérification renforcée / Advanced)',
      badgeClass: 'bg-soft-primary text-primary',
    },
  ]

  constructor(
    private kycService: KycService,
    private profileService: ProfileService,
    private documentService: DocumentService,
    private modalService: NgbModal,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadProfileTypes()
  }

  loadProfileTypes() {
    this.loadingCountries = true
    this.profileService.getProfileTypes().subscribe({
      next: (types) => {
        this.profileTypes = types
        this.loadingCountries = false
        if (types.length > 0) {
          const activeCountry = types.find((t) => t.isActive) || types[0]
          this.onCountryChange(activeCountry.id)
        }
      },
      error: () => {
        this.loadingCountries = false
        this.error = 'Erreur lors du chargement des pays.'
      },
    })
  }

  onCountryChange(profileTypeId: string) {
    this.selectedProfileTypeId = profileTypeId
    this.selectedProfileType = this.profileTypes.find((t) => t.id === profileTypeId) || null
    this.loadRequirements()
    this.loadDocumentTypes()
  }

  loadDocumentTypes() {
    this.documentService.getDocumentTypes(this.selectedProfileTypeId || undefined).subscribe({
      next: (types) => {
        this.documentTypes = types
      },
      error: () => {
        // Fallback or ignore
      },
    })
  }

  loadRequirements() {
    if (!this.selectedProfileTypeId) return
    this.loadingRequirements = true
    this.error = ''
    this.kycService.getRequirements(this.selectedProfileTypeId).subscribe({
      next: (reqs) => {
        this.requirements = reqs
        this.loadingRequirements = false
      },
      error: (err) => {
        this.loadingRequirements = false
        this.error = err.error?.error || err.error?.message || 'Erreur lors du chargement des exigences KYC.'
      },
    })
  }

  getDocumentTypeName(docTypeId: string, code: string): string {
    const doc = this.documentTypes.find((d) => d.id === docTypeId || d.code.toUpperCase() === code.toUpperCase())
    return doc ? doc.name : code
  }

  getLevelBadgeClass(level: number): string {
    const found = this.kycLevels.find((l) => l.level === (level || 2))
    return found ? found.badgeClass : 'bg-soft-secondary text-secondary'
  }

  getLevelLabel(level: number): string {
    const lvl = level || 2
    if (lvl === 1) return 'L1 - Identité déclarée'
    if (lvl === 2) return 'L2 - Identité vérifiée'
    if (lvl === 3) return 'L3 - Vérification renforcée'
    return `L${lvl}`
  }

  getLevelSummary(level: number): {
    totalActive: number
    mandatoryCount: number
    distinctDocsRequired: number
  } {
    const activeReqs = this.requirements.filter((r) => r.isActive && (r.targetLevel || 2) === level)
    const mandatoryCount = activeReqs.filter((r) => r.isRequired).length
    const distinctDocsRequired = activeReqs.reduce(
      (max, r) => Math.max(max, r.requiredDistinctDocumentsCount || 1),
      activeReqs.length > 0 ? 1 : 0
    )
    return {
      totalActive: activeReqs.length,
      mandatoryCount,
      distinctDocsRequired,
    }
  }

  openCreateModal() {
    this.isEditing = false
    this.editingRequirementId = null
    this.formDocumentTypeId = this.documentTypes.length > 0 ? this.documentTypes[0].id : ''
    this.formDocumentTypeCode = this.documentTypes.length > 0 ? this.documentTypes[0].code : ''
    this.formPurpose = ''
    this.formIsRequired = true
    this.formIsActive = true
    this.formTargetLevel = 2
    this.formRequiredDistinctDocumentsCount = 1
    this.error = ''
    this.modalRef = this.modalService.open(this.requirementModal, { centered: true, size: 'md' })
  }

  openEditModal(req: CountryKycRequirementDto) {
    this.isEditing = true
    this.editingRequirementId = req.id
    this.formDocumentTypeId = req.documentTypeId
    this.formDocumentTypeCode = req.documentTypeCode
    this.formPurpose = req.purpose
    this.formIsRequired = req.isRequired
    this.formIsActive = req.isActive
    this.formTargetLevel = req.targetLevel || 2
    this.formRequiredDistinctDocumentsCount = req.requiredDistinctDocumentsCount || 1
    this.error = ''
    this.modalRef = this.modalService.open(this.requirementModal, { centered: true, size: 'md' })
  }

  onDocumentTypeSelectionChange(docTypeId: string) {
    this.formDocumentTypeId = docTypeId
    const selected = this.documentTypes.find((d) => d.id === docTypeId)
    if (selected) {
      this.formDocumentTypeCode = selected.code
      if (!this.formPurpose) {
        this.formPurpose = selected.description || selected.name
      }
    }
  }

  closeModal() {
    this.modalRef?.close()
    this.modalRef = null
  }

  saveRequirement() {
    if (!this.formPurpose.trim()) {
      this.error = 'Veuillez saisir le motif d’exigence.'
      return
    }

    const distinctCount = Math.max(1, Number(this.formRequiredDistinctDocumentsCount) || 1)
    const targetLevel = Number(this.formTargetLevel) || 2

    this.saving = true
    this.error = ''
    this.successMessage = ''

    if (this.isEditing && this.editingRequirementId) {
      const updateData: UpdateCountryKycRequirementRequest = {
        purpose: this.formPurpose.trim(),
        isRequired: this.formIsRequired,
        isActive: this.formIsActive,
        targetLevel,
        requiredDistinctDocumentsCount: distinctCount,
      }
      this.kycService.updateRequirement(this.editingRequirementId, updateData).subscribe({
        next: () => {
          this.saving = false
          this.closeModal()
          this.successMessage = 'Exigence KYC mise à jour avec succès.'
          this.toast.success(this.successMessage)
          this.loadRequirements()
        },
        error: (err) => {
          this.saving = false
          this.error = err.error?.error || err.error?.message || 'Erreur lors de la mise à jour.'
        },
      })
    } else {
      if (!this.formDocumentTypeId || !this.formDocumentTypeCode.trim()) {
        this.saving = false
        this.error = 'Veuillez sélectionner un type de document.'
        return
      }

      const createData: CreateCountryKycRequirementRequest = {
        profileTypeId: this.selectedProfileTypeId,
        documentTypeId: this.formDocumentTypeId,
        documentTypeCode: this.formDocumentTypeCode.trim().toUpperCase(),
        purpose: this.formPurpose.trim(),
        isRequired: this.formIsRequired,
        targetLevel,
        requiredDistinctDocumentsCount: distinctCount,
      }

      this.kycService.createRequirement(createData).subscribe({
        next: () => {
          this.saving = false
          this.closeModal()
          this.successMessage = 'Exigence KYC créée avec succès.'
          this.toast.success(this.successMessage)
          this.loadRequirements()
        },
        error: (err) => {
          this.saving = false
          this.error = err.error?.error || err.error?.message || 'Erreur lors de la création.'
        },
      })
    }
  }

  toggleActive(req: CountryKycRequirementDto) {
    const updateData: UpdateCountryKycRequirementRequest = {
      purpose: req.purpose,
      isRequired: req.isRequired,
      isActive: !req.isActive,
      targetLevel: req.targetLevel || 2,
      requiredDistinctDocumentsCount: req.requiredDistinctDocumentsCount || 1,
    }
    this.kycService.updateRequirement(req.id, updateData).subscribe({
      next: () => {
        this.successMessage = `Exigence ${!req.isActive ? 'activée' : 'désactivée'} avec succès.`
        this.toast.success(this.successMessage)
        this.loadRequirements()
      },
      error: (err) => {
        this.error = err.error?.error || err.error?.message || 'Erreur lors de la modification de statut.'
      },
    })
  }

  async deleteRequirement(req: CountryKycRequirementDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer l\'exigence KYC',
      message: `Êtes-vous sûr de vouloir supprimer l'exigence "${req.documentTypeCode}" pour ce pays ?`,
      confirmText: 'Supprimer',
      variant: 'danger',
      icon: 'trash-2',
    })
    if (!confirmed) {
      return
    }

    this.kycService.deleteRequirement(req.id).subscribe({
      next: () => {
        this.successMessage = 'Exigence supprimée avec succès.'
        this.toast.success(this.successMessage)
        this.loadRequirements()
      },
      error: (err) => {
        this.error = err.error?.error || err.error?.message || 'Erreur lors de la suppression.'
      },
    })
  }
}
