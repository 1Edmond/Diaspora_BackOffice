import { CommonModule } from '@angular/common'
import { Component, HostListener, OnDestroy, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NavigationFocusService } from '@core/services/navigation-focus.service'

export interface ModuleItem {
  key: string
  label: string
  icon: string
  route: string
  color: string
  description: string
}

export const MODULES: ModuleItem[] = [
  {
    key: 'identity',
    label: 'Identité & Accès',
    icon: 'shield',
    route: '/identity/users',
    color: 'primary',
    description: 'Utilisateurs, rôles & permissions',
  },
  {
    key: 'kyc',
    label: 'Vérification KYC',
    icon: 'user-check',
    route: '/kyc/list',
    color: 'success',
    description: 'Dossiers & exigences KYC par pays',
  },
  {
    key: 'profiles',
    label: 'Profils Citoyens',
    icon: 'users',
    route: '/profiles',
    color: 'info',
    description: 'Annuaire & types de profils',
  },
  {
    key: 'documents',
    label: 'Documents & Justificatifs',
    icon: 'file-text',
    route: '/documents',
    color: 'warning',
    description: 'Validation & types de documents',
  },
  {
    key: 'procedures',
    label: 'Démarches Consulaires',
    icon: 'clipboard-list',
    route: '/procedures',
    color: 'purple',
    description: 'Guichet consulaire & procédures',
  },
  {
    key: 'marketplace',
    label: 'Marketplace & Colis',
    icon: 'shopping-bag',
    route: '/marketplace/listings',
    color: 'danger',
    description: 'Annonces, réservations & litiges',
  },
  {
    key: 'freelance',
    label: 'Freelance & Missions',
    icon: 'briefcase',
    route: '/freelance/job-postings',
    color: 'teal',
    description: 'Offres de mission & candidatures',
  },
  {
    key: 'wallet',
    label: 'Portefeuilles & Trésorerie',
    icon: 'landmark',
    route: '/wallet/all',
    color: 'success',
    description: 'Trésorerie, séquestres & transactions',
  },
  {
    key: 'notifications',
    label: 'Notifications & Broadcast',
    icon: 'bell',
    route: '/notifications/templates',
    color: 'info',
    description: 'Modèles & campagnes broadcast',
  },
  {
    key: 'chat',
    label: 'Modération Chat',
    icon: 'message-square',
    route: '/chat/moderation',
    color: 'secondary',
    description: 'Salons & signalements de messages',
  },
]

@Component({
  selector: 'modules-dropdown',
  imports: [CommonModule, Icon],
  template: `
    <div id="modules-dropdown" class="topbar-item">
      <button
        class="topbar-link drop-arrow-none px-2 d-flex align-items-center border-0 bg-transparent"
        type="button"
        (click)="openOverlay()"
        title="Lanceur de modules plein écran"
      >
        <app-icon icon="layout-grid" class="fs-xl" />
        <span class="d-none d-md-inline ms-1 fw-medium">Modules</span>
        <span *ngIf="navigationFocusService.isFocused()" class="badge bg-primary rounded-pill ms-1 fs-xs">Focus</span>
      </button>

      <!-- Overlay Plein Écran (Launchpad) -->
      @if (isOpen) {
        <div class="modules-fullscreen-overlay" (click)="onBackdropClick($event)">
          <div class="modules-modal-content">
            <!-- En-tête Overlay -->
            <div class="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-light-subtle">
              <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                  <h3 class="m-0 fw-bold text-white fs-2">Modules & Applications Diaspora</h3>
                  <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 fs-sm">
                    {{ MODULES.length }} modules
                  </span>
                </div>
                <p class="text-white-50 m-0 fs-6">
                  Accédez directement aux espaces de gestion et activez le mode focus de la navigation latérale.
                </p>
              </div>

              <button
                type="button"
                class="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm overlay-close-btn"
                (click)="closeOverlay()"
                aria-label="Fermer"
              >
                <app-icon icon="x" class="fs-4"></app-icon>
              </button>
            </div>

            <!-- Grille des 10 cartes interactives -->
            <div class="row g-3 g-xl-4">
              @for (module of MODULES; track module.key) {
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <div
                    class="card h-100 border-0 shadow-sm module-launcher-card cursor-pointer position-relative"
                    [class.active-module-card]="navigationFocusService.activeModule() === module.key"
                    (click)="selectModule(module)"
                    role="button"
                    tabindex="0"
                  >
                    @if (navigationFocusService.activeModule() === module.key) {
                      <span class="position-absolute top-0 end-0 m-2 badge bg-primary">
                        Actif
                      </span>
                    }

                    <div class="card-body p-4 d-flex flex-column">
                      <div
                        class="avatar-xl rounded-4 mb-3 d-flex align-items-center justify-content-center bg-soft-{{ module.color }} text-{{ module.color }} module-icon-box"
                      >
                        <app-icon [icon]="module.icon" class="fs-1"></app-icon>
                      </div>

                      <h5 class="fw-bold mb-1 text-dark fs-5">{{ module.label }}</h5>
                      <p class="text-muted fs-sm flex-grow-1 mb-3">{{ module.description }}</p>

                      <div class="d-flex align-items-center justify-content-between pt-2 border-top border-light-subtle">
                        <span class="text-primary fw-medium fs-xs d-flex align-items-center gap-1">
                          Ouvrir en focus
                          <app-icon icon="arrow-right" class="fs-xs"></app-icon>
                        </span>
                        <span class="badge bg-soft-{{ module.color }} text-{{ module.color }}">
                          {{ module.key }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Pied du lanceur -->
            <div class="text-center mt-4 pt-3 border-top border-light-subtle d-flex align-items-center justify-content-center gap-3">
              @if (navigationFocusService.isFocused()) {
                <button type="button" class="btn btn-outline-danger btn-sm" (click)="resetFocus()">
                  <app-icon icon="x-circle" class="me-1"></app-icon>
                  Désactiver le mode focus
                </button>
              }
              <span class="text-white-50 fs-xs">
                Appuyez sur <kbd class="bg-dark text-white px-2 py-1 rounded">Échap</kbd> ou cliquez à l'extérieur pour fermer
              </span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .modules-fullscreen-overlay {
      position: fixed;
      inset: 0;
      z-index: 1050;
      background: rgba(15, 23, 42, 0.78);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      overflow-y: auto;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 2.5rem 1rem;
      animation: fadeIn 0.2s ease-out;
    }

    .modules-modal-content {
      width: 100%;
      max-width: 1200px;
      margin: auto 0;
    }

    .module-launcher-card {
      transition: all 0.2s ease-in-out;
      background: #ffffff;
      border-radius: 1rem;
    }

    .module-launcher-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25) !important;
      border-color: rgba(var(--theme-primary-rgb), 0.5) !important;
    }

    .active-module-card {
      border: 2px solid var(--bs-primary) !important;
      box-shadow: 0 0 0 4px rgba(var(--theme-primary-rgb), 0.2) !important;
    }

    .module-icon-box {
      width: 64px;
      height: 64px;
      transition: transform 0.2s ease-in-out;
    }

    .module-launcher-card:hover .module-icon-box {
      transform: scale(1.08);
    }

    .overlay-close-btn {
      width: 44px;
      height: 44px;
      transition: all 0.15s ease-in-out;
    }

    .overlay-close-btn:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
})
export class ModulesDropdown implements OnDestroy {
  MODULES = MODULES
  isOpen = false

  navigationFocusService = inject(NavigationFocusService)
  private router = inject(Router)

  openOverlay() {
    this.isOpen = true
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
    }
  }

  closeOverlay() {
    this.isOpen = false
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modules-fullscreen-overlay')) {
      this.closeOverlay()
    }
  }

  selectModule(module: ModuleItem) {
    this.navigationFocusService.focusModule(module.key)
    this.closeOverlay()
    this.router.navigateByUrl(module.route)
  }

  resetFocus() {
    this.navigationFocusService.clearFocus()
    this.closeOverlay()
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen) {
      this.closeOverlay()
    }
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  }
}