import { Component, OnInit } from '@angular/core'
import { DecimalPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
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

  VerificationLevelLabels = VerificationLevelLabels
  VerificationLevelBadgeVariants = VerificationLevelBadgeVariants
  verificationLevels = [
    { value: VerificationLevel.L0_Registered, label: 'L0 - Enregistré (Tous)' },
    { value: VerificationLevel.L1_IdentityDeclared, label: 'L1 - Identité déclarée' },
    { value: VerificationLevel.L2_IdentityVerified, label: 'L2 - Identité vérifiée (KYC)' },
    { value: VerificationLevel.L3_EnhancedVerified, label: 'L3 - Vérification renforcée' },
  ]

  constructor(
    private marketplaceService: MarketplaceService
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
    if (!this.model.name) return
    this.saving = true
    this.error = ''
    this.successMessage = ''
    const obs: Observable<any> = this.editId
      ? this.marketplaceService.updateCategory(this.editId, this.model)
      : this.marketplaceService.createCategory(this.model)

    obs.subscribe({
      next: () => {
        this.successMessage = this.editId ? 'Catégorie mise à jour.' : 'Catégorie créée avec succès.'
        this.resetForm()
        this.loadCategories()
      },
      error: (err: any) => {
        this.saving = false
        this.error = err.error?.error || err.error?.message || 'Failed to save'
      },
    })
  }

  edit(cat: CategoryDto) {
    this.editId = cat.id
    this.model = { name: cat.name, description: cat.description || '', iconUrl: cat.iconUrl || '', displayOrder: cat.displayOrder }
    this.editingPolicyCat = null
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
    this.saving = false
  }
}
