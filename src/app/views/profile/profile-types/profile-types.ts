import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { ProfileService } from '@core/services/profile.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
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
    private profileService: ProfileService,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
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
          this.toast.success(this.successMessage)
        },
        error: (err: any) => {
          this.error = err.error?.error || err.error?.message || 'Failed to update profile type'
          this.toast.error(this.error)
        },
      })
    } else {
      this.profileService.createProfileType(this.formData).subscribe({
        next: () => {
          this.resetForm()
          this.loadTypes()
          this.successMessage = 'Nouveau pays / Profile Type ajouté avec succès.'
          this.toast.success(this.successMessage)
        },
        error: (err: any) => {
          this.error = err.error?.error || err.error?.message || 'Failed to create profile type'
          this.toast.error(this.error)
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

  async republishDirectory() {
    const confirmed = await this.confirmModal.confirm({
      title: 'Republier l\'annuaire',
      message: "Republier l'annuaire des profils vers RabbitMQ pour tous les microservices (Marketplace, Document) ?",
      confirmText: 'Republier',
      variant: 'primary'
    })
    if (!confirmed) {
      return
    }
    this.republishing = true
    this.error = ''
    this.successMessage = ''
    this.profileService.republishDirectory().subscribe({
      next: (res) => {
        this.republishing = false
        this.successMessage = `Annuaire republié avec succès : ${res.totalProcessed ?? 'Tous les'} profils synchronisés.`
        this.toast.success(this.successMessage)
      },
      error: (err: any) => {
        this.republishing = false
        this.error = err.error?.error || err.error?.message || "Échec de la republication de l'annuaire."
        this.toast.error(this.error)
      },
    })
  }
}
