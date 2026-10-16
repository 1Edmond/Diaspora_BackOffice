import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { LayoutService } from '@core/services/layout.service'

interface ModuleItem {
  label: string
  icon: string
  route: string
  color: string
  description: string
}

const MODULES: ModuleItem[] = [
  {
    label: 'Identité & Accès',
    icon: 'shield',
    route: '/identity/users',
    color: 'primary',
    description: 'Utilisateurs, rôles & permissions',
  },
  {
    label: 'Vérification KYC',
    icon: 'user-check',
    route: '/kyc/list',
    color: 'success',
    description: 'Dossiers & exigences KYC par pays',
  },
  {
    label: 'Profils Citoyens',
    icon: 'users',
    route: '/profiles',
    color: 'info',
    description: 'Annuaire & types de profils',
  },
  {
    label: 'Documents',
    icon: 'file-text',
    route: '/documents',
    color: 'warning',
    description: 'Validation & types de documents',
  },
  {
    label: 'Démarches',
    icon: 'clipboard-list',
    route: '/procedures',
    color: 'purple',
    description: 'Guichet consulaire & procédures',
  },
  {
    label: 'Marketplace & Colis',
    icon: 'shopping-bag',
    route: '/marketplace/listings',
    color: 'danger',
    description: 'Annonces, réservations & litiges',
  },
  {
    label: 'Freelance',
    icon: 'briefcase',
    route: '/freelance/job-postings',
    color: 'primary',
    description: 'Offres de mission & candidatures',
  },
  {
    label: 'Portefeuilles',
    icon: 'credit-card',
    route: '/wallet/all',
    color: 'success',
    description: 'Trésorerie, séquestres & transactions',
  },
  {
    label: 'Notifications',
    icon: 'bell',
    route: '/notifications',
    color: 'info',
    description: 'Modèles & campagnes broadcast',
  },
  {
    label: 'Modération Chat',
    icon: 'message-square',
    route: '/chat/moderation',
    color: 'warning',
    description: 'Salons & signalements de messages',
  },
]

@Component({
  selector: 'modules-dropdown',
  imports: [RouterLink, Icon, NgbDropdownModule],
  template: `
    <div id="modules-dropdown" class="topbar-item">
      <div #dropdown="ngbDropdown" ngbDropdown placement="bottom-end" autoClose="outside">
        <button ngbDropdownToggle class="topbar-link drop-arrow-none px-2" type="button" title="Modules administratifs">
          <app-icon icon="layout-grid" class="fs-xl" />
          <span class="d-none d-md-inline ms-1 fw-medium">Modules</span>
        </button>

        <div ngbDropdownMenu class="dropdown-menu-end p-3 shadow-lg border-0" style="width: 540px; max-width: 92vw;">
          <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
            <h6 class="m-0 fw-bold">Modules du BackOffice</h6>
            <span class="badge bg-soft-primary text-primary">{{ MODULES.length }} modules</span>
          </div>
          <div class="row g-2">
            @for (module of MODULES; track module.route) {
              <div class="col-12 col-sm-6">
                <a
                  [routerLink]="module.route"
                  (click)="dropdown.close()"
                  class="module-card-link d-flex align-items-center gap-2 p-2 border rounded text-decoration-none text-body"
                >
                  <span
                    class="avatar-sm flex-shrink-0 d-flex align-items-center justify-content-center rounded bg-soft-{{ module.color }} text-{{ module.color }}"
                  >
                    <app-icon [icon]="module.icon" class="fs-18"></app-icon>
                  </span>
                  <div class="flex-grow-1 min-w-0">
                    <span class="fw-semibold d-block text-truncate fs-sm">{{ module.label }}</span>
                    <span class="text-muted d-block text-truncate" style="font-size: 0.75rem;">
                      {{ module.description }}
                    </span>
                  </div>
                </a>
              </div>
            }
          </div>
          <div class="text-center mt-3 pt-2 border-top">
            <button type="button" class="btn btn-sm btn-outline-primary" (click)="toggleSidebar(); dropdown.close()">
              <app-icon icon="panel-left" class="me-1"></app-icon>
              Basculer le menu latéral
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .module-card-link {
      transition: all 0.15s ease-in-out;
      background-color: var(--theme-secondary-bg);
    }
    .module-card-link:hover {
      background-color: rgba(var(--theme-primary-rgb), 0.08);
      border-color: rgba(var(--theme-primary-rgb), 0.35) !important;
      transform: translateY(-1px);
    }
  `,
})
export class ModulesDropdown {
  MODULES = MODULES

  private layout = inject(LayoutService)

  toggleSidebar() {
    this.layout.toggleSidebar()
  }
}