import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Observable } from 'rxjs'
import { ProcedureService } from '@core/services/procedure.service'
import { ProfileService } from '@core/services/profile.service'
import { DocumentService } from '@core/services/document.service'
import { CreateProcedureRequest } from '@core/models/procedure/procedure.model'
import { ProfileTypeDto } from '@core/models/profile/profile.model'
import { DocumentTypeDto } from '@core/models/document/document.model'
import { LocationDto } from '@core/models/procedure/procedure.model'
import { ProcedureProfileType } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-procedure-form',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule, RouterLink],
  templateUrl: './procedure-form.html',
  styles: ``,
})
export class ProcedureForm implements OnInit {
  isEdit = false
  procedureId = ''
  profileTypes: ProfileTypeDto[] = []
  documentTypes: DocumentTypeDto[] = []
  locations: LocationDto[] = []

  model: CreateProcedureRequest = {
    title: '',
    description: '',
    costAmount: 0,
    costCurrency: 'EUR',
    profileType: ProcedureProfileType.Internal,
    profileTypeId: '',
    estimatedDurationDays: 30,
    locationIds: [],
    inlineLocations: [],
    dependencyIds: [],
    requiredDocumentTypeIds: [],
  }
  saving = false
  error = ''

  ProcedureProfileType = ProcedureProfileType

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private procedureService: ProcedureService,
    private profileService: ProfileService,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    this.profileService.getProfileTypes().subscribe({
      next: (types) => {
        this.profileTypes = types
        if (!this.isEdit && types.length > 0) {
          this.model.profileTypeId = types[0].id
        }
      },
      error: () => {},
    })
    this.documentService.getDocumentTypes().subscribe({
      next: (docs) => { this.documentTypes = docs },
      error: () => {},
    })
    this.procedureService.getLocations().subscribe({
      next: (locs) => { this.locations = locs },
      error: () => {},
    })

    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.isEdit = true
      this.procedureId = id
      this.procedureService.getProcedure(id).subscribe({
        next: (p) => {
          this.model = {
            title: p.title,
            description: p.description || '',
            costAmount: p.costAmount,
            costCurrency: p.costCurrency,
            profileType: p.profileType,
            profileTypeId: p.profileTypeId,
            estimatedDurationDays: p.estimatedDurationDays,
            locationIds: p.locations.map((l) => l.id),
            inlineLocations: [],
            dependencyIds: p.dependencyIds,
            requiredDocumentTypeIds: p.requiredDocumentTypeIds,
          }
        },
        error: () => this.router.navigate(['/procedures']),
      })
    }
  }

  toggleLocation(id: string) {
    const idx = this.model.locationIds.indexOf(id)
    if (idx >= 0) {
      this.model.locationIds.splice(idx, 1)
    } else {
      this.model.locationIds.push(id)
    }
  }

  toggleDocumentType(id: string) {
    const idx = this.model.requiredDocumentTypeIds.indexOf(id)
    if (idx >= 0) {
      this.model.requiredDocumentTypeIds.splice(idx, 1)
    } else {
      this.model.requiredDocumentTypeIds.push(id)
    }
  }

  save() {
    if (!this.model.title || !this.model.profileTypeId) return
    this.saving = true
    this.error = ''
    const obs: Observable<any> = this.isEdit
      ? this.procedureService.updateProcedure(this.procedureId, {
          title: this.model.title,
          description: this.model.description,
          costAmount: this.model.costAmount,
          costCurrency: this.model.costCurrency,
          estimatedDurationDays: this.model.estimatedDurationDays,
          locationIds: this.model.locationIds,
          inlineLocations: this.model.inlineLocations,
          dependencyIds: this.model.dependencyIds,
          requiredDocumentTypeIds: this.model.requiredDocumentTypeIds,
        })
      : this.procedureService.createProcedure(this.model)

    obs.subscribe({
      next: () => {
        this.saving = false
        this.router.navigate(['/procedures'])
      },
      error: (err: any) => {
        this.saving = false
        this.error = err.error?.error || err.error?.message || 'Failed to save'
      },
    })
  }
}
