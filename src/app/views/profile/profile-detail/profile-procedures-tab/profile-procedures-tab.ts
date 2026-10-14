import { Component, OnInit, Input, signal } from '@angular/core'
import { DatePipe, CommonModule } from '@angular/common'
import { Icon } from '@app/components/icon/icon'
import { RouterLink } from '@angular/router'
import { ProfileService } from '@core/services/profile.service'
import {
  ProcedureProfileType,
  ProcedureProfileTypeLabels,
  ProcedureProfileTypeBadgeVariants,
} from '@core/models/shared/enums.model'
import { BaseResponse, PagedList } from '@core/models/shared/base-response.model'

interface ProcedureSummary {
  id: string
  title: string
  reference: string
  type: ProcedureProfileType
  status: number
  currentStep: string
  progress: number
  createdAt: string
  updatedAt: string
}

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

  procedures = signal<ProcedureSummary[]>([])
  loading = false
  error = ''

  ProcedureProfileType = ProcedureProfileType
  ProcedureProfileTypeLabels = ProcedureProfileTypeLabels
  ProcedureProfileTypeBadgeVariants = ProcedureProfileTypeBadgeVariants

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.loadProcedures()
  }

  loadProcedures() {
    this.loading = true
    this.error = ''

    // TODO: Implement actual API call when backend endpoint is available
    // For now, mock data
    setTimeout(() => {
      this.procedures.set([
        {
          id: '1',
          title: 'Passport Renewal',
          reference: 'PROC-2024-001',
          type: ProcedureProfileType.Internal,
          status: 2,
          currentStep: 'Document Verification',
          progress: 60,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Visa Application',
          reference: 'PROC-2024-002',
          type: ProcedureProfileType.External,
          status: 1,
          currentStep: 'Payment Pending',
          progress: 30,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      this.loading = false
    }, 500)
  }

  getTypeBadge(type: number): string {
    return this.ProcedureProfileTypeBadgeVariants[type as ProcedureProfileType] || 'secondary'
  }

  getTypeLabel(type: number): string {
    return this.ProcedureProfileTypeLabels[type as ProcedureProfileType] || 'Unknown'
  }
}