import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { ProfileService } from '@core/services/profile.service'
import { ProfileDto } from '@core/models/profile/profile.model'
import { ProfileStatus, ProfileStatusLabels, ProfileStatusBadgeVariants } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, RouterLink],
  templateUrl: './profile-detail.html',
  styles: ``,
})
export class ProfileDetail implements OnInit {
  profile: ProfileDto | null = null
  loading = true
  error = ''
  success = ''

  ProfileStatus = ProfileStatus
  statusLabels = ProfileStatusLabels
  statusBadges = ProfileStatusBadgeVariants

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
}
