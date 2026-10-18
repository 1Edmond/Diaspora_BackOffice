import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { ProfileService } from '@core/services/profile.service'
import { ToastService } from '@core/services/toast.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ProfileTypeDto } from '@core/models/profile/profile.model'
import {
  ProfileTypeMobileConfigDto,
  UpsertMobileConfigRequest,
  KNOWN_MOBILE_MODULES,
} from '@core/models/profile/mobile-config.model'
import { forkJoin } from 'rxjs'

@Component({
  selector: 'app-mobile-config',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumb, Icon],
  templateUrl: './mobile-config.html',
  styles: [`
    .module-card {
      border: 1px solid #e9ebec;
      border-radius: 8px;
      padding: 14px;
      transition: all 0.2s ease;
      background: #ffffff;
    }
    .module-card.active {
      border-color: #2ab57d;
      background: #f6fdf9;
    }
    .country-tab {
      cursor: pointer;
      border: 1px solid #e9ebec;
      border-radius: 6px;
      padding: 8px 14px;
      background: #ffffff;
      transition: all 0.2s;
    }
    .country-tab.active {
      background: #405189;
      color: #ffffff;
      border-color: #405189;
    }
    .country-tab.has-override:not(.active) {
      border-color: #0ab39c;
      background: #f0fbf8;
    }
  `],
})
export class MobileConfigComponent implements OnInit {
  profileTypes: ProfileTypeDto[] = []
  allConfigs: ProfileTypeMobileConfigDto[] = []
  globalConfig: ProfileTypeMobileConfigDto | null = null

  // Selection: null means Global Config, otherwise profileTypeId
  selectedProfileTypeId: string | null = null
  selectedProfileType: ProfileTypeDto | null = null
  isCustomOverride = false

  knownModules = KNOWN_MOBILE_MODULES
  loading = false
  saving = false

  form: UpsertMobileConfigRequest = {
    activeModules: {},
    minAppVersion: '1.0.0',
    forceUpdate: false,
    isMaintenanceMode: false,
    maintenanceMessage: '',
    defaultLocale: 'fr',
    supportedLocales: ['fr', 'en', 'ru'],
  }

  availableLocales = [
    { code: 'fr', label: 'Français (fr)' },
    { code: 'en', label: 'English (en)' },
    { code: 'ru', label: 'Русский (ru)' },
    { code: 'es', label: 'Español (es)' },
    { code: 'ar', label: 'العربية (ar)' },
  ]

  constructor(
    private profileService: ProfileService,
    private toast: ToastService,
    private confirmModal: ConfirmModalService
  ) {}

  ngOnInit() {
    this.loadInitialData()
  }

  loadInitialData() {
    this.loading = true
    forkJoin({
      profileTypes: this.profileService.getProfileTypes(),
      allConfigs: this.profileService.getAllMobileConfigs(),
      bootstrap: this.profileService.getMobileBootstrapConfig(),
    }).subscribe({
      next: ({ profileTypes, allConfigs, bootstrap }) => {
        this.profileTypes = profileTypes
        this.allConfigs = allConfigs
        this.globalConfig = allConfigs.find(c => !c.profileTypeId) || bootstrap

        this.selectTarget(null)
        this.loading = false
      },
      error: () => {
        this.toast.error('Erreur lors du chargement des configurations mobiles.')
        this.loading = false
      },
    })
  }

  selectTarget(profileTypeId: string | null) {
    this.selectedProfileTypeId = profileTypeId
    if (!profileTypeId) {
      this.selectedProfileType = null
      this.isCustomOverride = true
      this.populateForm(this.globalConfig)
      return
    }

    this.selectedProfileType = this.profileTypes.find(p => p.id === profileTypeId) || null
    const existing = this.allConfigs.find(c => c.profileTypeId === profileTypeId)

    if (existing) {
      this.isCustomOverride = true
      this.populateForm(existing)
    } else {
      this.isCustomOverride = false
      // Fallback to global config values
      this.populateForm(this.globalConfig)
    }
  }

  populateForm(config: ProfileTypeMobileConfigDto | null) {
    const modules: Record<string, boolean> = {}
    for (const mod of this.knownModules) {
      modules[mod.key] = config?.activeModules?.[mod.key] ?? false
    }

    this.form = {
      activeModules: modules,
      minAppVersion: config?.minAppVersion || '1.0.0',
      forceUpdate: config?.forceUpdate ?? false,
      isMaintenanceMode: config?.isMaintenanceMode ?? false,
      maintenanceMessage: config?.maintenanceMessage || '',
      defaultLocale: config?.defaultLocale || 'fr',
      supportedLocales: config?.supportedLocales?.length ? [...config.supportedLocales] : ['fr', 'en', 'ru'],
    }
  }

  hasOverride(profileTypeId: string): boolean {
    return this.allConfigs.some(c => c.profileTypeId === profileTypeId)
  }

  toggleModule(key: string) {
    if (!this.form.activeModules) {
      this.form.activeModules = {}
    }
    this.form.activeModules[key] = !this.form.activeModules[key]
  }

  isLocaleSupported(code: string): boolean {
    return this.form.supportedLocales?.includes(code) ?? false
  }

  toggleLocale(code: string) {
    if (!this.form.supportedLocales) {
      this.form.supportedLocales = []
    }
    const idx = this.form.supportedLocales.indexOf(code)
    if (idx >= 0) {
      if (this.form.supportedLocales.length > 1) {
        this.form.supportedLocales.splice(idx, 1)
      } else {
        this.toast.warning('Au moins une langue doit être supportée.')
      }
    } else {
      this.form.supportedLocales.push(code)
    }
  }

  save() {
    this.saving = true

    if (!this.selectedProfileTypeId) {
      // Global save
      this.profileService.upsertGlobalMobileConfig(this.form).subscribe({
        next: (saved) => {
          this.globalConfig = saved
          const idx = this.allConfigs.findIndex(c => !c.profileTypeId)
          if (idx >= 0) this.allConfigs[idx] = saved
          else this.allConfigs.push(saved)

          this.toast.success('Configuration mobile globale enregistrée avec succès.')
          this.saving = false
        },
        error: () => {
          this.toast.error('Erreur lors de la sauvegarde de la configuration globale.')
          this.saving = false
        },
      })
    } else {
      // ProfileType specific save
      this.profileService.upsertProfileTypeMobileConfig(this.selectedProfileTypeId, this.form).subscribe({
        next: (saved) => {
          const idx = this.allConfigs.findIndex(c => c.profileTypeId === this.selectedProfileTypeId)
          if (idx >= 0) this.allConfigs[idx] = saved
          else this.allConfigs.push(saved)

          this.isCustomOverride = true
          this.toast.success(`Configuration enregistrée pour ${this.selectedProfileType?.countryName || 'le pays'}.`)
          this.saving = false
        },
        error: () => {
          this.toast.error('Erreur lors de la sauvegarde de la configuration du pays.')
          this.saving = false
        },
      })
    }
  }

  async resetToGlobal() {
    if (!this.selectedProfileTypeId) return

    const confirmed = await this.confirmModal.confirm({
      title: 'Rétablir la configuration globale ?',
      message: `La configuration spécifique pour ${this.selectedProfileType?.countryName || 'ce pays'} sera supprimée. L'application mobile appliquera désormais la configuration globale par défaut.`,
      confirmText: 'Supprimer la surcharge',
      cancelText: 'Annuler',
      variant: 'warning',
      icon: 'refresh-cw',
    })

    if (!confirmed) return

    this.saving = true
    this.profileService.deleteProfileTypeMobileConfig(this.selectedProfileTypeId).subscribe({
      next: () => {
        this.allConfigs = this.allConfigs.filter(c => c.profileTypeId !== this.selectedProfileTypeId)
        this.isCustomOverride = false
        this.populateForm(this.globalConfig)
        this.toast.success('Surcharge supprimée. Configuration globale rétablie.')
        this.saving = false
      },
      error: () => {
        this.toast.error('Erreur lors de la suppression de la surcharge.')
        this.saving = false
      },
    })
  }
}
