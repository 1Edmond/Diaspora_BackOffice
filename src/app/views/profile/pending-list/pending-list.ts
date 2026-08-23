import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { ProfileService } from '@core/services/profile.service'
import { ProfileDto } from '@core/models/profile/profile.model'
import { ProfileStatus, ProfileStatusLabels, ProfileStatusBadgeVariants } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-pending-list',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, RouterLink],
  templateUrl: './pending-list.html',
  styles: ``,
})
export class PendingList implements OnInit {
  profiles: ProfileDto[] = []
  page = 1
  pageSize = 10
  totalCount = 0
  loading = false

  ProfileStatus = ProfileStatus
  statusLabels = ProfileStatusLabels
  statusBadges = ProfileStatusBadgeVariants

  constructor(
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.loadPending()
  }

  loadPending() {
    this.loading = true
    this.profileService.getPendingProfiles(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.profiles = res.items
        this.totalCount = res.totalCount
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  onPageChange(page: number) {
    this.page = page
    this.loadPending()
  }
}
