import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core'
import { CommonModule, DecimalPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ProfileService } from '@core/services/profile.service'
import { ToastService } from '@core/services/toast.service'
import {
  ProfileTypePaymentPolicy,
  UpdatePaymentPolicyRequest,
  AllowedSettlementPolicy,
  DirectCashTiming,
  AllowedSettlementPolicyLabels,
  AllowedSettlementPolicyBadgeVariants,
  DirectCashTimingLabels,
} from '@core/models/marketplace/payment-policy.model'
import { ProfileTypeDto } from '@core/models/profile/profile.model'
import { forkJoin } from 'rxjs'

@Component({
  selector: 'app-payment-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, PageBreadcrumb, Icon],
  templateUrl: './payment-policies.html',
  styles: [`
    .policy-radio-card {
      border: 1px solid #e9ebec;
      border-radius: 8px;
      padding: 12px 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .policy-radio-card:hover {
      border-color: #405189;
      background-color: #f8f9fa;
    }
    .policy-radio-card.selected {
      border-color: #405189;
      background-color: #f3f6fc;
    }
    .country-flag {
      font-size: 1.4rem;
      line-height: 1;
    }
  `],
})
export class PaymentPolicies implements OnInit {
  policies: ProfileTypePaymentPolicy[] = []
  profileTypes: ProfileTypeDto[] = []
  loading = false
  saving = false
  searchTerm = ''

  @ViewChild('editModal') editModal!: TemplateRef<any>
  modalRef: NgbModalRef | null = null

  editingPolicy: ProfileTypePaymentPolicy | null = null
  editForm: UpdatePaymentPolicyRequest = {
    allowedPolicy: AllowedSettlementPolicy.Both,
    defaultCashTiming: DirectCashTiming.AtPickup,
    directBookingFeeEnabled: false,
    directBookingFeeFixedAmount: 0,
    directBookingFeeRate: 0,
    currency: 'XOF',
    isActive: true,
  }

  AllowedSettlementPolicy = AllowedSettlementPolicy
  DirectCashTiming = DirectCashTiming
  AllowedSettlementPolicyLabels = AllowedSettlementPolicyLabels
  AllowedSettlementPolicyBadgeVariants = AllowedSettlementPolicyBadgeVariants
  DirectCashTimingLabels = DirectCashTimingLabels

  constructor(
    private marketplaceService: MarketplaceService,
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
      policies: this.marketplaceService.getPaymentPolicies(),
      profileTypes: this.profileService.getProfileTypes(),
    }).subscribe({
      next: ({ policies, profileTypes }) => {
        this.profileTypes = profileTypes || []
        const typeMap = new Map<string, ProfileTypeDto>()
        const codeMap = new Map<string, ProfileTypeDto>()

        this.profileTypes.forEach((pt) => {
          typeMap.set(pt.id, pt)
          if (pt.countryCode) {
            codeMap.set(pt.countryCode.toUpperCase(), pt)
          }
        })

        const mappedPolicies: ProfileTypePaymentPolicy[] = []
        const existingTypeIds = new Set<string>()

        // 1. Map existing policies
        ;(policies || []).forEach((p) => {
          existingTypeIds.add(p.profileTypeId)
          const pt = typeMap.get(p.profileTypeId) || (p.countryCode ? codeMap.get(p.countryCode.toUpperCase()) : undefined)
          mappedPolicies.push({
            ...p,
            countryName: pt?.countryName || p.countryCode || 'Pays inconnu',
            flag: pt?.flag || '',
            currency: p.currency || pt?.currency || 'XOF',
          })
        })

        // 2. Add profile types that do not have an explicit policy record yet with sensible defaults
        this.profileTypes.forEach((pt) => {
          if (!existingTypeIds.has(pt.id)) {
            mappedPolicies.push({
              id: '',
              profileTypeId: pt.id,
              countryCode: pt.countryCode,
              countryName: pt.countryName,
              flag: pt.flag || '',
              allowedPolicy: AllowedSettlementPolicy.Both,
              defaultCashTiming: DirectCashTiming.AtPickup,
              directBookingFeeEnabled: false,
              directBookingFeeFixedAmount: 0,
              directBookingFeeRate: 0,
              currency: pt.currency || 'XOF',
              isActive: pt.isActive,
            })
          }
        })

        this.policies = mappedPolicies
        this.loading = false
      },
      error: () => {
        this.loading = false
        this.toast.error('Impossible de charger les politiques de règlement.')
      },
    })
  }

  get filteredPolicies(): ProfileTypePaymentPolicy[] {
    if (!this.searchTerm.trim()) {
      return this.policies
    }
    const term = this.searchTerm.toLowerCase()
    return this.policies.filter(
      (p) =>
        p.countryName?.toLowerCase().includes(term) ||
        p.countryCode?.toLowerCase().includes(term) ||
        p.currency?.toLowerCase().includes(term)
    )
  }

  get stats() {
    const total = this.policies.length
    const escrowOnly = this.policies.filter((p) => p.allowedPolicy === AllowedSettlementPolicy.WalletEscrowOnly).length
    const directOnly = this.policies.filter((p) => p.allowedPolicy === AllowedSettlementPolicy.DirectHandoverOnly).length
    const both = this.policies.filter((p) => p.allowedPolicy === AllowedSettlementPolicy.Both).length
    const feeEnabled = this.policies.filter((p) => p.directBookingFeeEnabled).length
    return { total, escrowOnly, directOnly, both, feeEnabled }
  }

  openEditModal(policy: ProfileTypePaymentPolicy): void {
    this.editingPolicy = policy
    this.editForm = {
      allowedPolicy: policy.allowedPolicy ?? AllowedSettlementPolicy.Both,
      defaultCashTiming: policy.defaultCashTiming ?? DirectCashTiming.AtPickup,
      directBookingFeeEnabled: !!policy.directBookingFeeEnabled,
      directBookingFeeFixedAmount: policy.directBookingFeeFixedAmount || 0,
      directBookingFeeRate: policy.directBookingFeeRate || 0,
      currency: policy.currency || 'XOF',
      isActive: policy.isActive ?? true,
    }
    this.modalRef = this.modalService.open(this.editModal, { centered: true, size: 'lg' })
  }

  closeModal(): void {
    this.modalRef?.close()
    this.modalRef = null
    this.editingPolicy = null
  }

  savePolicy(): void {
    if (!this.editingPolicy) return
    this.saving = true

    this.marketplaceService
      .updatePaymentPolicy(this.editingPolicy.profileTypeId, this.editForm)
      .subscribe({
        next: () => {
          this.saving = false
          this.toast.success(
            `Politique de règlement pour ${this.editingPolicy?.countryName || this.editingPolicy?.countryCode} mise à jour avec succès.`
          )
          this.closeModal()
          this.loadData()
        },
        error: (err) => {
          this.saving = false
          const msg =
            err.error?.message ||
            err.error?.title ||
            'Une erreur est survenue lors de l\'enregistrement de la politique.'
          this.toast.error(msg)
        },
      })
  }
}
