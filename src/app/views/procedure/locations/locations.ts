import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { ProcedureService } from '@core/services/procedure.service'
import { CreateLocationRequest, DayScheduleRequest, LocationDto } from '@core/models/procedure/procedure.model'
import { Icon } from '@app/components/icon/icon'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule, Icon],
  templateUrl: './locations.html',
  styles: ``,
})
export class Locations implements OnInit {
  locations: LocationDto[] = []
  loading = false
  DAY_NAMES = DAY_NAMES

  model: CreateLocationRequest = this.createDefaultModel()
  saving = false
  error = ''

  constructor(
    private procedureService: ProcedureService
  ) {}

  ngOnInit() {
    this.loadLocations()
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
        this.locations = res
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  resetForm() {
    this.model = this.createDefaultModel()
    this.saving = false
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
    if (!this.model.name) return false
    for (const slot of this.model.schedule) {
      if (!slot.isClosed && (!slot.openTime || !slot.closeTime)) return false
    }
    return true
  }

  createLocation() {
    if (!this.isFormValid()) {
      this.error = 'Please fill in all required fields and opening hours for open days.'
      return
    }
    this.saving = true
    this.error = ''
    const payload: CreateLocationRequest = {
      ...this.model,
      schedule: this.model.schedule.map((s) => ({
        day: s.day,
        isClosed: s.isClosed,
        openTime: s.isClosed ? undefined : s.openTime,
        closeTime: s.isClosed ? undefined : s.closeTime,
      })),
    }
    this.procedureService.createLocation(payload).subscribe({
      next: () => {
        this.resetForm()
        this.loadLocations()
      },
      error: (err: any) => {
        this.saving = false
        this.error = err.error?.error || err.error?.message || 'Failed to create location'
      },
    })
  }

  openDaysCount(schedule: DayScheduleRequest[]): number {
    return schedule ? schedule.filter((s) => !s.isClosed).length : 0
  }

  formatScheduleSummary(schedule: DayScheduleRequest[]): string {
    if (!schedule || schedule.length === 0) return '—'
    const openDays = schedule.filter((s) => !s.isClosed)
    if (openDays.length === 0) return 'Closed'
    if (openDays.length === 7) return 'Open every day'
    return `${openDays.length} day(s) open`
  }
}
