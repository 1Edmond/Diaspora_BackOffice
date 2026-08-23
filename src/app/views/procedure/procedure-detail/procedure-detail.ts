import { Component, OnInit, effect } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { ProcedureService } from '@core/services/procedure.service'
import { ProfileStateService } from '@core/services/profile-state.service'
import { DocumentService } from '@core/services/document.service'
import { ProcedureDto, LocationDto } from '@core/models/procedure/procedure.model'
import { DocumentTypeDto } from '@core/models/document/document.model'
import { ProcedureProfileTypeLabels, ProcedureProfileType } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-procedure-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe, PageBreadcrumb, Icon],
  templateUrl: './procedure-detail.html',
  styles: ``,
})
export class ProcedureDetail implements OnInit {
  procedure: ProcedureDto | null = null
  loading = true
  error = ''
  selectedProfileId = ''
  documentTypes: DocumentTypeDto[] = []
  dependencyProcedures: ProcedureDto[] = []

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private procedureService: ProcedureService,
    private profileState: ProfileStateService,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    this.selectedProfileId = this.profileState.selectedProfileId() || ''
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')
      if (id) this.loadProcedure(id)
    })
    effect(() => {
      this.selectedProfileId = this.profileState.selectedProfileId() || ''
    })
  }

  loadProcedure(id: string) {
    this.loading = true
    this.error = ''
    this.procedureService.getProcedure(id).subscribe({
      next: p => {
        this.procedure = p
        this.loading = false
        this.loadReferenceData()
      },
      error: () => {
        this.error = 'Procédure introuvable'
        this.loading = false
      },
    })
  }

  loadReferenceData() {
    this.documentService.getDocumentTypes().subscribe({
      next: (types) => { this.documentTypes = types },
      error: () => {},
    })
    if (this.procedure?.dependencyIds?.length) {
      const deps = this.procedure.dependencyIds
      for (const depId of deps) {
        this.procedureService.getProcedure(depId).subscribe({
          next: (dep) => this.dependencyProcedures.push(dep),
          error: () => {},
        })
      }
    }
  }

  getProfileTypeLabel(key: ProcedureProfileType): string {
    return ProcedureProfileTypeLabels[key] || String(key)
  }

  getDocumentTypeName(id: string): string {
    const dt = this.documentTypes.find(t => t.id === id)
    return dt ? `${dt.name} (${dt.code})` : id
  }

  getDependencyTitle(id: string): string {
    const dep = this.dependencyProcedures.find(p => p.id === id)
    return dep ? dep.title : id
  }

  formatSchedule(schedule: LocationDto['schedule']): string {
    if (!schedule?.length) return '—'
    return schedule
      .map(s => `${this.dayLabel(s.day)}: ${s.isClosed ? 'Fermé' : `${s.openTime}–${s.closeTime}`}`)
      .join(' • ')
  }

  dayLabel(day: number): string {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    return days[day] || ''
  }

  startProcedure() {
    if (!this.selectedProfileId) return
    this.procedureService.startProcedure({ profileId: this.selectedProfileId, procedureId: this.procedure!.id }).subscribe({
      next: () => this.router.navigate(['/procedures/user-procedures']),
      error: () => {},
    })
  }

  goBack() {
    this.router.navigate(['/procedures'])
  }
}
