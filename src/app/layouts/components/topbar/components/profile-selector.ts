import { Component } from '@angular/core'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { ProfileStateService } from '@core/services/profile-state.service'
import { ProfileStatusLabels } from '@core/models/shared/enums.model'

@Component({
  selector: 'profile-selector',
  imports: [NgbDropdownModule],
  template: `
    <div id="profile-selector" class="topbar-item">
      <div ngbDropdown placement="bottom-end">
        <button class="topbar-link fw-bold drop-arrow-none" ngbDropdownToggle type="button">
          <span class="rounded-circle me-2 d-inline-flex align-items-center justify-content-center bg-primary text-white" style="width: 18px; height: 18px; font-size: 10px;">
            {{ selectedInitial }}
          </span>
          <span id="selected-profile-name">{{ selectedLabel }}</span>
        </button>
        <div ngbDropdownMenu class="dropdown-menu-end" style="min-width: 260px;">
          <h6 class="dropdown-header">Select a profile</h6>
          @if (profileState.loading()) {
            <span class="dropdown-item text-muted">Loading...</span>
          } @else if (profiles.length === 0) {
            <span class="dropdown-item text-muted">No profile available</span>
          } @else {
            @for (profile of profiles; track profile.id) {
              <a
                ngbDropdownItem
                (click)="profileState.selectProfile(profile.id)"
                [class.active]="profile.id === profileState.selectedProfileId()"
              >
                <div class="d-flex align-items-center justify-content-between">
                  <span class="align-middle">{{ profile.firstName }} {{ profile.lastName }}</span>
                  <span class="text-muted small">{{ ProfileStatusLabels[profile.status] }}</span>
                </div>
              </a>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ProfileSelector {
  ProfileStatusLabels = ProfileStatusLabels

  constructor(public profileState: ProfileStateService) {
    this.profileState.loadProfiles()
  }

  get profiles() {
    return this.profileState.profiles()
  }

  get selectedLabel(): string {
    const profile = this.profileState.selectedProfile
    if (!profile) return 'No profile'
    return `${profile.firstName} ${profile.lastName}`
  }

  get selectedInitial(): string {
    const profile = this.profileState.selectedProfile
    if (!profile) return '?'
    return (profile.firstName || '?').charAt(0).toUpperCase()
  }
}
