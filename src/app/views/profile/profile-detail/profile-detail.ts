import { Component, OnInit, signal } from '@angular/core'
import { DatePipe, CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { ProfileService } from '@core/services/profile.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import { ProfileDto, ProfileTypeDto } from '@core/models/profile/profile.model'
import {
  ProfileStatus,
  ProfileStatusLabels,
  ProfileStatusBadgeVariants,
  VerificationLevel,
  VerificationLevelLabels,
  VerificationLevelBadgeVariants,
} from '@core/models/shared/enums.model'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { ProfileDocumentsTab } from './profile-documents-tab/profile-documents-tab'
import { ProfileKycTab } from './profile-kyc-tab/profile-kyc-tab'
import { ProfileServicesTab } from './profile-services-tab/profile-services-tab'
import { ProfileProceduresTab } from './profile-procedures-tab/profile-procedures-tab'
import { ProfileWalletTab } from './profile-wallet-tab/profile-wallet-tab'

type TabType = 'overview' | 'documents' | 'kyc' | 'services' | 'procedures' | 'wallet'

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumb,
    DatePipe,
    RouterLink,
    Icon,
    NgbDropdownModule,
    ProfileDocumentsTab,
    ProfileKycTab,
    ProfileServicesTab,
    ProfileProceduresTab,
    ProfileWalletTab,
  ],
  templateUrl: './profile-detail.html',
  styles: ``,
})
export class ProfileDetail implements OnInit {
  profile: ProfileDto | null = null
  profileTypes = signal<ProfileTypeDto[]>([])
  loading = true
  error = ''
  success = ''
  levelUpdating = false
  selectedLevel: number = 2

  activeTab = signal<TabType>('overview')

  tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'user' },
    { id: 'documents', label: 'Documents', icon: 'file-text' },
    { id: 'kyc', label: 'KYC', icon: 'shield-check' },
    { id: 'services', label: 'Services', icon: 'briefcase' },
    { id: 'procedures', label: 'Procedures', icon: 'clipboard-list' },
    { id: 'wallet', label: 'Wallet', icon: 'credit-card' },
  ]

  ProfileStatus = ProfileStatus
  statusLabels = ProfileStatusLabels
  statusBadges = ProfileStatusBadgeVariants
  verificationLevelLabels = VerificationLevelLabels
  verificationLevelBadges = VerificationLevelBadgeVariants

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!
    const tabParam = this.route.snapshot.queryParamMap.get('tab') as TabType | null
    if (tabParam && this.tabs.some((t) => t.id === tabParam)) {
      this.activeTab.set(tabParam)
    }
    this.loadProfileTypes()
    this.loadProfile(id)
  }

  loadProfileTypes() {
    this.profileService.getProfileTypes().subscribe({
      next: (types) => this.profileTypes.set(types),
      error: () => {},
    })
  }

  getProfileTypeDisplay(profileTypeId?: string): string {
    if (!profileTypeId) return 'Non spécifié'
    const found = this.profileTypes().find((t) => t.id === profileTypeId)
    if (found) {
      return `${found.flag ? found.flag + ' ' : ''}${found.countryName} (${found.countryCode})`
    }
    if (this.profile?.profileTypeName) {
      return `${this.profile.flag ? this.profile.flag + ' ' : ''}${this.profile.profileTypeName}`
    }
    return profileTypeId
  }

  getCountryCode(): string {
    if (!this.profile) return 'N/A'
    if (this.profile.countryCode) return this.profile.countryCode
    const found = this.profileTypes().find((t) => t.id === this.profile?.profileTypeId)
    return found?.countryCode || this.profile.profileTypeName || 'N/A'
  }

  loadProfile(id: string) {
    this.loading = true
    this.profileService.getProfile(id).subscribe({
      next: (p) => {
        this.profile = p
        this.selectedLevel = p.verificationLevel ?? 0
        this.loading = false
      },
      error: () => {
        this.loading = false
        this.router.navigate(['/profiles/pending'])
      },
    })
  }

  updateVerificationLevel(level: number) {
    if (!this.profile) return
    this.levelUpdating = true
    this.profileService.setVerificationLevel(this.profile.id, level).subscribe({
      next: () => {
        this.levelUpdating = false
        this.success = `Niveau de vérification mis à jour : ${this.verificationLevelLabels[level as VerificationLevel]}`
        this.toast.success(this.success)
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        this.levelUpdating = false
        this.error = err.error?.error || err.error?.message || 'Erreur lors de la mise à jour du niveau'
        this.toast.error(this.error)
      },
    })
  }

  isSuspended(): boolean {
    if (!this.profile) return false
    const s: any = this.profile.status
    return s === ProfileStatus.Suspended || s === 2 || s === 'Suspended'
  }

  isActivated(): boolean {
    if (!this.profile) return false
    const s: any = this.profile.status
    return s === ProfileStatus.Activate || s === 3 || s === 'Activate' || s === 'Active'
  }

  isVerifiedStatus(): boolean {
    if (!this.profile) return false
    const s: any = this.profile.status
    return s === ProfileStatus.Verified || s === 1 || s === 'Verified'
  }

  isPendingVerification(): boolean {
    if (!this.profile) return false
    const s: any = this.profile.status
    return s === ProfileStatus.PendingVerification || s === 0 || s === 'PendingVerification'
  }

  async verify() {
    if (!this.profile) return
    const confirmed = await this.confirmModal.confirm({
      title: 'Vérifier l\'identité déclarée (Passer L1)',
      message: `Voulez-vous vérifier les informations déclarées du profil de ${this.profile.firstName} ${this.profile.lastName} et le passer au niveau L1 (Identité déclarée) ?`,
      confirmText: 'Vérifier (Passer L1)',
      variant: 'info',
      icon: 'check-circle',
    })
    if (!confirmed) return

    this.clearMessages()
    this.profileService.verifyProfile(this.profile.id).subscribe({
      next: () => {
        this.success = 'Profil vérifié avec succès (Niveau L1 - Identité déclarée).'
        this.toast.success(this.success)
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Échec de la vérification'
        this.toast.error(this.error)
      },
    })
  }

  async activate() {
    if (!this.profile) return
    const currentLevel = this.profile.verificationLevel ?? 0
    if (currentLevel < 2) {
      this.toast.warning(
        `Pour activer ce profil, son dossier KYC doit d'abord être validé (L2 minimum) conformément aux exigences KYC du pays (${this.getCountryCode()}).`
      )
      this.setActiveTab('kyc')
      return
    }

    const confirmed = await this.confirmModal.confirm({
      title: 'Activer le profil',
      message: `Confirmez-vous l'activation définitive du profil de ${this.profile.firstName} ${this.profile.lastName} (Niveau KYC : ${this.verificationLevelLabels[currentLevel as VerificationLevel]}) ?`,
      confirmText: 'Activer le profil',
      variant: 'success',
      icon: 'shield-check',
    })
    if (!confirmed) return

    this.clearMessages()
    this.profileService.activateProfile(this.profile.id).subscribe({
      next: () => {
        this.success = 'Profil activé avec succès.'
        this.toast.success(this.success)
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || "Échec de l'activation"
        this.toast.error(this.error)
      },
    })
  }

  async suspend() {
    if (!this.profile) return
    const confirmed = await this.confirmModal.confirm({
      title: 'Suspendre le profil',
      message: `Êtes-vous sûr de vouloir suspendre le profil de ${this.profile.firstName} ${this.profile.lastName} ?`,
      confirmText: 'Suspendre',
      variant: 'danger',
      icon: 'alert-triangle',
    })
    if (!confirmed) return

    this.clearMessages()
    this.profileService.suspendProfile(this.profile.id).subscribe({
      next: () => {
        this.success = 'Profil suspendu avec succès.'
        this.toast.warning(this.success)
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Échec de la suspension'
        this.toast.error(this.error)
      },
    })
  }

  async reactivate() {
    if (!this.profile) return
    const confirmed = await this.confirmModal.confirm({
      title: 'Réactiver le profil',
      message: `Voulez-vous réactiver le profil suspendu de ${this.profile.firstName} ${this.profile.lastName} ?`,
      confirmText: 'Réactiver',
      variant: 'warning',
      icon: 'refresh-cw',
    })
    if (!confirmed) return

    this.clearMessages()
    this.profileService.reactivateProfile(this.profile.id).subscribe({
      next: () => {
        this.success = 'Profil réactivé avec succès.'
        this.toast.success(this.success)
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        const errorMsg =
          err.error?.error ||
          err.error?.Error ||
          err.error?.message ||
          err.error?.title ||
          (err.status ? `Erreur HTTP ${err.status}` : 'Erreur lors de la réactivation du profil.')
        this.error = errorMsg
        this.toast.error(this.error)
      },
    })
  }

  clearMessages() {
    this.error = ''
    this.success = ''
  }

  setActiveTab(tab: TabType) {
    this.activeTab.set(tab)
  }
}