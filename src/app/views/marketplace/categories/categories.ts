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

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule, Icon, DecimalPipe],
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

  // Creation & Edition Translations
  formLanguage = 'fr'
  formLanguages = [
    { code: 'fr', label: 'Français (FR)', flag: '🇫🇷' },
    { code: 'en', label: 'English (EN)', flag: '🇬🇧' },
    { code: 'ru', label: 'Русский (RU)', flag: '🇷🇺' },
  ]
  formTranslations: { [culture: string]: { Name: string; Description: string } } = {
    fr: { Name: '', Description: '' },
    en: { Name: '', Description: '' },
    ru: { Name: '', Description: '' },
  }

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

  // Translation management
  translatingCat: CategoryDto | null = null
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
    this.model.name = this.formTranslations['fr'].Name || this.formTranslations['en'].Name || this.formTranslations['ru'].Name
    if (!this.model.name) {
      this.error = 'Le nom de la catégorie (au moins en français) est obligatoire.'
      return
    }
    this.model.description = this.formTranslations['fr'].Description || this.formTranslations['en'].Description || this.formTranslations['ru'].Description

    this.model.translations = {
      fr: { Name: this.formTranslations['fr'].Name || this.model.name, Description: this.formTranslations['fr'].Description || '' },
      en: { Name: this.formTranslations['en'].Name || '', Description: this.formTranslations['en'].Description || '' },
      ru: { Name: this.formTranslations['ru'].Name || '', Description: this.formTranslations['ru'].Description || '' },
    }

    this.saving = true
    this.error = ''
    this.successMessage = ''
    const obs: Observable<any> = this.editId
      ? this.marketplaceService.updateCategory(this.editId, this.model)
      : this.marketplaceService.createCategory(this.model)

    obs.subscribe({
      next: () => {
        this.successMessage = this.editId ? 'Catégorie mise à jour avec ses traductions.' : 'Catégorie créée avec succès.'
        this.resetForm()
        this.loadCategories()
      },
      error: (err: any) => {
        this.saving = false
        this.error = err.error?.error || err.error?.message || 'Erreur lors de l\'enregistrement de la catégorie.'
      },
    })
  }

  edit(cat: CategoryDto) {
    this.editId = cat.id
    this.model = { name: cat.name, description: cat.description || '', iconUrl: cat.iconUrl || '', displayOrder: cat.displayOrder }
    this.formTranslations = {
      fr: { Name: cat.name, Description: cat.description || '' },
      en: { Name: '', Description: '' },
      ru: { Name: '', Description: '' },
    }
    this.formLanguage = 'fr'
    this.editingPolicyCat = null

    this.marketplaceService.getCategoryTranslations(cat.id).subscribe({
      next: (trans) => {
        if (trans) {
          for (const lang of ['fr', 'en', 'ru']) {
            if (trans[lang]) {
              this.formTranslations[lang] = {
                Name: trans[lang]['Name'] || this.formTranslations[lang].Name,
                Description: trans[lang]['Description'] || this.formTranslations[lang].Description,
              }
            }
          }
        }
      },
      error: () => {}
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
    this.formTranslations = {
      fr: { Name: '', Description: '' },
      en: { Name: '', Description: '' },
      ru: { Name: '', Description: '' },
    }
    this.formLanguage = 'fr'
    this.saving = false
  }

  openTranslations(cat: CategoryDto, content: any) {
    this.translatingCat = cat
    this.selectedCulture = 'fr'
    this.translationSuccess = ''
    this.translationError = ''
    this.translationLoading = true
    this.translationData = {
      fr: { Name: cat.name, Description: cat.description || '' },
      en: { Name: '', Description: '' },
      ru: { Name: '', Description: '' }
    }

    this.translationModalRef = this.modalService.open(content, { centered: true, size: 'lg' })

    this.marketplaceService.getCategoryTranslations(cat.id).subscribe({
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
    if (!this.translatingCat) return
    this.translationSaving = true
    this.translationSuccess = ''
    this.translationError = ''

    const fields: { [field: string]: string } = {
      Name: this.translationData[culture]?.Name || '',
      Description: this.translationData[culture]?.Description || ''
    }

    this.marketplaceService.updateCategoryTranslation(this.translatingCat.id, culture, fields).subscribe({
      next: () => {
        this.translationSaving = false
        this.translationSuccess = `Traduction (${culture.toUpperCase()}) enregistrée avec succès.`
        this.loadCategories()
      },
      error: (err: any) => {
        this.translationSaving = false
        this.translationError = err.error?.error || err.error?.message || 'Erreur lors de l\'enregistrement de la traduction.'
      }
    })
  }

  closeTranslationModal() {
    this.translationModalRef?.close()
    this.translationModalRef = null
    this.translatingCat = null
  }
}

