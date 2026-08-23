import { Component, inject, input, output, computed, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { ProfileStateService } from '@core/services/profile-state.service'
import { ProfileStatusLabels } from '@core/models/shared/enums.model'
import { ProfileDto } from '@core/models/profile/profile.model'

@Component({
  selector: 'app-profile-search-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  template: `
    <div ngbDropdown class="w-100" [autoClose]="'outside'">
      <button class="btn btn-outline-secondary w-100 text-start d-flex align-items-center justify-content-between" ngbDropdownToggle type="button">
        <span class="text-truncate">
          <i class="bi bi-person me-2"></i>
          <span>{{ selectedLabel }}</span>
        </span>
        <i class="bi bi-chevron-down text-muted ms-2"></i>
      </button>

      <div ngbDropdownMenu class="w-100 dropdown-menu-end p-2" style="max-height: 380px; overflow-y: auto;">
        <div class="p-2">
          <input
            type="text"
            class="form-control form-control-sm mb-2"
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
            placeholder="Search by name or paste Profile ID..."
          />
        </div>

        @if (searchTerm().trim().length > 0) {
          <a class="dropdown-item text-primary fw-medium py-1 text-truncate" (click)="onSelectCustomId(searchTerm().trim())">
            <i class="bi bi-box-arrow-in-right me-1"></i> Use ID: "{{ searchTerm().trim() }}"
          </a>
          <div class="dropdown-divider my-1"></div>
        }

        <div class="p-2" style="max-height: 280px; overflow-y: auto;">
          @if (profiles().length === 0 && !loading()) {
            <span class="dropdown-item text-muted">No loaded profiles</span>
          } @else if (loading()) {
            <span class="dropdown-item text-muted">Loading profiles...</span>
          } @else if (filteredProfiles().length === 0) {
            <span class="dropdown-item text-muted">No matching profiles</span>
          } @else {
            @for (profile of filteredProfiles(); track profile.id) {
              <a
                class="dropdown-item d-flex align-items-center justify-content-between gap-2 py-1"
                (click)="onSelect(profile)"
                [class.active]="profile.id === selectedProfileId()"
              >
                <span class="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
                  <span class="fw-medium text-truncate">{{ profile.firstName }} {{ profile.lastName }}</span>
                  <span class="badge" [class]="'bg-soft-' + getStatusVariant(profile.status) + ' text-' + getStatusVariant(profile.status)">
                    {{ getStatusLabel(profile.status) }}
                  </span>
                </span>
                <span class="text-xs text-muted ms-2">{{ profile.id }}</span>
              </a>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ProfileSearchDropdown {
  private profileState = inject(ProfileStateService)

  readonly placeholder = input<string>('Select profile...')
  readonly onProfileSelect = output<string>()

  protected readonly profiles = this.profileState.profiles
  protected readonly loading = this.profileState.loading
  protected readonly selectedProfileId = this.profileState.selectedProfileId

  protected ProfileStatusLabels = ProfileStatusLabels

  searchTerm = signal('')

  protected filteredProfiles = computed(() => {
    const term = this.searchTerm().toLowerCase().trim()
    const list = this.profiles()
    if (!term) return list
    return list.filter(p =>
      (p.firstName || '').toLowerCase().includes(term) ||
      (p.lastName || '').toLowerCase().includes(term) ||
      (`${p.firstName || ''} ${p.lastName || ''}`).toLowerCase().includes(term) ||
      ((p as any).email || '').toLowerCase().includes(term)
    )
  })

  protected getStatusVariant(status: number): string {
    const variants: Record<number, string> = {
      0: 'warning',
      1: 'success',
      2: 'danger',
      3: 'info',
    }
    return variants[status] || 'secondary'
  }

  protected getStatusLabel(status: number): string {
    return ProfileStatusLabels[status as keyof typeof ProfileStatusLabels]
  }

  protected onSelect(profile: ProfileDto) {
    this.profileState.selectProfile(profile.id)
    this.searchTerm.set('')
    this.onProfileSelect.emit(profile.id)
  }

  protected onSelectCustomId(id: string) {
    if (!id) return
    this.profileState.selectProfile(id)
    this.searchTerm.set('')
    this.onProfileSelect.emit(id)
  }

  protected get selectedLabel(): string {
    const selectedId = this.selectedProfileId()
    if (!selectedId) return this.placeholder()
    const profile = this.profileState.selectedProfile
    if (profile) return `${profile.firstName} ${profile.lastName}`
    return `ID: ${selectedId}`
  }
}