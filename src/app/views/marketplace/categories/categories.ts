import { Component, OnInit } from '@angular/core'
import { DecimalPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { MarketplaceService } from '@core/services/marketplace.service'
import {
  CategoryDto,
  CategoryPolicyDto,
  CreateCategoryRequest,
  UpdateCategoryPolicyRequest,
  VerificationLevel,
  VerificationLevelLabels,
  VerificationLevelBadgeVariants,
} from '@core/models/marketplace/marketplace.model'

import {
  COMMON_LANGUAGES,
  LanguageOption,
  getLanguageDisplay,
} from '@core/constants/languages.constant'

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule, Icon, DecimalPipe, NgbDropdownModule],
  templateUrl: './categories.html',
  styles: ``,
})
export class Categories implements OnInit {
  categories: CategoryDto[] = []
  loading = false

  model: CreateCategoryRequest = { name: '', description: '', iconUrl: '', displayOrder: 0 }
  saving = false
  error = ''
  successMessage = ''
  editId: string | null = null

  // Dynamic multilingual languages for creation & edition
  formLanguage = 'fr'
  formLanguages: string[] = ['fr']
  formTranslations: { [culture: string]: { Name: string; Description: string } } = {
    fr: { Name: '', Description: '' },
  }
  customLangInput = ''
  commonLanguages = COMMON_LANGUAGES

  // Category Policy management
  editingPolicyCat: CategoryDto | null = null
  policySaving = false
  policyError = ''
  policySuccess = ''

  policyForm = {
    minPublishLevel: 0 as VerificationLevel,
    minBookLevel: 0 as VerificationLevel,
    maxWeightKg: null as number | null,
    maxValueAmount: null as number | null,
    requiresEscrow: true,
    requiresPreModeration: false,
    defaultCommissionRate: 10, // In percentage 10%
  }

  // Translation management modal
  translatingCat: CategoryDto | null = null
  translatingLanguages: string[] = ['fr', 'en', 'ru']
  selectedCulture = 'fr'
  customModalLangInput = ''
  translationData: { [culture: string]: { Name?: string; Description?: string } } = {
    fr: { Name: '', Description: '' },
  }
  translationLoading = false
  translationSaving = false
  translationSuccess = ''
  translationError = ''
  translationModalRef: NgbModalRef | null = null

  VerificationLevelLabels = VerificationLevelLabels
  VerificationLevelBadgeVariants = VerificationLevelBadgeVariants
  verificationLevels = [
    { value: VerificationLevel.L0_Registered, label: 'L0 - Enregistré (Tous)' },
    { value: VerificationLevel.L1_IdentityDeclared, label: 'L1 - Identité déclarée' },
    { value: VerificationLevel.L2_IdentityVerified, label: 'L2 - Identité vérifiée (KYC)' },
    { value: VerificationLevel.L3_EnhancedVerified, label: 'L3 - Vérification renforcée' },
  ]

  constructor(
    private marketplaceService: MarketplaceService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadCategories()
  }

  getLangInfo(code: string): LanguageOption {
    return getLanguageDisplay(code)
  }

  addFormLanguage(code: string) {
    const normalized = (code || '').trim().toLowerCase()
    if (!normalized) return
    if (!this.formLanguages.includes(normalized)) {
      this.formLanguages.push(normalized)
      if (!this.formTranslations[normalized]) {
        this.formTranslations[normalized] = { Name: '', Description: '' }
      }
    }
    this.formLanguage = normalized
    this.customLangInput = ''
  }

  removeFormLanguage(code: string, event: Event) {
    event.stopPropagation()
    if (this.formLanguages.length <= 1) return
    this.formLanguages = this.formLanguages.filter((l) => l !== code)
    delete this.formTranslations[code]
    if (this.formLanguage === code) {
      this.formLanguage = this.formLanguages[0]
    }
  }

  loadCategories() {
    this.loading = true
    this.marketplaceService.getCategories(false).subscribe({
      next: (res) => {
        this.categories = res
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  save() {
    // Find primary name from 'fr' or current or any filled language
    const primaryName =
      this.formTranslations['fr']?.Name?.trim() ||
      this.formTranslations[this.formLanguage]?.Name?.trim() ||
      Object.values(this.formTranslations).find((t) => !!t.Name?.trim())?.Name?.trim() ||
      ''

    if (!primaryName) {
      this.error = 'Veuillez saisir un nom pour la catégorie dans au moins une langue.'
      return
    }

    const primaryDesc =
      this.formTranslations['fr']?.Description?.trim() ||
      this.formTranslations[this.formLanguage]?.Description?.trim() ||
      ''

    this.model.name = primaryName
    this.model.description = primaryDesc

    // Build dynamic translations dictionary
    const dynamicTranslations: { [culture: string]: { Name: string; Description: string } } = {}
    for (const lang of this.formLanguages) {
      const trans = this.formTranslations[lang]
      if (trans && (trans.Name?.trim() || trans.Description?.trim())) {
        dynamicTranslations[lang] = {
          Name: trans.Name?.trim() || primaryName,
          Description: trans.Description?.trim() || '',
        }
      }
    }
    this.model.displayOrder = Number(this.model.displayOrder) || 0
    this.model.iconUrl = this.model.iconUrl?.trim() || undefined
    this.model.translations = dynamicTranslations

    this.saving = true
    this.error = ''
    this.successMessage = ''
    const obs: Observable<any> = this.editId
      ? this.marketplaceService.updateCategory(this.editId, this.model)
      : this.marketplaceService.createCategory(this.model)

    obs.subscribe({
      next: () => {
        this.successMessage = this.editId
          ? 'Catégorie mise à jour avec ses traductions multilingues.'
          : 'Catégorie créée avec succès.'
        this.resetForm()
        this.loadCategories()
      },
      error: (err: any) => {
        this.saving = false
        console.error('Save category error:', err)
        const serverError =
          err.error?.error ||
          err.error?.Error ||
          err.error?.message ||
          err.error?.title ||
          (err.error?.errors ? Object.values(err.error.errors).flat().join(', ') : '') ||
          (typeof err.error === 'string' ? err.error : '') ||
          (err.status ? `Erreur HTTP ${err.status} (${err.statusText || 'Échec'})` : '')
        this.error = serverError || "Erreur lors de l'enregistrement de la catégorie."
      },
    })
  }

  edit(cat: CategoryDto) {
    this.editId = cat.id
    this.model = {
      name: cat.name,
      description: cat.description || '',
      iconUrl: cat.iconUrl || '',
      displayOrder: cat.displayOrder,
    }
    this.formLanguages = ['fr']
    this.formTranslations = {
      fr: { Name: cat.name, Description: cat.description || '' },
    }
    this.formLanguage = 'fr'
    this.editingPolicyCat = null

    this.marketplaceService.getCategoryTranslations(cat.id).subscribe({
      next: (trans) => {
        if (trans) {
          Object.keys(trans).forEach((lang) => {
            const culture = lang.toLowerCase()
            if (!this.formLanguages.includes(culture)) {
              this.formLanguages.push(culture)
            }
            this.formTranslations[culture] = {
              Name: trans[lang]['Name'] || '',
              Description: trans[lang]['Description'] || '',
            }
          })
        }
      },
      error: () => {},
    })
  }

  openPolicy(cat: CategoryDto) {
    this.editingPolicyCat = cat
    this.policyError = ''
    this.policySuccess = ''
    if (cat.policy) {
      this.policyForm = {
        minPublishLevel: cat.policy.minPublishLevel ?? 0,
        minBookLevel: cat.policy.minBookLevel ?? 0,
        maxWeightKg: cat.policy.maxWeightKg ?? null,
        maxValueAmount: cat.policy.maxValueAmount ?? null,
        requiresEscrow: cat.policy.requiresEscrow ?? true,
        requiresPreModeration: cat.policy.requiresPreModeration ?? false,
        defaultCommissionRate: (cat.policy.defaultCommissionRate ?? 0.10) * 100,
      }
    } else {
      this.policyForm = {
        minPublishLevel: 0,
        minBookLevel: 0,
        maxWeightKg: null,
        maxValueAmount: null,
        requiresEscrow: true,
        requiresPreModeration: false,
        defaultCommissionRate: 10,
      }
    }
  }

  savePolicy() {
    if (!this.editingPolicyCat) return
    this.policySaving = true
    this.policyError = ''
    this.policySuccess = ''

    const req: UpdateCategoryPolicyRequest = {
      minPublishLevel: Number(this.policyForm.minPublishLevel),
      minBookLevel: Number(this.policyForm.minBookLevel),
      maxWeightKg: this.policyForm.maxWeightKg != null ? Number(this.policyForm.maxWeightKg) : undefined,
      maxValueAmount: this.policyForm.maxValueAmount != null ? Number(this.policyForm.maxValueAmount) : undefined,
      requiresEscrow: Boolean(this.policyForm.requiresEscrow),
      requiresPreModeration: Boolean(this.policyForm.requiresPreModeration),
      defaultCommissionRate: (Number(this.policyForm.defaultCommissionRate) || 0) / 100,
    }

    this.marketplaceService.updateCategoryPolicy(this.editingPolicyCat.id, req).subscribe({
      next: () => {
        this.policySaving = false
        this.policySuccess = 'Politique de catégorie mise à jour avec succès.'
        this.loadCategories()
      },
      error: (err: any) => {
        this.policySaving = false
        this.policyError = err.error?.error || err.error?.message || 'Erreur lors de la mise à jour de la politique.'
      },
    })
  }

  closePolicy() {
    this.editingPolicyCat = null
  }

  toggleStatus(cat: CategoryDto) {
    this.marketplaceService.toggleCategoryStatus(cat.id, !cat.isActive).subscribe({
      next: () => this.loadCategories(),
      error: () => {},
    })
  }

  resetForm() {
    this.editId = null
    this.model = { name: '', description: '', iconUrl: '', displayOrder: 0 }
    this.formLanguages = ['fr']
    this.formTranslations = {
      fr: { Name: '', Description: '' },
    }
    this.formLanguage = 'fr'
    this.saving = false
    this.customLangInput = ''
  }

  openTranslations(cat: CategoryDto, content: any) {
    this.translatingCat = cat
    this.selectedCulture = 'fr'
    this.translationSuccess = ''
    this.translationError = ''
    this.translationLoading = true
    this.translatingLanguages = ['fr']
    this.translationData = {
      fr: { Name: cat.name, Description: cat.description || '' },
    }

    this.translationModalRef = this.modalService.open(content, { centered: true, size: 'lg' })

    this.marketplaceService.getCategoryTranslations(cat.id).subscribe({
      next: (translations) => {
        this.translationLoading = false
        if (translations) {
          Object.keys(translations).forEach((lang) => {
            const culture = lang.toLowerCase()
            if (!this.translatingLanguages.includes(culture)) {
              this.translatingLanguages.push(culture)
            }
            this.translationData[culture] = {
              Name: translations[lang]['Name'] || '',
              Description: translations[lang]['Description'] || '',
            }
          })
        }
      },
      error: (err) => {
        this.translationLoading = false
        console.error('Error loading translations:', err)
      },
    })
  }

  addModalLanguage(code: string) {
    const normalized = (code || '').trim().toLowerCase()
    if (!normalized) return
    if (!this.translatingLanguages.includes(normalized)) {
      this.translatingLanguages.push(normalized)
      if (!this.translationData[normalized]) {
        this.translationData[normalized] = { Name: '', Description: '' }
      }
    }
    this.selectedCulture = normalized
    this.customModalLangInput = ''
  }

  saveTranslation(culture: string) {
    if (!this.translatingCat) return
    this.translationSaving = true
    this.translationSuccess = ''
    this.translationError = ''

    const fields: { [field: string]: string } = {
      Name: this.translationData[culture]?.Name || '',
      Description: this.translationData[culture]?.Description || '',
    }

    this.marketplaceService.updateCategoryTranslation(this.translatingCat.id, culture, fields).subscribe({
      next: () => {
        this.translationSaving = false
        this.translationSuccess = `Traduction (${culture.toUpperCase()}) enregistrée avec succès.`
        this.loadCategories()
      },
      error: (err: any) => {
        this.translationSaving = false
        this.translationError =
          err.error?.error || err.error?.message || "Erreur lors de l'enregistrement de la traduction."
      },
    })
  }

  closeTranslationModal() {
    this.translationModalRef?.close()
    this.translationModalRef = null
    this.translatingCat = null
  }
}

