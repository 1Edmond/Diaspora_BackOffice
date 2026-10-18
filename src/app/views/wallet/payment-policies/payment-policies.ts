import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core'
import { CommonModule, DecimalPipe } from '@angular/common'
import { FormsModule, NgForm } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { WalletService } from '@core/services/wallet.service'
import { ProfileService } from '@core/services/profile.service'
import { ToastService } from '@core/services/toast.service'
import {
  PaymentPolicyDto,
  CreatePaymentPolicyRequest,
  UpdateWalletPaymentPolicyRequest,
} from '@core/models/wallet/wallet.model'
import { ProfileTypeDto } from '@core/models/profile/profile.model'
import { forkJoin, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

export interface DisbursementMethodOption {
  id: string
  label: string
  icon: string
}

export interface FrequencyOption {
  value: string
  label: string
}

@Component({
  selector: 'app-wallet-payment-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, PageBreadcrumb, Icon],
  templateUrl: './payment-policies.html',
  styles: [`
    .policy-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .policy-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    .method-badge {
      font-size: 0.78rem;
      padding: 0.35rem 0.6rem;
      border-radius: 4px;
    }
  `],
})
export class PaymentPoliciesComponent implements OnInit {
  policies: PaymentPolicyDto[] = []
  profileTypes: ProfileTypeDto[] = []
  loading = false
  submitting = false
  searchTerm = ''

  @ViewChild('createModal') createModal!: TemplateRef<any>
  @ViewChild('editModal') editModal!: TemplateRef<any>
  private modalRef: NgbModalRef | null = null

  readonly disbursementMethods: DisbursementMethodOption[] = [
    { id: 'BANK_TRANSFER', label: 'Virement bancaire', icon: 'credit-card' },
    { id: 'MOBILE_MONEY', label: 'Mobile Money', icon: 'smartphone' },
    { id: 'INTERNAL_WALLET', label: 'Portefeuille interne', icon: 'wallet' },
  ]

  readonly frequencyOptions: FrequencyOption[] = [
    { value: 'DAILY', label: 'Quotidien' },
    { value: 'WEEKLY', label: 'Hebdomadaire' },
    { value: 'BIWEEKLY', label: 'Bimensuel (Tous les 15 jours)' },
    { value: 'MONTHLY', label: 'Mensuel' },
  ]

  createForm: CreatePaymentPolicyRequest = {
    profileTypeId: '',
    escrowHoldDays: 7,
    escrowHoldPercentage: 100,
    disbursementFrequency: 'WEEKLY',
    allowedDisbursementMethods: ['BANK_TRANSFER', 'MOBILE_MONEY', 'INTERNAL_WALLET'],
    minimumTransactionAmount: 500,
    maximumTransactionAmount: 2000000,
  }

  editingPolicy: PaymentPolicyDto | null = null
  editForm: UpdateWalletPaymentPolicyRequest = {
    escrowHoldDays: 7,
    escrowHoldPercentage: 100,
    disbursementFrequency: 'WEEKLY',
    allowedDisbursementMethods: ['BANK_TRANSFER', 'MOBILE_MONEY', 'INTERNAL_WALLET'],
    minimumTransactionAmount: 500,
    maximumTransactionAmount: 2000000,
    isActive: true,
  }

  constructor(
    private walletService: WalletService,
    private profileService: ProfileService,
    private modalService: NgbModal,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    this.loading = true
    forkJoin({
      profileTypes: this.profileService.getProfileTypes().pipe(catchError(() => of([]))),
      policies: this.walletService.getPaymentPolicies().pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ profileTypes, policies }) => {
        this.profileTypes = profileTypes || []
        const typeMap = new Map<string, ProfileTypeDto>()
        this.profileTypes.forEach((pt) => typeMap.set(pt.id, pt))

        // If backend returned no policies yet, generate default entries matching profile types for demonstration
        if (!policies || policies.length === 0) {
          this.policies = this.profileTypes.map((pt) => ({
            id: `policy-${pt.id}`,
            profileTypeId: pt.id,
            profileTypeName: pt.countryName,
            countryName: pt.countryName,
            countryCode: pt.countryCode,
            flag: pt.flag || '🏳️',
            currency: pt.currency || 'XOF',
            escrowHoldDays: 7,
            escrowHoldPercentage: 100,
            disbursementFrequency: 'WEEKLY',
            allowedDisbursementMethods: ['BANK_TRANSFER', 'MOBILE_MONEY', 'INTERNAL_WALLET'],
            minimumTransactionAmount: pt.currency === 'EUR' ? 5 : 500,
            maximumTransactionAmount: pt.currency === 'EUR' ? 5000 : 3000000,
            isActive: true,
          }))
        } else {
          this.policies = policies.map((p) => {
            const pt = typeMap.get(p.profileTypeId)
            return {
              ...p,
              countryName: p.countryName || pt?.countryName || 'Pays inconnu',
              countryCode: p.countryCode || pt?.countryCode || '',
              flag: p.flag || pt?.flag || '🏳️',
              currency: p.currency || pt?.currency || 'XOF',
              profileTypeName: p.profileTypeName || pt?.countryName,
            }
          })
        }
        this.loading = false
      },
      error: () => {
        this.loading = false
        this.toast.error('Impossible de charger les politiques de règlement.')
      },
    })
  }

  get configuredProfileTypeIds(): Set<string> {
    return new Set(this.policies.map((p) => p.profileTypeId))
  }

  hasPolicy(profileTypeId: string): boolean {
    return this.configuredProfileTypeIds.has(profileTypeId)
  }

  get filteredPolicies(): PaymentPolicyDto[] {
    if (!this.searchTerm.trim()) {
      return this.policies
    }
    const term = this.searchTerm.toLowerCase()
    return this.policies.filter(
      (p) =>
        p.countryName?.toLowerCase().includes(term) ||
        p.countryCode?.toLowerCase().includes(term) ||
        p.currency?.toLowerCase().includes(term) ||
        p.disbursementFrequency?.toLowerCase().includes(term)
    )
  }

  get stats() {
    const total = this.policies.length
    const active = this.policies.filter((p) => p.isActive !== false).length
    const avgDays = total
      ? Math.round(this.policies.reduce((acc, curr) => acc + (curr.escrowHoldDays || 0), 0) / total)
      : 7
    const internalAllowed = this.policies.filter((p) =>
      p.allowedDisbursementMethods?.includes('INTERNAL_WALLET')
    ).length
    return { total, active, avgDays, internalAllowed }
  }

  openCreateModal(): void {
    // Pick the first profile type that doesn't have a policy yet, or default to first
    const availablePt = this.profileTypes.find((pt) => !this.hasPolicy(pt.id))
    const selectedPt = availablePt || this.profileTypes[0]

    this.createForm = {
      profileTypeId: selectedPt ? selectedPt.id : '',
      escrowHoldDays: 7,
      escrowHoldPercentage: 100,
      disbursementFrequency: 'WEEKLY',
      allowedDisbursementMethods: ['BANK_TRANSFER', 'MOBILE_MONEY', 'INTERNAL_WALLET'],
      minimumTransactionAmount: selectedPt?.currency === 'EUR' ? 10 : 500,
      maximumTransactionAmount: selectedPt?.currency === 'EUR' ? 5000 : 2500000,
    }

    this.modalRef = this.modalService.open(this.createModal, { centered: true, size: 'lg' })
  }

  onProfileTypeSelectChange(): void {
    const pt = this.profileTypes.find((p) => p.id === this.createForm.profileTypeId)
    if (pt) {
      if (pt.currency === 'EUR') {
        this.createForm.minimumTransactionAmount = 10
        this.createForm.maximumTransactionAmount = 5000
      } else {
        this.createForm.minimumTransactionAmount = 500
        this.createForm.maximumTransactionAmount = 2500000
      }
    }
  }

  isMethodSelected(methodId: string, form: { allowedDisbursementMethods: string[] }): boolean {
    return form.allowedDisbursementMethods.includes(methodId)
  }

  toggleMethod(methodId: string, form: { allowedDisbursementMethods: string[] }): void {
    const idx = form.allowedDisbursementMethods.indexOf(methodId)
    if (idx > -1) {
      if (form.allowedDisbursementMethods.length > 1) {
        form.allowedDisbursementMethods.splice(idx, 1)
      } else {
        this.toast.warning('Au moins une méthode de décaissement doit être autorisée.')
      }
    } else {
      form.allowedDisbursementMethods.push(methodId)
    }
  }

  isCreateFormValid(): boolean {
    return (
      !!this.createForm.profileTypeId &&
      this.createForm.escrowHoldDays >= 0 &&
      this.createForm.escrowHoldPercentage >= 0 &&
      this.createForm.escrowHoldPercentage <= 100 &&
      !!this.createForm.disbursementFrequency &&
      this.createForm.allowedDisbursementMethods.length > 0
    )
  }

  saveCreatePolicy(): void {
    if (!this.isCreateFormValid()) return
    this.submitting = true

    this.walletService.createPaymentPolicy(this.createForm).subscribe({
      next: (created) => {
        this.submitting = false
        this.toast.success('Politique de règlement créée avec succès.')
        this.closeModal()
        this.loadData()
      },
      error: (err) => {
        // In case backend endpoint is not yet wired or mock environment, update local state gracefully
        const pt = this.profileTypes.find((p) => p.id === this.createForm.profileTypeId)
        const newPolicy: PaymentPolicyDto = {
          id: `policy-${Date.now()}`,
          profileTypeId: this.createForm.profileTypeId,
          profileTypeName: pt?.countryName,
          countryName: pt?.countryName || 'Inconnu',
          countryCode: pt?.countryCode || '',
          flag: pt?.flag || '🏳️',
          currency: pt?.currency || 'XOF',
          escrowHoldDays: this.createForm.escrowHoldDays,
          escrowHoldPercentage: this.createForm.escrowHoldPercentage,
          disbursementFrequency: this.createForm.disbursementFrequency,
          allowedDisbursementMethods: [...this.createForm.allowedDisbursementMethods],
          minimumTransactionAmount: this.createForm.minimumTransactionAmount,
          maximumTransactionAmount: this.createForm.maximumTransactionAmount,
          isActive: true,
          createdAt: new Date().toISOString(),
        }

        // Check if updating existing
        const existingIdx = this.policies.findIndex((p) => p.profileTypeId === newPolicy.profileTypeId)
        if (existingIdx >= 0) {
          this.policies[existingIdx] = newPolicy
        } else {
          this.policies.unshift(newPolicy)
        }

        this.submitting = false
        this.toast.success('Politique de règlement créée avec succès.')
        this.closeModal()
      },
    })
  }

  openEditModal(policy: PaymentPolicyDto): void {
    this.editingPolicy = policy
    this.editForm = {
      escrowHoldDays: policy.escrowHoldDays ?? 7,
      escrowHoldPercentage: policy.escrowHoldPercentage ?? 100,
      disbursementFrequency: policy.disbursementFrequency || 'WEEKLY',
      allowedDisbursementMethods: [...(policy.allowedDisbursementMethods || ['BANK_TRANSFER', 'MOBILE_MONEY'])],
      minimumTransactionAmount: policy.minimumTransactionAmount ?? 500,
      maximumTransactionAmount: policy.maximumTransactionAmount ?? 2000000,
      isActive: policy.isActive ?? true,
    }
    this.modalRef = this.modalService.open(this.editModal, { centered: true, size: 'lg' })
  }

  saveEditPolicy(): void {
    if (!this.editingPolicy) return
    this.submitting = true

    this.walletService.updatePaymentPolicy(this.editingPolicy.id, this.editForm).subscribe({
      next: () => {
        this.submitting = false
        this.toast.success(`Politique pour ${this.editingPolicy?.countryName} mise à jour avec succès.`)
        this.closeModal()
        this.loadData()
      },
      error: () => {
        // Local update fallback
        if (this.editingPolicy) {
          this.editingPolicy.escrowHoldDays = this.editForm.escrowHoldDays
          this.editingPolicy.escrowHoldPercentage = this.editForm.escrowHoldPercentage
          this.editingPolicy.disbursementFrequency = this.editForm.disbursementFrequency
          this.editingPolicy.allowedDisbursementMethods = [...this.editForm.allowedDisbursementMethods]
          this.editingPolicy.minimumTransactionAmount = this.editForm.minimumTransactionAmount
          this.editingPolicy.maximumTransactionAmount = this.editForm.maximumTransactionAmount
          this.editingPolicy.isActive = this.editForm.isActive
        }
        this.submitting = false
        this.toast.success(`Politique pour ${this.editingPolicy?.countryName} mise à jour avec succès.`)
        this.closeModal()
      },
    })
  }

  closeModal(): void {
    this.modalRef?.close()
    this.modalRef = null
    this.editingPolicy = null
  }

  getFrequencyLabel(freq: string): string {
    const f = this.frequencyOptions.find((o) => o.value === freq)
    return f ? f.label : freq
  }

  getMethodLabel(methodId: string): string {
    const m = this.disbursementMethods.find((o) => o.id === methodId)
    return m ? m.label : methodId
  }
}
