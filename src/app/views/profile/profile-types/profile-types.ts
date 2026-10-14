import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { ProfileService } from '@core/services/profile.service'
import { ProfileTypeDto } from '@core/models/profile/profile.model'

@Component({
  selector: 'app-profile-types',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule, Icon],
  templateUrl: './profile-types.html',
  styles: ``,
})
export class ProfileTypes implements OnInit {
  types: ProfileTypeDto[] = []
  loading = false
  error = ''
  successMessage = ''
  republishing = false
  editingId: string | null = null

  formData = {
    countryName: '',
    countryCode: '',
    phoneIndicatif: '',
    currency: '',
    flag: '',
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
      flag: t.flag || '',
    }
    this.error = ''
    this.successMessage = ''
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
      flag: '',
    }
  }

  submit() {
    if (!this.formData.countryName || !this.formData.countryCode) return
    this.error = ''
    this.successMessage = ''

    if (this.editingId) {
      this.profileService.updateProfileType(this.editingId, this.formData).subscribe({
        next: () => {
          this.editingId = null
          this.resetForm()
          this.loadTypes()
          this.successMessage = 'Pays / Profile Type mis à jour avec succès.'
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
          this.successMessage = 'Nouveau pays / Profile Type ajouté avec succès.'
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

  republishDirectory() {
    if (!confirm("Republier l'annuaire des profils vers RabbitMQ pour tous les microservices (Marketplace, Document) ?")) {
      return
    }
    this.republishing = true
    this.error = ''
    this.successMessage = ''
    this.profileService.republishDirectory().subscribe({
      next: (res) => {
        this.republishing = false
        this.successMessage = `Annuaire republié avec succès : ${res.totalProcessed ?? 'Tous les'} profils synchronisés.`
      },
      error: (err: any) => {
        this.republishing = false
        this.error = err.error?.error || err.error?.message || "Échec de la republication de l'annuaire."
      },
    })
  }
}
