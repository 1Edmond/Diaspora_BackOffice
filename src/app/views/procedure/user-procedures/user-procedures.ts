import { Component, OnInit, effect } from '@angular/core'
import { DatePipe, DecimalPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { forkJoin, of } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { ProcedureService } from '@core/services/procedure.service'
import { ProfileService } from '@core/services/profile.service'
import { ProfileStateService } from '@core/services/profile-state.service'
import { UserProcedureDto, ProcedureProgressDto } from '@core/models/procedure/procedure.model'
import { UserProcedureStatus, UserProcedureStatusLabels, UserProcedureStatusBadgeVariants, ProcedureProfileType } from '@core/models/shared/enums.model'
import { ProfileSearchDropdown } from '@shared/components/profile-search-dropdown/profile-search-dropdown'
import { CompleteUserProcedureRequest, SkipUserProcedureRequest } from '@core/models/procedure/procedure.model'

@Component({
  selector: 'app-user-procedures',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, DecimalPipe, FormsModule, Icon, ProfileSearchDropdown],
  templateUrl: './user-procedures.html',
  styles: ``,
})
export class UserProcedures implements OnInit {
  procedures: UserProcedureDto[] = []
  progress: ProcedureProgressDto | null = null
  profileId = ''
  manualProfileId = ''
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  loading = false
  selectedIds = new Set<string>()
  bulkActionLoading = false

  UserProcedureStatus = UserProcedureStatus
  UserProcedureStatusLabels = UserProcedureStatusLabels
  UserProcedureStatusBadgeVariants = UserProcedureStatusBadgeVariants

  constructor(
    private procedureService: ProcedureService,
    private profileService: ProfileService,
    public profileState: ProfileStateService
  ) {
    effect(() => {
      const pid = this.profileState.selectedProfileId()
      if (pid && pid !== this.profileId) {
        this.profileId = pid
        this.manualProfileId = pid
        this.page = 1
        this.selectedIds.clear()
        this.loadData()
      }
    })
  }

  ngOnInit() {
    if (this.profileState.selectedProfileId()) {
      this.profileId = this.profileState.selectedProfileId()
      this.manualProfileId = this.profileId
      this.loadData()
    }
  }

  onProfileSelect(profileId: string) {
    this.profileId = profileId
    this.manualProfileId = profileId
    this.page = 1
    this.selectedIds.clear()
    this.loadData()
  }

  applyManualProfileId() {
    const pid = this.manualProfileId.trim()
    if (pid) {
      this.profileState.selectProfile(pid)
      this.onProfileSelect(pid)
    }
  }

  loadData() {
    if (!this.profileId) return
    this.loading = true

    // 1. Fetch user profile to find profileTypeId
    this.profileService.getProfile(this.profileId).pipe(
      catchError(() => of(null)),
      switchMap((profile) => {
        const profileTypeId = profile?.profileTypeId || ''

        // 2. Fetch procedure definitions for this profile type AND user progress records
        return forkJoin({
          definitions: profileTypeId
            ? this.procedureService.getProcedures(ProcedureProfileType.Internal, profileTypeId, 1, 1000).pipe(catchError(() => of({ items: [] })))
            : of({ items: [] }),
          userProcs: this.procedureService.getUserProcedures(this.profileId, 1, 1000).pipe(catchError(() => of({ items: [] })))
        })
      })
    ).subscribe({
      next: ({ definitions, userProcs }) => {
        const defs = definitions.items || []
        const userList = userProcs.items || []

        // Map existing user procedures by procedureId
        const userProcMap = new Map<string, UserProcedureDto>()
        userList.forEach(up => userProcMap.set(up.procedureId, up))

        // Merge procedure definitions with user progress records
        const mergedList: UserProcedureDto[] = defs.map(d => {
          const existing = userProcMap.get(d.id)
          if (existing) {
            return {
              ...existing,
              procedureTitle: d.title,
              costAmount: d.costAmount ?? existing.costAmount,
              costCurrency: d.costCurrency ?? existing.costCurrency
            }
          }
          // Virtual NotStarted record for procedure required by profile type
          return {
            id: 'virtual-' + d.id,
            profileId: this.profileId,
            procedureId: d.id,
            procedureTitle: d.title,
            costAmount: d.costAmount,
            costCurrency: d.costCurrency,
            status: UserProcedureStatus.NotStarted,
            createdAt: d.createdAt
          }
        })

        // Also add any user procedures that might not be in definition list
        userList.forEach(up => {
          if (!defs.some(d => d.id === up.procedureId) && !mergedList.some(m => m.id === up.id)) {
            mergedList.push(up)
          }
        })

        this.procedures = mergedList
        this.totalCount = mergedList.length

        // Recalculate statistics over ALL procedure definitions required for profile type
        const total = mergedList.length
        const completed = mergedList.filter(p => p.status === UserProcedureStatus.Completed).length
        const inProgress = mergedList.filter(p => p.status === UserProcedureStatus.InProgress).length
        const notStarted = mergedList.filter(p => p.status === UserProcedureStatus.NotStarted).length
        const skipped = mergedList.filter(p => p.status === UserProcedureStatus.Skipped).length
        const completionPercentage = total > 0 ? (completed / total) * 100 : 0

        this.progress = {
          profileId: this.profileId,
          total,
          completed,
          inProgress,
          notStarted,
          skipped,
          completionPercentage
        }

        this.loading = false
        this.selectedIds.clear()
      },
      error: () => {
        this.loading = false
      }
    })
  }

  onPageChange(page: number) {
    this.page = page
    this.selectedIds.clear()
  }

  // Selection methods
  toggleSelect(id: string) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id)
    } else {
      this.selectedIds.add(id)
    }
  }

  toggleSelectAll() {
    if (this.isAllSelected()) {
      this.selectedIds.clear()
    } else {
      this.procedures.forEach(p => this.selectedIds.add(p.id))
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id)
  }

  isAllSelected(): boolean {
    return this.procedures.length > 0 && this.procedures.every(p => this.selectedIds.has(p.id))
  }

  getSelectedCount(): number {
    return this.selectedIds.size
  }

  getSelectedProcedures(): UserProcedureDto[] {
    return this.procedures.filter(p => this.selectedIds.has(p.id))
  }

  // Bulk actions
  async bulkStart() {
    const selected = this.getSelectedProcedures().filter(p => p.status === UserProcedureStatus.NotStarted)
    if (selected.length === 0) return
    
    this.bulkActionLoading = true
    for (const proc of selected) {
      try {
        await this.procedureService.startProcedure({ profileId: this.profileId, procedureId: proc.procedureId }).toPromise()
      } catch (e) {
        console.error('Failed to start procedure', e)
      }
    }
    this.bulkActionLoading = false
    this.selectedIds.clear()
    this.loadData()
  }

  async bulkComplete() {
    const selected = this.getSelectedProcedures().filter(p => p.status === UserProcedureStatus.InProgress)
    if (selected.length === 0) return
    
    this.bulkActionLoading = true
    for (const proc of selected) {
      try {
        const req: CompleteUserProcedureRequest = { profileId: this.profileId, notes: '' }
        await this.procedureService.completeProcedure(proc.id, req).toPromise()
      } catch (e) {
        console.error('Failed to complete procedure', e)
      }
    }
    this.bulkActionLoading = false
    this.selectedIds.clear()
    this.loadData()
  }

  async bulkSkip() {
    const selected = this.getSelectedProcedures().filter(p => p.status === UserProcedureStatus.NotStarted || p.status === UserProcedureStatus.InProgress)
    if (selected.length === 0) return
    
    this.bulkActionLoading = true
    for (const proc of selected) {
      try {
        const req: SkipUserProcedureRequest = { notes: '' }
        await this.procedureService.skipProcedure(proc.id, req).toPromise()
      } catch (e) {
        console.error('Failed to skip procedure', e)
      }
    }
    this.bulkActionLoading = false
    this.selectedIds.clear()
    this.loadData()
  }

  // Single actions
  async startSingle(up: UserProcedureDto) {
    if (up.status !== UserProcedureStatus.NotStarted) return
    try {
      await this.procedureService.startProcedure({ profileId: this.profileId, procedureId: up.procedureId }).toPromise()
      this.loadData()
    } catch (e) {
      console.error('Failed to start procedure', e)
    }
  }

  async completeSingle(up: UserProcedureDto) {
    if (up.status !== UserProcedureStatus.InProgress) return
    try {
      const req: CompleteUserProcedureRequest = { profileId: this.profileId, notes: '' }
      await this.procedureService.completeProcedure(up.id, req).toPromise()
      this.loadData()
    } catch (e) {
      console.error('Failed to complete procedure', e)
    }
  }

  async skipSingle(up: UserProcedureDto) {
    if (up.status === UserProcedureStatus.Completed || up.status === UserProcedureStatus.Skipped) return
    try {
      const req: SkipUserProcedureRequest = { notes: '' }
      await this.procedureService.skipProcedure(up.id, req).toPromise()
      this.loadData()
    } catch (e) {
      console.error('Failed to skip procedure', e)
    }
  }

  // Bulk action enable checks
  canBulkStart(): boolean {
    return this.getSelectedProcedures().some(p => p.status === UserProcedureStatus.NotStarted)
  }

  canBulkComplete(): boolean {
    return this.getSelectedProcedures().some(p => p.status === UserProcedureStatus.InProgress)
  }

  canBulkSkip(): boolean {
    return this.getSelectedProcedures().some(p => p.status === UserProcedureStatus.NotStarted || p.status === UserProcedureStatus.InProgress)
  }
}