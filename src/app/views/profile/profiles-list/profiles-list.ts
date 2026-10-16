import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
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
  VerificationLevelLabels,
  VerificationLevelBadgeVariants,
} from '@core/models/shared/enums.model'

@Component({
  selector: 'app-profiles-list',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, RouterLink, FormsModule, Icon],
  templateUrl: './profiles-list.html',
  styles: ``,
})
export class ProfilesList implements OnInit {
  profiles: ProfileDto[] = []
  profileTypes: ProfileTypeDto[] = []

  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  loading = false

  searchTerm = ''
  selectedStatus = ''
  selectedProfileTypeId = ''
  sortBy = 'createdAt'
  sortDirection: 'asc' | 'desc' = 'desc'

  ProfileStatus = ProfileStatus
  statusLabels = ProfileStatusLabels
  statusBadges = ProfileStatusBadgeVariants
  verificationLevelLabels = VerificationLevelLabels
  verificationLevelBadges = VerificationLevelBadgeVariants

  statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: '0', label: 'En attente de vérification (L0)' },
    { value: '1', label: 'Vérifié (L1)' },
    { value: '2', label: 'Suspendu' },
    { value: '3', label: 'Actif (L2/L3)' },
  ]

  constructor(
    private profileService: ProfileService,
    private confirmModal: ConfirmModalService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfileTypes()
    this.loadProfiles()
  }

  loadProfileTypes() {
    this.profileService.getProfileTypes().subscribe({
      next: (types) => { this.profileTypes = types },
      error: () => {},
    })
  }

  getProfileTypeName(typeId: string): string {
    const pt = this.profileTypes.find(t => t.id === typeId)
    return pt ? pt.countryName : typeId || '—'
  }

  loadProfiles() {
    this.loading = true
    const statusNum = this.selectedStatus !== '' ? Number(this.selectedStatus) : undefined
    this.profileService.getProfiles({
      pageNumber: this.page,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      status: statusNum,
      profileTypeId: this.selectedProfileTypeId || undefined,
    }).subscribe({
      next: (res) => {
        let items = res.items || []
        items = this.sortItems(items)
        this.profiles = items
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages || Math.ceil(res.totalCount / this.pageSize) || 1
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  sortItems(items: ProfileDto[]): ProfileDto[] {
    return [...items].sort((a, b) => {
      let valA: any = ''
      let valB: any = ''

      if (this.sortBy === 'name') {
        valA = `${a.firstName} ${a.lastName}`.toLowerCase()
        valB = `${b.firstName} ${b.lastName}`.toLowerCase()
      } else if (this.sortBy === 'status') {
        valA = a.status
        valB = b.status
      } else if (this.sortBy === 'country') {
        valA = (a.profileTypeName || this.getProfileTypeName(a.profileTypeId)).toLowerCase()
        valB = (b.profileTypeName || this.getProfileTypeName(b.profileTypeId)).toLowerCase()
      } else {
        valA = new Date(a.createdAt || 0).getTime()
        valB = new Date(b.createdAt || 0).getTime()
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  onSearch() {
    this.page = 1
    this.loadProfiles()
  }

  onFilterChange() {
    this.page = 1
    this.loadProfiles()
  }

  onSort(field: string) {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortBy = field
      this.sortDirection = 'asc'
    }
    this.loadProfiles()
  }

  onPageChange(page: number) {
    this.page = page
    this.loadProfiles()
  }

  async verifyProfile(profile: ProfileDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Vérifier l\'identité déclarée (Passer L1)',
      message: `Confirmez-vous la vérification du profil de ${profile.firstName} ${profile.lastName} ?\nCette action passera le profil au statut "Vérifié" et au niveau L1 (Identité déclarée).`,
      confirmText: 'Vérifier (Passer L1)',
      variant: 'info',
      icon: 'check-circle',
    })
    if (!confirmed) return

    this.profileService.verifyProfile(profile.id).subscribe({
      next: () => {
        this.toast.success(`Profil ${profile.firstName} ${profile.lastName} vérifié (Niveau L1).`)
        this.loadProfiles()
      },
      error: (err) => {
        this.toast.error(err.error?.error || err.error?.message || 'Erreur lors de la vérification du profil.')
      },
    })
  }

  async activateProfile(profile: ProfileDto) {
    const currentLevel = profile.verificationLevel ?? 0
    if (currentLevel < 2) {
      const openKyc = await this.confirmModal.confirm({
        title: 'Validation KYC requise (Niveau L2 minimum)',
        message: `Le profil de ${profile.firstName} ${profile.lastName} est actuellement au niveau ${this.verificationLevelLabels[currentLevel as 0 | 1] || 'L' + currentLevel}.\n\nLe dossier KYC doit d'abord être validé au Niveau L2 minimum (Identité vérifiée) selon les exigences du type de profil (${profile.profileTypeName || this.getProfileTypeName(profile.profileTypeId)}) avant de pouvoir activer ce profil.\n\nSouhaitez-vous ouvrir l'onglet KYC de ce profil ?`,
        confirmText: 'Ouvrir le dossier KYC',
        cancelText: 'Fermer',
        variant: 'warning',
        icon: 'shield-check',
      })
      if (openKyc) {
        this.router.navigate(['/profiles', profile.id], { queryParams: { tab: 'kyc' } })
      }
      return
    }

    const confirmed = await this.confirmModal.confirm({
      title: 'Activer le profil',
      message: `Voulez-vous activer le profil de ${profile.firstName} ${profile.lastName} (Niveau KYC actuel : ${this.verificationLevelLabels[currentLevel as 2 | 3]}) ?`,
      confirmText: 'Activer le profil',
      variant: 'success',
      icon: 'check-circle',
    })
    if (!confirmed) return

    this.profileService.activateProfile(profile.id).subscribe({
      next: () => {
        this.toast.success(`Profil ${profile.firstName} ${profile.lastName} activé avec succès.`)
        this.loadProfiles()
      },
      error: (err) => {
        this.toast.error(err.error?.error || err.error?.message || 'Erreur lors de l\'activation du profil.')
      },
    })
  }

  async reactivateProfile(profile: ProfileDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Réactiver le profil',
      message: `Voulez-vous réactiver le profil suspendu de ${profile.firstName} ${profile.lastName} ?`,
      confirmText: 'Réactiver',
      variant: 'warning',
      icon: 'refresh-cw',
    })
    if (!confirmed) return

    this.profileService.reactivateProfile(profile.id).subscribe({
      next: () => {
        this.toast.success(`Profil ${profile.firstName} ${profile.lastName} réactivé avec succès.`)
        this.loadProfiles()
      },
      error: (err) => {
        this.toast.error(err.error?.error || err.error?.message || 'Erreur lors de la réactivation du profil.')
      },
    })
  }

  async suspendProfile(profile: ProfileDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Suspendre le profil',
      message: `Êtes-vous sûr de vouloir suspendre le profil de ${profile.firstName} ${profile.lastName} ?`,
      confirmText: 'Suspendre',
      variant: 'danger',
      icon: 'alert-triangle',
    })
    if (!confirmed) return

    this.profileService.suspendProfile(profile.id).subscribe({
      next: () => {
        this.toast.warning(`Profil ${profile.firstName} ${profile.lastName} suspendu.`)
        this.loadProfiles()
      },
      error: (err) => {
        this.toast.error(err.error?.error || err.error?.message || 'Erreur lors de la suspension du profil.')
      },
    })
  }
}
