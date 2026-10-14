import { Component, OnInit, signal, computed } from '@angular/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { ProfileService } from '@core/services/profile.service'
import { ProfileDto } from '@core/models/profile/profile.model'
import {
  ProfileStatus,
  ProfileStatusLabels,
  ProfileStatusBadgeVariants,
  VerificationLevelLabels,
  VerificationLevelBadgeVariants,
} from '@core/models/shared/enums.model'
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
    PageBreadcrumb,
    DatePipe,
    RouterLink,
    Icon,
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
  loading = true
  error = ''
  success = ''

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
    this.loadProfile(id)
  }

  loadProfile(id: string) {
    this.loading = true
    this.profileService.getProfile(id).subscribe({
      next: (p) => {
        this.profile = p
        this.loading = false
      },
      error: () => {
        this.loading = false
        this.router.navigate(['/profiles/pending'])
      },
    })
  }

  verify() {
    if (!this.profile) return
    this.profileService.verifyProfile(this.profile.id).subscribe({
      next: () => {
        this.success = 'Profile verified'
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to verify'
      },
    })
  }

  activate() {
    if (!this.profile) return
    this.profileService.activateProfile(this.profile.id).subscribe({
      next: () => {
        this.success = 'Profile activated'
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to activate'
      },
    })
  }

  suspend() {
    if (!this.profile) return
    this.profileService.suspendProfile(this.profile.id).subscribe({
      next: () => {
        this.success = 'Profile suspended'
        this.loadProfile(this.profile!.id)
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Failed to suspend'
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