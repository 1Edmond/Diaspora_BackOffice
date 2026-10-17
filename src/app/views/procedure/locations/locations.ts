import { Component, OnInit, TemplateRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { ProcedureService } from '@core/services/procedure.service'
import { ProfileService } from '@core/services/profile.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import {
  CreateLocationRequest,
  DayScheduleRequest,
  LocationDto,
  UpdateLocationRequest,
} from '@core/models/procedure/procedure.model'
import { ProfileTypeDto } from '@core/models/profile/profile.model'

const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, PageBreadcrumb, FormsModule, Icon],
  templateUrl: './locations.html',
  styles: ``,
})
export class Locations implements OnInit {
  locations: LocationDto[] = []
  filteredLocations: LocationDto[] = []
  profileTypes: ProfileTypeDto[] = []
  loading = false
  DAY_NAMES = DAY_NAMES

  // Filtres
  searchTerm = ''
  selectedCountry = ''
  selectedCity = ''

  // Modale Création / Édition
  editingId: string | null = null
  model: CreateLocationRequest = this.createDefaultModel()
  saving = false
  error = ''
  modalRef: NgbModalRef | null = null

  constructor(
    private procedureService: ProcedureService,
    private profileService: ProfileService,
    private modalService: NgbModal,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadProfileTypes()
    this.loadLocations()
  }

  loadProfileTypes() {
    this.profileService.getProfileTypes().subscribe({
      next: (types) => {
        this.profileTypes = types || []
      },
      error: () => {},
    })
  }

  createDefaultModel(): CreateLocationRequest {
    return {
      name: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      latitude: 0,
      longitude: 0,
      phoneNumber: '',
      email: '',
      website: '',
      schedule: Array.from({ length: 7 }, (_, i) => {
        const isWorkDay = i >= 1 && i <= 5
        return {
          day: i,
          isClosed: !isWorkDay,
          openTime: isWorkDay ? '09:00' : undefined,
          closeTime: isWorkDay ? '17:00' : undefined,
        } as DayScheduleRequest
      }),
    }
  }

  loadLocations() {
    this.loading = true
    this.procedureService.getLocations().subscribe({
      next: (res) => {
        this.locations = res || []
        this.applyFilters()
        this.loading = false
      },
      error: () => {
        this.loading = false
        this.toast.error('Impossible de charger la liste des lieux et représentations consulaires.')
      },
    })
  }

  get availableCities(): string[] {
    const cities = new Set<string>()
    for (const loc of this.locations) {
      if (loc.city && (!this.selectedCountry || this.matchesCountry(loc, this.selectedCountry))) {
        cities.add(loc.city)
      }
    }
    return Array.from(cities).sort()
  }

  get countriesCount(): number {
    const countries = new Set(this.locations.map((l) => (l.country || '').trim().toLowerCase()).filter(Boolean))
    return countries.size
  }

  private matchesCountry(loc: LocationDto, filterValue: string): boolean {
    if (!filterValue) return true
    const f = filterValue.toLowerCase()
    const c = (loc.country || '').toLowerCase()
    if (c === f || c.includes(f)) return true
    const pt = this.profileTypes.find(
      (p) => p.countryCode.toLowerCase() === f || p.countryName.toLowerCase() === f
    )
    if (pt) {
      return c === pt.countryCode.toLowerCase() || c === pt.countryName.toLowerCase()
    }
    return false
  }

  applyFilters() {
    const search = this.searchTerm.trim().toLowerCase()
    const city = this.selectedCity.trim().toLowerCase()

    this.filteredLocations = this.locations.filter((loc) => {
      if (this.selectedCountry && !this.matchesCountry(loc, this.selectedCountry)) {
        return false
      }
      if (city && (loc.city || '').toLowerCase() !== city) {
        return false
      }
      if (search) {
        const hay = `${loc.name || ''} ${loc.street || ''} ${loc.city || ''} ${loc.country || ''} ${loc.postalCode || ''} ${loc.phoneNumber || ''}`.toLowerCase()
        if (!hay.includes(search)) return false
      }
      return true
    })
  }

  resetFilters() {
    this.searchTerm = ''
    this.selectedCountry = ''
    this.selectedCity = ''
    this.applyFilters()
  }

  openCreateModal(content: TemplateRef<any>) {
    this.editingId = null
    this.model = this.createDefaultModel()
    this.error = ''
    this.saving = false
    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg', scrollable: true })
  }

  openEditModal(loc: LocationDto, content: TemplateRef<any>) {
    this.editingId = loc.id
    this.error = ''
    this.saving = false

    const scheduleMap = new Map<number, DayScheduleRequest>()
    for (const s of loc.schedule || []) {
      scheduleMap.set(s.day, {
        day: s.day,
        isClosed: s.isClosed,
        openTime: s.openTime ? s.openTime.substring(0, 5) : '09:00',
        closeTime: s.closeTime ? s.closeTime.substring(0, 5) : '17:00',
      })
    }

    const fullSchedule: DayScheduleRequest[] = Array.from({ length: 7 }, (_, i) => {
      if (scheduleMap.has(i)) return scheduleMap.get(i)!
      const isWorkDay = i >= 1 && i <= 5
      return {
        day: i,
        isClosed: !isWorkDay,
        openTime: isWorkDay ? '09:00' : undefined,
        closeTime: isWorkDay ? '17:00' : undefined,
      }
    })

    this.model = {
      name: loc.name || '',
      street: loc.street || '',
      city: loc.city || '',
      state: loc.state || '',
      postalCode: loc.postalCode || '',
      country: loc.country || '',
      latitude: loc.latitude ?? 0,
      longitude: loc.longitude ?? 0,
      phoneNumber: loc.phoneNumber || '',
      email: loc.email || '',
      website: loc.website || '',
      schedule: fullSchedule,
    }

    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg', scrollable: true })
  }

  closeModal() {
    this.modalRef?.close()
    this.modalRef = null
    this.editingId = null
    this.error = ''
  }

  onOpenChange(slot: DayScheduleRequest, isOpen: boolean) {
    slot.isClosed = !isOpen
    if (slot.isClosed) {
      slot.openTime = undefined
      slot.closeTime = undefined
    } else {
      if (!slot.openTime) slot.openTime = '09:00'
      if (!slot.closeTime) slot.closeTime = '17:00'
    }
  }

  isFormValid(): boolean {
    if (!this.model.name?.trim() || !this.model.city?.trim() || !this.model.country?.trim()) {
      return false
    }
    for (const slot of this.model.schedule) {
      if (!slot.isClosed && (!slot.openTime || !slot.closeTime)) return false
    }
    return true
  }

  saveLocation() {
    if (!this.isFormValid()) {
      this.error = 'Veuillez renseigner les champs obligatoires (Nom, Ville, Pays) ainsi que les horaires des jours ouverts.'
      this.toast.warning(this.error)
      return
    }
    this.saving = true
    this.error = ''

    const payload: CreateLocationRequest & UpdateLocationRequest = {
      name: this.model.name.trim(),
      street: (this.model.street || '').trim(),
      city: this.model.city.trim(),
      state: (this.model.state || '').trim(),
      postalCode: (this.model.postalCode || '').trim(),
      country: this.model.country.trim(),
      latitude: Number(this.model.latitude) || 0,
      longitude: Number(this.model.longitude) || 0,
      phoneNumber: this.model.phoneNumber?.trim() || undefined,
      email: this.model.email?.trim() || undefined,
      website: this.model.website?.trim() || undefined,
      schedule: this.model.schedule.map((s) => ({
        day: s.day,
        isClosed: s.isClosed,
        openTime: s.isClosed ? undefined : s.openTime,
        closeTime: s.isClosed ? undefined : s.closeTime,
      })),
    }

    if (this.editingId) {
      this.procedureService.updateLocation(this.editingId, payload).subscribe({
        next: () => {
          this.saving = false
          this.toast.success('Le lieu / consulat a été mis à jour avec succès.')
          this.closeModal()
          this.loadLocations()
        },
        error: (err: any) => {
          this.saving = false
          this.error = err.error?.error || err.error?.message || 'Erreur lors de la mise à jour du lieu.'
          this.toast.error(this.error)
        },
      })
    } else {
      this.procedureService.createLocation(payload).subscribe({
        next: () => {
          this.saving = false
          this.toast.success('Nouveau lieu / consulat créé avec succès.')
          this.closeModal()
          this.loadLocations()
        },
        error: (err: any) => {
          this.saving = false
          this.error = err.error?.error || err.error?.message || 'Erreur lors de la création du lieu.'
          this.toast.error(this.error)
        },
      })
    }
  }

  async deleteLocation(loc: LocationDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer le lieu / consulat',
      message: `Êtes-vous sûr de vouloir supprimer "${loc.name}" (${loc.city}, ${loc.country}) ?`,
      confirmText: 'Supprimer',
      variant: 'danger',
      icon: 'trash-2',
    })
    if (!confirmed) return

    this.procedureService.deleteLocation(loc.id).subscribe({
      next: () => {
        this.toast.success(`Le lieu "${loc.name}" a été supprimé avec succès.`)
        this.loadLocations()
      },
      error: (err: any) => {
        this.toast.error(err?.error?.error || err?.error?.message || 'Impossible de supprimer ce lieu.')
      },
    })
  }

  openDaysCount(schedule: DayScheduleRequest[]): number {
    return schedule ? schedule.filter((s) => !s.isClosed).length : 0
  }

  formatScheduleSummary(schedule: DayScheduleRequest[]): string {
    if (!schedule || schedule.length === 0) return '—'
    const openDays = schedule.filter((s) => !s.isClosed)
    if (openDays.length === 0) return 'Fermé'
    if (openDays.length === 7) return 'Ouvert 7j/7'
    const first = openDays[0]
    const hours = first.openTime && first.closeTime ? ` (${first.openTime.substring(0, 5)}–${first.closeTime.substring(0, 5)})` : ''
    return `${openDays.length}j/7 ouverts${hours}`
  }
}
