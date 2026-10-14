import { Component, inject, input, output, signal, effect, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { ProfileStateService } from '@core/services/profile-state.service'
import { ProfileService } from '@core/services/profile.service'
import { ProfileStatusLabels } from '@core/models/shared/enums.model'
import { ProfileDto } from '@core/models/profile/profile.model'
import { Subject, Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap, catchError, map } from 'rxjs/operators'
import { of } from 'rxjs'

@Component({
  selector: 'app-profile-search-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  template: `
    <div ngbDropdown class="w-100" [autoClose]="'outside'" #dropdown="ngbDropdown">
      <button class="btn btn-outline-secondary w-100 text-start d-flex align-items-center justify-content-between" ngbDropdownToggle type="button">
        <span class="text-truncate">
          <i class="bi bi-person me-2"></i>
          <span>{{ selectedLabel() }}</span>
        </span>
        <i class="bi bi-chevron-down text-muted ms-2"></i>
      </button>

      <div ngbDropdownMenu class="w-100 dropdown-menu-end p-2" style="max-height: 380px; overflow-y: auto;">
        <div class="p-2">
          <input
            type="text"
            class="form-control form-control-sm mb-2"
            [(ngModel)]="searchInputValue"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search by name, email..."
          />
        </div>

        @if (searchInputValue.trim().length > 0) {
          <a class="dropdown-item text-primary fw-medium py-1 text-truncate" (click)="onSelectCustomId(searchInputValue.trim()); dropdown.close()">
            <i class="bi bi-box-arrow-in-right me-1"></i> Use ID: "{{ searchInputValue.trim() }}"
          </a>
          <div class="dropdown-divider my-1"></div>
        }

        <div class="p-2" style="max-height: 280px; overflow-y: auto;">
          @if (isSearching) {
            <span class="dropdown-item text-muted">Searching...</span>
          } @else if (filteredProfiles.length === 0) {
            <span class="dropdown-item text-muted">No profiles found</span>
          } @else {
            @for (profile of filteredProfiles; track profile.id) {
              <a
                class="dropdown-item d-flex align-items-center justify-content-between gap-2 py-1"
                (click)="onSelect(profile); dropdown.close()"
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
export class ProfileSearchDropdown implements OnInit, OnDestroy {
  private profileState = inject(ProfileStateService)
  private profileService = inject(ProfileService)

  readonly placeholder = input<string>('Select profile...')
  readonly onProfileSelect = output<string>()

  protected readonly selectedProfileId = this.profileState.selectedProfileId
  protected readonly stateProfiles = this.profileState.profiles

  protected ProfileStatusLabels = ProfileStatusLabels

  searchInputValue = ''
  filteredProfiles: ProfileDto[] = []
  isSearching = false

  private searchSubject = new Subject<string>()
  private searchSubscription?: Subscription

  ngOnInit() {
    this.filteredProfiles = this.stateProfiles()

    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          if (!term) {
            return of(this.stateProfiles())
          }
          this.isSearching = true
          return this.profileService.getProfiles({ searchTerm: term, pageSize: 20 }).pipe(
            map(res => res.items || []),
            catchError(() => of([]))
          )
        })
      )
      .subscribe((results) => {
        this.filteredProfiles = results
        this.isSearching = false
      })
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe()
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value)
  }

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
    this.searchInputValue = ''
    this.searchSubject.next('')
    this.onProfileSelect.emit(profile.id)
  }

  protected onSelectCustomId(id: string) {
    if (!id) return
    this.profileState.selectProfile(id)
    this.searchInputValue = ''
    this.searchSubject.next('')
    this.onProfileSelect.emit(id)
  }

  selectedLabel(): string {
    const selectedId = this.selectedProfileId()
    if (!selectedId) return this.placeholder()
    const profile = this.stateProfiles().find(p => p.id === selectedId) || this.filteredProfiles.find(p => p.id === selectedId)
    if (profile) return `${profile.firstName} ${profile.lastName}`
    return `ID: ${selectedId}`
  }
}