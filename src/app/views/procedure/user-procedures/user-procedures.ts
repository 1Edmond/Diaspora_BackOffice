import { Component, OnInit, inject, effect, TemplateRef } from '@angular/core'
import { DatePipe, DecimalPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { forkJoin, of } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { ProcedureService } from '@core/services/procedure.service'
import { ProfileService } from '@core/services/profile.service'
import { ProfileStateService } from '@core/services/profile-state.service'
import {
  UserProcedureDto,
  ProcedureProgressDto,
  CompleteUserProcedureRequest,
  SkipUserProcedureRequest
} from '@core/models/procedure/procedure.model'
import {
  UserProcedureStatus,
  UserProcedureStatusLabels,
  UserProcedureStatusBadgeVariants,
  ProcedureProfileType
} from '@core/models/shared/enums.model'
import { ProfileSearchDropdown } from '@shared/components/profile-search-dropdown/profile-search-dropdown'

@Component({
  selector: 'app-user-procedures',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, DecimalPipe, FormsModule, RouterLink, Icon, ProfileSearchDropdown],
  templateUrl: './user-procedures.html',
  styles: ``,
})
export class UserProcedures implements OnInit {
  // Tabs: 'global' is the default per requirement
  activeTab: 'global' | 'by-profile' = 'global'

  // Alerts
  success = ''
  error = ''

  // Global Queue state
  globalProcedures: UserProcedureDto[] = []
  globalLoading = false
  globalPage = 1
  globalPageSize = 10
  globalTotalCount = 0
  globalTotalPages = 1
  statusFilter: string = 'ALL'
  selectedGlobalIds = new Set<string>()
  globalBulkActionLoading = false

  // Profile-specific audit state
  profileProcedures: UserProcedureDto[] = []
  progress: ProcedureProgressDto | null = null
  profileId = ''
  manualProfileId = ''
  profileLoading = false
  selectedProfileIds = new Set<string>()
  profileBulkActionLoading = false

  // Modal action state
  selectedProc: UserProcedureDto | null = null
  modalAction: 'complete' | 'skip' = 'complete'
  actionNotes = ''
  actionLoading = false

  // Enums and helpers
  UserProcedureStatus = UserProcedureStatus
  UserProcedureStatusLabels = UserProcedureStatusLabels
  UserProcedureStatusBadgeVariants = UserProcedureStatusBadgeVariants

  private modalService = inject(NgbModal)

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
        this.selectedProfileIds.clear()
        if (this.activeTab === 'by-profile') {
          this.loadProfileData()
        }
      }
    })
  }

  ngOnInit() {
    // 1. In global mode (default), immediately load citizen procedures
    this.loadGlobalData()

    // 2. Pre-fill profile if available in state
    if (this.profileState.selectedProfileId()) {
      this.profileId = this.profileState.selectedProfileId()
      this.manualProfileId = this.profileId
    }
  }

  setTab(tab: 'global' | 'by-profile') {
    this.activeTab = tab
    this.clearMessages()
    if (tab === 'global' && this.globalProcedures.length === 0 && !this.globalLoading) {
      this.loadGlobalData()
    } else if (tab === 'by-profile' && this.profileId && this.profileProcedures.length === 0 && !this.profileLoading) {
      this.loadProfileData()
    }
  }

  clearMessages() {
    this.success = ''
    this.error = ''
  }

  refreshCurrentTab() {
    if (this.activeTab === 'global') {
      this.loadGlobalData()
    } else {
      this.loadProfileData()
    }
  }

  // ==========================================
  // GLOBAL QUEUE METHODS
  // ==========================================

  loadGlobalData() {
    this.globalLoading = true
    const statusParam = this.statusFilter !== 'ALL'
      ? (Number(this.statusFilter) as UserProcedureStatus)
      : undefined

    this.procedureService
      .getAllUserProceduresAdmin(statusParam, undefined, this.globalPage, this.globalPageSize)
      .subscribe({
        next: (res) => {
          this.globalProcedures = res.items || []
          this.globalTotalCount = res.totalCount || 0
          this.globalTotalPages = res.totalPages || 1
          this.globalLoading = false
          this.selectedGlobalIds.clear()
        },
        error: (err) => {
          this.error = err?.error?.error || 'Échec du chargement de la file globale des démarches.'
          this.globalLoading = false
        },
      })
  }

  onStatusFilterChange(status: string) {
    this.statusFilter = status
    this.globalPage = 1
    this.selectedGlobalIds.clear()
    this.loadGlobalData()
  }

  onGlobalPageChange(page: number) {
    if (page < 1 || page > this.globalTotalPages) return
    this.globalPage = page
    this.selectedGlobalIds.clear()
    this.loadGlobalData()
  }

  // Global Selection
  toggleSelectGlobal(id: string) {
    if (this.selectedGlobalIds.has(id)) {
      this.selectedGlobalIds.delete(id)
    } else {
      this.selectedGlobalIds.add(id)
    }
  }

  toggleSelectAllGlobal() {
    if (this.isAllGlobalSelected()) {
      this.selectedGlobalIds.clear()
    } else {
      this.globalProcedures.forEach((p) => this.selectedGlobalIds.add(p.id))
    }
  }

  isGlobalSelected(id: string): boolean {
    return this.selectedGlobalIds.has(id)
  }

  isAllGlobalSelected(): boolean {
    return (
      this.globalProcedures.length > 0 &&
      this.globalProcedures.every((p) => this.selectedGlobalIds.has(p.id))
    )
  }

  getSelectedGlobalCount(): number {
    return this.selectedGlobalIds.size
  }

  getSelectedGlobalProcedures(): UserProcedureDto[] {
    return this.globalProcedures.filter((p) => this.selectedGlobalIds.has(p.id))
  }

  canBulkStartGlobal(): boolean {
    return this.getSelectedGlobalProcedures().some((p) => p.status === UserProcedureStatus.NotStarted)
  }

  canBulkCompleteGlobal(): boolean {
    return this.getSelectedGlobalProcedures().some((p) => p.status === UserProcedureStatus.InProgress)
  }

  canBulkSkipGlobal(): boolean {
    return this.getSelectedGlobalProcedures().some(
      (p) => p.status === UserProcedureStatus.NotStarted || p.status === UserProcedureStatus.InProgress
    )
  }

  async bulkStartGlobal() {
    const selected = this.getSelectedGlobalProcedures().filter(
      (p) => p.status === UserProcedureStatus.NotStarted
    )
    if (selected.length === 0) return

    this.globalBulkActionLoading = true
    this.clearMessages()
    let successCount = 0
    for (const proc of selected) {
      try {
        await this.procedureService
          .startProcedure({ profileId: proc.profileId, procedureId: proc.procedureId })
          .toPromise()
        successCount++
      } catch (e) {
        console.error('Failed to start procedure', e)
      }
    }
    this.globalBulkActionLoading = false
    this.success = `${successCount} démarche(s) démarrée(s) avec succès.`
    this.selectedGlobalIds.clear()
    this.loadGlobalData()
  }

  async bulkCompleteGlobal(content: TemplateRef<any>) {
    const selected = this.getSelectedGlobalProcedures().filter(
      (p) => p.status === UserProcedureStatus.InProgress
    )
    if (selected.length === 0) return

    this.selectedProc = null
    this.modalAction = 'complete'
    this.actionNotes = ''
    this.modalService.open(content, { centered: true })
  }

  async bulkSkipGlobal(content: TemplateRef<any>) {
    const selected = this.getSelectedGlobalProcedures().filter(
      (p) => p.status === UserProcedureStatus.NotStarted || p.status === UserProcedureStatus.InProgress
    )
    if (selected.length === 0) return

    this.selectedProc = null
    this.modalAction = 'skip'
    this.actionNotes = ''
    this.modalService.open(content, { centered: true })
  }

  // ==========================================
  // PROFILE AUDIT METHODS
  // ==========================================

  onProfileSelect(profileId: string) {
    this.profileId = profileId
    this.manualProfileId = profileId
    this.selectedProfileIds.clear()
    this.loadProfileData()
  }

  applyManualProfileId() {
    const pid = this.manualProfileId.trim()
    if (pid) {
      this.profileState.selectProfile(pid)
      this.onProfileSelect(pid)
    }
  }

  loadProfileData() {
    if (!this.profileId) return
    this.profileLoading = true
    this.clearMessages()

    this.profileService
      .getProfile(this.profileId)
      .pipe(
        catchError(() => of(null)),
        switchMap((profile) => {
          const profileTypeId = profile?.profileTypeId || ''

          return forkJoin({
            definitions: profileTypeId
              ? this.procedureService
                  .getProcedures(ProcedureProfileType.Internal, profileTypeId, 1, 1000)
                  .pipe(catchError(() => of({ items: [] })))
              : of({ items: [] }),
            userProcs: this.procedureService
              .getUserProcedures(this.profileId, 1, 1000)
              .pipe(catchError(() => of({ items: [] }))),
          })
        })
      )
      .subscribe({
        next: ({ definitions, userProcs }) => {
          const defs = definitions.items || []
          const userList = userProcs.items || []

          const userProcMap = new Map<string, UserProcedureDto>()
          userList.forEach((up) => userProcMap.set(up.procedureId, up))

          const mergedList: UserProcedureDto[] = defs.map((d) => {
            const existing = userProcMap.get(d.id)
            if (existing) {
              return {
                ...existing,
                procedureTitle: d.title,
                costAmount: d.costAmount ?? existing.costAmount,
                costCurrency: d.costCurrency ?? existing.costCurrency,
              }
            }
            return {
              id: 'virtual-' + d.id,
              profileId: this.profileId,
              procedureId: d.id,
              procedureTitle: d.title,
              costAmount: d.costAmount,
              costCurrency: d.costCurrency,
              status: UserProcedureStatus.NotStarted,
              createdAt: d.createdAt,
            }
          })

          userList.forEach((up) => {
            if (!defs.some((d) => d.id === up.procedureId) && !mergedList.some((m) => m.id === up.id)) {
              mergedList.push(up)
            }
          })

          this.profileProcedures = mergedList

          const total = mergedList.length
          const completed = mergedList.filter((p) => p.status === UserProcedureStatus.Completed).length
          const inProgress = mergedList.filter((p) => p.status === UserProcedureStatus.InProgress).length
          const notStarted = mergedList.filter((p) => p.status === UserProcedureStatus.NotStarted).length
          const skipped = mergedList.filter((p) => p.status === UserProcedureStatus.Skipped).length
          const completionPercentage = total > 0 ? (completed / total) * 100 : 0

          this.progress = {
            profileId: this.profileId,
            total,
            completed,
            inProgress,
            notStarted,
            skipped,
            completionPercentage,
          }

          this.profileLoading = false
          this.selectedProfileIds.clear()
        },
        error: () => {
          this.profileLoading = false
          this.error = 'Erreur lors du chargement des démarches du profil.'
        },
      })
  }

  // Profile Selection
  toggleSelectProfile(id: string) {
    if (this.selectedProfileIds.has(id)) {
      this.selectedProfileIds.delete(id)
    } else {
      this.selectedProfileIds.add(id)
    }
  }

  toggleSelectAllProfile() {
    if (this.isAllProfileSelected()) {
      this.selectedProfileIds.clear()
    } else {
      this.profileProcedures.forEach((p) => this.selectedProfileIds.add(p.id))
    }
  }

  isProfileSelected(id: string): boolean {
    return this.selectedProfileIds.has(id)
  }

  isAllProfileSelected(): boolean {
    return (
      this.profileProcedures.length > 0 &&
      this.profileProcedures.every((p) => this.selectedProfileIds.has(p.id))
    )
  }

  getSelectedProfileCount(): number {
    return this.selectedProfileIds.size
  }

  getSelectedProfileProcedures(): UserProcedureDto[] {
    return this.profileProcedures.filter((p) => this.selectedProfileIds.has(p.id))
  }

  canBulkStartProfile(): boolean {
    return this.getSelectedProfileProcedures().some((p) => p.status === UserProcedureStatus.NotStarted)
  }

  canBulkCompleteProfile(): boolean {
    return this.getSelectedProfileProcedures().some((p) => p.status === UserProcedureStatus.InProgress)
  }

  canBulkSkipProfile(): boolean {
    return this.getSelectedProfileProcedures().some(
      (p) => p.status === UserProcedureStatus.NotStarted || p.status === UserProcedureStatus.InProgress
    )
  }

  async bulkStartProfile() {
    const selected = this.getSelectedProfileProcedures().filter(
      (p) => p.status === UserProcedureStatus.NotStarted
    )
    if (selected.length === 0) return

    this.profileBulkActionLoading = true
    this.clearMessages()
    for (const proc of selected) {
      try {
        await this.procedureService
          .startProcedure({ profileId: this.profileId, procedureId: proc.procedureId })
          .toPromise()
      } catch (e) {
        console.error('Failed to start procedure', e)
      }
    }
    this.profileBulkActionLoading = false
    this.selectedProfileIds.clear()
    this.loadProfileData()
  }

  // ==========================================
  // SINGLE ACTIONS & MODAL SUPPORT
  // ==========================================

  openActionModal(content: TemplateRef<any>, proc: UserProcedureDto, action: 'complete' | 'skip') {
    this.selectedProc = proc
    this.modalAction = action
    this.actionNotes = ''
    this.modalService.open(content, { centered: true })
  }

  async startSingle(up: UserProcedureDto) {
    if (up.status !== UserProcedureStatus.NotStarted) return
    this.clearMessages()
    try {
      await this.procedureService
        .startProcedure({ profileId: up.profileId || this.profileId, procedureId: up.procedureId })
        .toPromise()
      this.success = `Démarche "${up.procedureTitle}" démarrée.`
      this.refreshCurrentTab()
    } catch (e: any) {
      this.error = e?.error?.error || 'Échec du démarrage de la démarche.'
    }
  }

  async submitModalAction(modal: any) {
    this.actionLoading = true
    this.clearMessages()

    if (this.selectedProc) {
      // Single procedure action
      const proc = this.selectedProc
      if (this.modalAction === 'complete') {
        const req: CompleteUserProcedureRequest = {
          profileId: proc.profileId || this.profileId,
          notes: this.actionNotes.trim() || undefined,
        }
        this.procedureService.completeProcedure(proc.id, req).subscribe({
          next: () => {
            this.success = `Démarche "${proc.procedureTitle}" complétée avec succès.`
            this.actionLoading = false
            modal.close()
            this.refreshCurrentTab()
          },
          error: (err) => {
            this.error = err?.error?.error || 'Erreur lors de la validation de la démarche.'
            this.actionLoading = false
          },
        })
      } else {
        const req: SkipUserProcedureRequest = {
          notes: this.actionNotes.trim() || undefined,
        }
        this.procedureService.skipProcedure(proc.id, req).subscribe({
          next: () => {
            this.success = `Démarche "${proc.procedureTitle}" marquée comme ignorée.`
            this.actionLoading = false
            modal.close()
            this.refreshCurrentTab()
          },
          error: (err) => {
            this.error = err?.error?.error || "Erreur lors de l'abandon de la démarche."
            this.actionLoading = false
          },
        })
      }
    } else {
      // Bulk action across selected items
      const selected =
        this.activeTab === 'global'
          ? this.getSelectedGlobalProcedures()
          : this.getSelectedProfileProcedures()

      const targetItems =
        this.modalAction === 'complete'
          ? selected.filter((p) => p.status === UserProcedureStatus.InProgress)
          : selected.filter(
              (p) =>
                p.status === UserProcedureStatus.NotStarted ||
                p.status === UserProcedureStatus.InProgress
            )

      let count = 0
      for (const proc of targetItems) {
        try {
          if (this.modalAction === 'complete') {
            await this.procedureService
              .completeProcedure(proc.id, {
                profileId: proc.profileId || this.profileId,
                notes: this.actionNotes.trim() || undefined,
              })
              .toPromise()
          } else {
            await this.procedureService
              .skipProcedure(proc.id, {
                notes: this.actionNotes.trim() || undefined,
              })
              .toPromise()
          }
          count++
        } catch (e) {
          console.error(`Error processing procedure ${proc.id}`, e)
        }
      }

      this.actionLoading = false
      modal.close()
      this.success = `${count} démarche(s) traitée(s) avec succès.`
      if (this.activeTab === 'global') {
        this.selectedGlobalIds.clear()
        this.loadGlobalData()
      } else {
        this.selectedProfileIds.clear()
        this.loadProfileData()
      }
    }
  }
}