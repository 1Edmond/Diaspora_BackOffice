import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { ProfileStateService } from '@core/services/profile-state.service'
import { ProfileService } from '@core/services/profile.service'
import { ProfileDto } from '@core/models/profile/profile.model'
import { ProfileStatusLabels } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [NgbDropdownModule, CommonModule],
  template: `
    <div ngbDropdown class="d-inline-block">
      <button class="btn btn-outline-secondary dropdown-toggle" ngbDropdownToggle type="button">
        <i class="bi bi-person me-1"></i>
        <span class="d-none d-sm-inline">{{ selectedLabel }}</span>
      </button>
      <div ngbDropdownMenu class="dropdown-menu-end" style="min-width: 240px;">
        <h6 class="dropdown-header">Sélectionner un profil</h6>
        @if (loading) {
          <span class="dropdown-item text-muted">Chargement...</span>
        } @else if (profiles.length === 0) {
          <span class="dropdown-item text-muted">Aucun profil disponible</span>
        } @else {
          @for (profile of profiles; track profile.id) {
            <a
              ngbDropdownItem
              (click)="onSelectProfile(profile.id)"
              [class.active]="profile.id === currentSelectedId"
              class="d-flex align-items-center justify-content-between gap-2"
            >
              <span>{{ profile.firstName }} {{ profile.lastName }}</span>
              <span class="badge" [class]="'bg-soft-' + getStatusVariant(profile.status) + ' text-' + getStatusVariant(profile.status)">
                {{ ProfileStatusLabels[profile.status] }}
              </span>
            </a>
          }
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class ProfileDropdown implements OnInit {
  @Input() syncGlobalState = false
  @Output() profileSelected = new EventEmitter<string>()

  ProfileStatusLabels = ProfileStatusLabels

  readonly profileState = inject(ProfileStateService)
  private readonly profileService = inject(ProfileService)

  localProfiles: ProfileDto[] = []
  localSelectedId = ''
  localLoading = false

  ngOnInit() {
    if (!this.syncGlobalState && this.profileState.profiles().length === 0) {
      this.localLoading = true
      this.profileService.getProfiles({ pageSize: 20 }).subscribe({
        next: (res) => {
          this.localProfiles = res.items || []
          this.localLoading = false
        },
        error: () => {
          this.localLoading = false
        },
      })
    }
  }

  get loading(): boolean {
    return this.syncGlobalState ? this.profileState.loading() : this.localLoading
  }

  get profiles(): ProfileDto[] {
    const stateList = this.profileState.profiles()
    return stateList.length > 0 ? stateList : this.localProfiles
  }

  get currentSelectedId(): string {
    return this.syncGlobalState ? this.profileState.selectedProfileId() : this.localSelectedId
  }

  get selectedLabel(): string {
    const id = this.currentSelectedId
    const profile = this.profiles.find((p) => p.id === id)
    if (!profile) return 'Profil'
    return `${profile.firstName} ${profile.lastName}`
  }

  onSelectProfile(profileId: string) {
    this.localSelectedId = profileId
    if (this.syncGlobalState) {
      this.profileState.selectProfile(profileId)
    }
    this.profileSelected.emit(profileId)
  }

  getStatusVariant(status: number): string {
    const variants: Record<number, string> = {
      0: 'warning',
      1: 'success',
      2: 'danger',
      3: 'info',
    }
    return variants[status] || 'secondary'
  }
}