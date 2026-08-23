import { Component, OnInit } from '@angular/core'
import { DatePipe, DecimalPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { ProcedureService } from '@core/services/procedure.service'
import { ProfileService } from '@core/services/profile.service'
import { ProcedureDto } from '@core/models/procedure/procedure.model'
import { ProfileTypeDto } from '@core/models/profile/profile.model'
import { ProcedureProfileType, ProcedureProfileTypeLabels } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-procedure-list',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, DecimalPipe, RouterLink, FormsModule, Icon],
  templateUrl: './procedure-list.html',
  styles: ``,
})
export class ProcedureList implements OnInit {
  procedures: ProcedureDto[] = []
  profileTypes: ProfileTypeDto[] = []
  profileType = ProcedureProfileType.Internal
  profileTypeId = ''
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  loading = false

  ProcedureProfileType = ProcedureProfileType
  ProcedureProfileTypeLabels = ProcedureProfileTypeLabels

  constructor(
    private procedureService: ProcedureService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.profileService.getProfileTypes().subscribe({
      next: (types) => {
        this.profileTypes = types
        if (types.length > 0) {
          this.profileTypeId = types[0].id
        }
        this.loadProcedures()
      },
      error: () => this.loadProcedures(),
    })
  }

  loadProcedures() {
    if (!this.profileTypeId) return
    this.loading = true
    this.procedureService.getProcedures(this.profileType, this.profileTypeId, this.page, this.pageSize).subscribe({
      next: (res) => {
        this.procedures = res.items
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  onFilterChange() {
    this.page = 1
    this.loadProcedures()
  }

  onDelete(id: string) {
    if (confirm('Deactivate this procedure?')) {
      this.procedureService.deleteProcedure(id).subscribe({
        next: () => this.loadProcedures(),
        error: () => {},
      })
    }
  }

  onPageChange(page: number) {
    this.page = page
    this.loadProcedures()
  }
}
