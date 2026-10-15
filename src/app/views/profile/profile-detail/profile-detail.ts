import { Component, OnInit, signal, computed } from '@angular/core'
import { DatePipe, CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { ProfileService } from '@core/services/profile.service'
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
    { id: 'wallet', label: 'Wallet', icon: 'wallet' },
  ]

  ProfileStatus = ProfileStatus
  statusLabels = ProfileStatusLabels
  statusBadges = ProfileStatusBadgeVariants
  verificationLevelLabels = VerificationLevelLabels
  verificationLevelBadges = VerificationLevelBadgeVariants

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!
    this.loadProfileTypes()
    this.loadProfile(id)
  }

  loadProfileTypes() {
    this.profileService.getProfileTypes().subscribe({
      next: (types) => this.profileTypes.set(types),
      error: () => {}
    })
  }

  getProfileTypeDisplay(profileTypeId?: string): string {
    if (!profileTypeId) return 'Non spécifié';
    const found = this.profileTypes().find(t => t.id === profileTypeId);
    if (found) {
      return `${found.flag ? found.flag + ' ' : ''}${found.countryName} (${found.countryCode})`;
    }
    if (this.profile?.profileTypeName) {
      return `${this.profile.flag ? this.profile.flag + ' ' : ''}${this.profile.profileTypeName}`;
    }
    return profileTypeId;
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
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        this.levelUpdating = false
        this.error = err.error?.error || err.error?.message || 'Erreur lors de la mise à jour du niveau'
      }
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

  isPendingVerification(): boolean {
    if (!this.profile) return false
    const s: any = this.profile.status
    return s === ProfileStatus.PendingVerification || s === 0 || s === 'PendingVerification'
  }

  verify() {
    if (!this.profile) return
    this.clearMessages()
    this.profileService.verifyProfile(this.profile.id).subscribe({
      next: () => {
        this.success = 'Profil vérifié avec succès.'
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Échec de la vérification'
      },
    })
  }

  activate() {
    if (!this.profile) return
    this.clearMessages()
    this.profileService.activateProfile(this.profile.id).subscribe({
      next: () => {
        this.success = 'Profil activé avec succès.'
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || "Échec de l'activation"
      },
    })
  }

  suspend() {
    if (!this.profile) return
    this.clearMessages()
    this.profileService.suspendProfile(this.profile.id).subscribe({
      next: () => {
        this.success = 'Profil suspendu avec succès.'
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Échec de la suspension'
      },
    })
  }

  reactivate() {
    if (!this.profile) return
    this.clearMessages()
    this.profileService.reactivateProfile(this.profile.id).subscribe({
      next: () => {
        this.success = 'Profil réactivé avec succès.'
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        // Fallback automatique sur activateProfile si l'endpoint reactivate n'est pas routé directement
        this.profileService.activateProfile(this.profile!.id).subscribe({
          next: () => {
            this.success = 'Profil réactivé avec succès.'
            this.loadProfile(this.profile!.id)
          },
          error: (fallbackErr: any) => {
            this.error =
              fallbackErr.error?.error ||
              fallbackErr.error?.message ||
              err.error?.error ||
              'Erreur lors de la réactivation du profil.'
          },
        })
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