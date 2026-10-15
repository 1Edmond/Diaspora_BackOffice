import { Component, OnInit, Input, signal } from '@angular/core'
import { DatePipe, CommonModule } from '@angular/common'
import { Icon } from '@app/components/icon/icon'
import { RouterLink } from '@angular/router'
import { ProcedureService } from '@core/services/procedure.service'
import { UserProcedureDto } from '@core/models/procedure/procedure.model'
import {
  UserProcedureStatus,
  UserProcedureStatusLabels,
  UserProcedureStatusBadgeVariants,
} from '@core/models/shared/enums.model'

@Component({
  selector: 'app-profile-procedures-tab',
  standalone: true,
  imports: [CommonModule, DatePipe, Icon, RouterLink],
  templateUrl: './profile-procedures-tab.html',
  styles: ``,
})
export class ProfileProceduresTab implements OnInit {
  @Input() profileId!: string
  @Input() userId!: string

  procedures = signal<UserProcedureDto[]>([])
  loading = false
  error = ''

  UserProcedureStatus = UserProcedureStatus
  UserProcedureStatusLabels = UserProcedureStatusLabels
  UserProcedureStatusBadgeVariants = UserProcedureStatusBadgeVariants

  constructor(private procedureService: ProcedureService) {}

  ngOnInit() {
    if (this.profileId) {
      this.loadProcedures()
    }
  }

  loadProcedures() {
    this.loading = true
    this.error = ''

    this.procedureService.getUserProcedures(this.profileId, 1, 20).subscribe({
      next: (res) => {
        this.procedures.set(res.items || [])
        this.loading = false
      },
      error: (err: any) => {
        this.loading = false
        if (err.status !== 404) {
          this.error = err.error?.error || err.error?.message || 'Impossible de charger les démarches'
        }
      }
    })
  }

  getStatusBadge(status: number): string {
    return this.UserProcedureStatusBadgeVariants[status as UserProcedureStatus] || 'secondary'
  }

  getStatusLabel(status: number): string {
    return this.UserProcedureStatusLabels[status as UserProcedureStatus] || 'Inconnu'
  }
}