import { Injectable, signal, effect } from '@angular/core'
import { forkJoin, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ProfileDto } from '../models/profile/profile.model'
import { ProfileService } from './profile.service'

const STORAGE_KEY = '__ACTIVE_PROFILE_ID__'

@Injectable({ providedIn: 'root' })
export class ProfileStateService {
  readonly profiles = signal<ProfileDto[]>([])
  readonly selectedProfileId = signal<string>(this.loadFromStorage())
  readonly loading = signal(false)

  constructor(private profileService: ProfileService) {
    this.loadProfiles()
  }

  get selectedProfile(): ProfileDto | null {
    return this.profiles().find((p) => p.id === this.selectedProfileId()) ?? null
  }

  loadProfiles() {
    this.loading.set(true)
    forkJoin({
      my: this.profileService.getMyProfiles().pipe(catchError(() => of({ profiles: [] }))),
      pending: this.profileService.getPendingProfiles(1, 100).pipe(catchError(() => of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 100, totalPages: 0 }))),
    }).subscribe({
      next: ({ my, pending }) => {
        const myProfs = my.profiles || []
        const pendProfs = pending.items || []
        const map = new Map<string, ProfileDto>()
        myProfs.forEach(p => map.set(p.id, p))
        pendProfs.forEach(p => map.set(p.id, p))
        const all = Array.from(map.values())
        this.profiles.set(all)
        this.loading.set(false)

        const selectedId = this.selectedProfileId()
        if (all.length > 0 && !selectedId) {
          this.selectProfile(all[0].id)
        }
      },
      error: () => {
        this.loading.set(false)
      },
    })
  }

  selectProfile(profileId: string) {
    this.selectedProfileId.set(profileId)
    try {
      sessionStorage.setItem(STORAGE_KEY, profileId)
    } catch {
      /* ignore */
    }
  }

  private loadFromStorage(): string {
    try {
      return sessionStorage.getItem(STORAGE_KEY) ?? ''
    } catch {
      return ''
    }
  }
}
