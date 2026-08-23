import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { ProfileService } from '@core/services/profile.service'
import { ProfileTypeDto } from '@core/models/profile/profile.model'

@Component({
  selector: 'app-profile-types',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule],
  templateUrl: './profile-types.html',
  styles: ``,
})
export class ProfileTypes implements OnInit {
  types: ProfileTypeDto[] = []
  loading = false
  error = ''
  editingId: string | null = null

  formData = {
    countryName: '',
    countryCode: '',
    phoneIndicatif: '',
    currency: '',
  }

  constructor(
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.loadTypes()
  }

  loadTypes() {
    this.loading = true
    this.profileService.getProfileTypes().subscribe({
      next: (res) => {
        this.types = res
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  startEdit(t: ProfileTypeDto) {
    this.editingId = t.id
    this.formData = {
      countryName: t.countryName,
      countryCode: t.countryCode,
      phoneIndicatif: t.phoneIndicatif,
      currency: t.currency,
    }
    this.error = ''
  }

  cancelEdit() {
    this.editingId = null
    this.resetForm()
  }

  resetForm() {
    this.formData = {
      countryName: '',
      countryCode: '',
      phoneIndicatif: '',
      currency: '',
    }
  }

  submit() {
    if (!this.formData.countryName || !this.formData.countryCode) return
    this.error = ''

    if (this.editingId) {
      this.profileService.updateProfileType(this.editingId, this.formData).subscribe({
        next: () => {
          this.editingId = null
          this.resetForm()
          this.loadTypes()
        },
        error: (err: any) => {
          this.error = err.error?.error || err.error?.message || 'Failed to update profile type'
        },
      })
    } else {
      this.profileService.createProfileType(this.formData).subscribe({
        next: () => {
          this.resetForm()
          this.loadTypes()
        },
        error: (err: any) => {
          this.error = err.error?.error || err.error?.message || 'Failed to create profile type'
        },
      })
    }
  }

  toggleActive(t: ProfileTypeDto) {
    const action = t.isActive
      ? this.profileService.deactivateProfileType(t.id)
      : this.profileService.activateProfileType(t.id)
    action.subscribe({
      next: () => this.loadTypes(),
      error: () => {},
    })
  }
}
