import { Component, inject } from '@angular/core'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { ProfileStateService } from '@core/services/profile-state.service'
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
        @if (profileState.loading()) {
          <span class="dropdown-item text-muted">Chargement...</span>
        } @else if (profiles.length === 0) {
          <span class="dropdown-item text-muted">Aucun profil disponible</span>
        } @else {
          @for (profile of profiles; track profile.id) {
            <a
              ngbDropdownItem
              (click)="profileState.selectProfile(profile.id)"
              [class.active]="profile.id === profileState.selectedProfileId()"
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
export class ProfileDropdown {
  ProfileStatusLabels = ProfileStatusLabels

  readonly profileState = inject(ProfileStateService)

  get profiles() {
    return this.profileState.profiles()
  }

  get selectedLabel(): string {
    const profile = this.profileState.selectedProfile
    if (!profile) return 'Profil'
    return `${profile.firstName} ${profile.lastName}`
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