import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { ProfileService } from '@core/services/profile.service'
import { ProfileDto, ProfileTypeDto } from '@core/models/profile/profile.model'
import { ProfileStatus, ProfileStatusLabels, ProfileStatusBadgeVariants } from '@core/models/shared/enums.model'

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

  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: '0', label: 'Pending Verification' },
    { value: '1', label: 'Verified' },
    { value: '2', label: 'Suspended' },
    { value: '3', label: 'Active' },
  ]

  constructor(
    private profileService: ProfileService
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

  verifyProfile(profile: ProfileDto) {
    if (confirm(`Verify profile ${profile.firstName} ${profile.lastName}?`)) {
      this.profileService.verifyProfile(profile.id).subscribe({
        next: () => this.loadProfiles(),
        error: () => {},
      })
    }
  }

  activateProfile(profile: ProfileDto) {
    this.profileService.activateProfile(profile.id).subscribe({
      next: () => this.loadProfiles(),
      error: () => {},
    })
  }

  suspendProfile(profile: ProfileDto) {
    if (confirm(`Suspend profile ${profile.firstName} ${profile.lastName}?`)) {
      this.profileService.suspendProfile(profile.id).subscribe({
        next: () => this.loadProfiles(),
        error: () => {},
      })
    }
  }
}
