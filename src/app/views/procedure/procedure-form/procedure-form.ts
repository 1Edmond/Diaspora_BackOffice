import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { Observable, forkJoin, of } from 'rxjs'
import { ProcedureService } from '@core/services/procedure.service'
import { ProfileService } from '@core/services/profile.service'
import { DocumentService } from '@core/services/document.service'
import {
  CreateProcedureRequest,
  ProcedureDto,
  LocationDto,
} from '@core/models/procedure/procedure.model'
import { ProfileTypeDto } from '@core/models/profile/profile.model'
import { DocumentTypeDto } from '@core/models/document/document.model'
import { ProcedureProfileType } from '@core/models/shared/enums.model'
import {
  COMMON_LANGUAGES,
  LanguageOption,
  getLanguageDisplay,
} from '@core/constants/languages.constant'

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-procedure-form',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule, RouterLink, Icon, NgbDropdownModule],
  templateUrl: './procedure-form.html',
  styles: ``,
})
export class ProcedureForm implements OnInit {
  isEdit = false
  procedureId = ''
  profileTypes: ProfileTypeDto[] = []
  documentTypes: DocumentTypeDto[] = []
  locations: LocationDto[] = []
  availableProcedures: ProcedureDto[] = []

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

  // Dynamic multilingual translations
  formLanguage = 'fr'
  formLanguages: string[] = ['fr']
  translations: { [culture: string]: { Title: string; Description: string } } = {
    fr: { Title: '', Description: '' },
  }
  customLangInput = ''
  commonLanguages = COMMON_LANGUAGES

  saving = false
  error = ''
  successMessage = ''

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
          if (types[0].currency) {
            this.model.costCurrency = types[0].currency
          }
          this.loadDependencies()
        }
      },
      error: () => {},
    })

    this.documentService.getDocumentTypes().subscribe({
      next: (docs) => {
        this.documentTypes = docs
      },
      error: () => {},
    })

    this.procedureService.getLocations().subscribe({
      next: (locs) => {
        this.locations = locs
      },
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
            dependencyIds: p.dependencyIds || [],
            requiredDocumentTypeIds: p.requiredDocumentTypeIds || [],
          }
          this.translations['fr'] = {
            Title: p.title,
            Description: p.description || '',
          }
          this.loadDependencies()
          this.loadExistingTranslations(id)
        },
        error: () => this.router.navigate(['/procedures']),
      })
    }
  }

  loadExistingTranslations(procId: string) {
    this.procedureService.getProcedureTranslations(procId).subscribe({
      next: (transList) => {
        if (transList && Array.isArray(transList)) {
          transList.forEach((t) => {
            const culture = (t.cultureCode || '').toLowerCase()
            if (culture) {
              if (!this.formLanguages.includes(culture)) {
                this.formLanguages.push(culture)
              }
              this.translations[culture] = {
                Title: t.fields?.Title || this.translations[culture]?.Title || '',
                Description: t.fields?.Description || this.translations[culture]?.Description || '',
              }
            }
          })
        }
      },
      error: () => {},
    })
  }

  loadDependencies() {
    if (!this.model.profileTypeId) return
    this.procedureService
      .getProcedures(this.model.profileType, this.model.profileTypeId, 1, 100)
      .subscribe({
        next: (res) => {
          this.availableProcedures = res.items.filter((p) => p.id !== this.procedureId)
        },
        error: () => {},
      })
  }

  onProfileTypeChange() {
    const selected = this.profileTypes.find((pt) => pt.id === this.model.profileTypeId)
    if (selected?.currency) {
      this.model.costCurrency = selected.currency
    }
    this.loadDependencies()
  }

  getLangInfo(code: string): LanguageOption {
    return getLanguageDisplay(code)
  }

  addLanguage(code: string) {
    const normalized = (code || '').trim().toLowerCase()
    if (!normalized) return
    if (!this.formLanguages.includes(normalized)) {
      this.formLanguages.push(normalized)
      if (!this.translations[normalized]) {
        this.translations[normalized] = { Title: '', Description: '' }
      }
    }
    this.formLanguage = normalized
    this.customLangInput = ''
  }

  removeLanguage(code: string, event: Event) {
    event.stopPropagation()
    if (this.formLanguages.length <= 1) return
    this.formLanguages = this.formLanguages.filter((l) => l !== code)
    delete this.translations[code]
    if (this.formLanguage === code) {
      this.formLanguage = this.formLanguages[0]
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

  toggleDependency(id: string) {
    const idx = this.model.dependencyIds.indexOf(id)
    if (idx >= 0) {
      this.model.dependencyIds.splice(idx, 1)
    } else {
      this.model.dependencyIds.push(id)
    }
  }

  save() {
    const primaryTitle =
      this.translations['fr']?.Title?.trim() ||
      this.translations[this.formLanguage]?.Title?.trim() ||
      Object.values(this.translations).find((t) => !!t.Title?.trim())?.Title?.trim() ||
      ''

    if (!primaryTitle) {
      this.error = 'Veuillez renseigner un titre dans au moins une langue.'
      return
    }

    if (!this.model.profileTypeId) {
      this.error = 'Veuillez sélectionner un profil type / pays.'
      return
    }

    const primaryDesc =
      this.translations['fr']?.Description?.trim() ||
      this.translations[this.formLanguage]?.Description?.trim() ||
      ''

    this.model.title = primaryTitle
    this.model.description = primaryDesc

    this.saving = true
    this.error = ''

    const saveObs: Observable<any> = this.isEdit
      ? this.procedureService.updateProcedure(this.procedureId, {
          title: this.model.title,
          description: this.model.description,
          costAmount: Number(this.model.costAmount) || 0,
          costCurrency: this.model.costCurrency || 'EUR',
          estimatedDurationDays: Number(this.model.estimatedDurationDays) || 30,
          locationIds: this.model.locationIds,
          inlineLocations: this.model.inlineLocations,
          dependencyIds: this.model.dependencyIds,
          requiredDocumentTypeIds: this.model.requiredDocumentTypeIds,
        })
      : this.procedureService.createProcedure({
          ...this.model,
          costAmount: Number(this.model.costAmount) || 0,
          estimatedDurationDays: Number(this.model.estimatedDurationDays) || 30,
        })

    saveObs.subscribe({
      next: (res) => {
        const targetId = this.isEdit ? this.procedureId : (res?.procedureId || res)
        this.saveTranslations(targetId)
      },
      error: (err: any) => {
        this.saving = false
        this.error = err.error?.error || err.error?.message || 'Erreur lors de l\'enregistrement de la procédure.'
      },
    })
  }

  private saveTranslations(procedureId: string) {
    if (!procedureId) {
      this.saving = false
      this.router.navigate(['/procedures'])
      return
    }

    const translationRequests: Observable<any>[] = []
    for (const culture of this.formLanguages) {
      const trans = this.translations[culture]
      if (trans && (trans.Title?.trim() || trans.Description?.trim())) {
        translationRequests.push(
          this.procedureService.setProcedureTranslation(procedureId, culture, {
            Title: trans.Title?.trim() || this.model.title,
            Description: trans.Description?.trim() || '',
          })
        )
      }
    }

    if (translationRequests.length === 0) {
      this.saving = false
      this.router.navigate(['/procedures'])
      return
    }

    forkJoin(translationRequests).subscribe({
      next: () => {
        this.saving = false
        this.router.navigate(['/procedures'])
      },
      error: () => {
        // Even if some translation fails, procedure itself is saved
        this.saving = false
        this.router.navigate(['/procedures'])
      },
    })
  }
}
