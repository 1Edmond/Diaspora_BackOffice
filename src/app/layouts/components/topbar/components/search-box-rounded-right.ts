import { Component, ElementRef, HostListener } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { Icon } from '@app/components/icon/icon'

interface QuickNavItem {
  label: string
  category: string
  route: string
  icon: string
  color: string
  keywords: string[]
}

const QUICK_NAV_ITEMS: QuickNavItem[] = [
  {
    label: 'Tableau de bord général',
    category: 'Accueil',
    route: '/dashboard/ecommerce',
    icon: 'layout-dashboard',
    color: 'primary',
    keywords: ['dashboard', 'accueil', 'statistiques', 'kpi', 'ecommerce'],
  },
  {
    label: 'Tableau de bord Identité',
    category: 'Identité & Accès',
    route: '/dashboard/identity',
    icon: 'bar-chart-3',
    color: 'primary',
    keywords: ['dashboard', 'identité', 'stats', 'utilisateurs'],
  },
  {
    label: 'Utilisateurs',
    category: 'Identité & Accès',
    route: '/identity/users',
    icon: 'users',
    color: 'primary',
    keywords: ['users', 'utilisateurs', 'comptes', 'admin', 'identité'],
  },
  {
    label: 'Rôles',
    category: 'Identité & Accès',
    route: '/identity/roles',
    icon: 'shield',
    color: 'primary',
    keywords: ['roles', 'rôles', 'droits', 'accès'],
  },
  {
    label: 'Permissions',
    category: 'Identité & Accès',
    route: '/identity/permissions',
    icon: 'key',
    color: 'primary',
    keywords: ['permissions', 'habilitations', 'sécurité', 'rbac'],
  },
  {
    label: 'Mon Compte & Sécurité',
    category: 'Identité & Accès',
    route: '/identity/profile',
    icon: 'user-cog',
    color: 'primary',
    keywords: ['mon compte', 'profil', 'mot de passe', 'sécurité', 'session'],
  },
  {
    label: 'Dossiers KYC',
    category: 'Vérification KYC',
    route: '/kyc/list',
    icon: 'user-check',
    color: 'success',
    keywords: ['kyc', 'vérification', 'dossiers', 'identité', 'conformité'],
  },
  {
    label: 'Exigences KYC par pays',
    category: 'Vérification KYC',
    route: '/kyc/requirements',
    icon: 'sliders',
    color: 'success',
    keywords: ['kyc', 'exigences', 'pays', 'requirements', 'niveaux'],
  },
  {
    label: 'Profils Citoyens',
    category: 'Profils',
    route: '/profiles',
    icon: 'users',
    color: 'info',
    keywords: ['profils', 'citoyens', 'diaspora', 'annuaire', 'profiles'],
  },
  {
    label: 'Profils en attente',
    category: 'Profils',
    route: '/profiles/pending',
    icon: 'clock',
    color: 'info',
    keywords: ['profils', 'attente', 'pending', 'validation'],
  },
  {
    label: 'Types de Profils',
    category: 'Profils',
    route: '/profiles/types',
    icon: 'globe',
    color: 'info',
    keywords: ['types de profils', 'catégories', 'statuts', 'profile types'],
  },
  {
    label: 'Documents',
    category: 'Documents',
    route: '/documents',
    icon: 'file-text',
    color: 'warning',
    keywords: ['documents', 'pièces', 'justificatifs', 'passeport', 'fichiers'],
  },
  {
    label: 'Types de Documents',
    category: 'Documents',
    route: '/documents/types',
    icon: 'folder',
    color: 'warning',
    keywords: ['types de documents', 'modèles', 'catégories', 'document types'],
  },
  {
    label: 'Démarches Consulaires',
    category: 'Démarches',
    route: '/procedures',
    icon: 'clipboard-list',
    color: 'purple',
    keywords: ['démarches', 'procédures', 'consulat', 'administratif', 'procedures'],
  },
  {
    label: 'Suivi des Démarches',
    category: 'Démarches',
    route: '/procedures/user-procedures',
    icon: 'trending-up',
    color: 'purple',
    keywords: ['suivi', 'dossiers', 'avancement', 'user procedures', 'démarches'],
  },
  {
    label: 'Lieux & Juridictions',
    category: 'Démarches',
    route: '/procedures/locations',
    icon: 'map-pin',
    color: 'purple',
    keywords: ['lieux', 'pays', 'villes', 'ambassades', 'consulats', 'locations'],
  },
  {
    label: 'Annonces Marketplace',
    category: 'Marketplace & Colis',
    route: '/marketplace/listings',
    icon: 'shopping-bag',
    color: 'danger',
    keywords: ['marketplace', 'annonces', 'colis', 'transport', 'listings', 'offres'],
  },
  {
    label: 'Annonces en attente',
    category: 'Marketplace & Colis',
    route: '/marketplace/pending',
    icon: 'clock',
    color: 'danger',
    keywords: ['marketplace', 'modération', 'attente', 'pending'],
  },
  {
    label: 'Demandes de Services',
    category: 'Marketplace & Colis',
    route: '/marketplace/requests',
    icon: 'message-square',
    color: 'danger',
    keywords: ['demandes', 'services', 'requests', 'marketplace', 'devis'],
  },
  {
    label: 'Litiges Marketplace',
    category: 'Marketplace & Colis',
    route: '/marketplace/disputes',
    icon: 'alert-triangle',
    color: 'danger',
    keywords: ['litiges', 'disputes', 'arbitrage', 'remboursement', 'conflits'],
  },
  {
    label: 'Signalements Marketplace',
    category: 'Marketplace & Colis',
    route: '/marketplace/reports',
    icon: 'flag',
    color: 'danger',
    keywords: ['signalements', 'reports', 'abus', 'fraude'],
  },
  {
    label: 'Offres Freelance',
    category: 'Freelance',
    route: '/freelance/job-postings',
    icon: 'briefcase',
    color: 'primary',
    keywords: ['freelance', 'missions', 'offres', 'emploi', 'job postings'],
  },
  {
    label: 'Missions & Contrats Freelance',
    category: 'Freelance',
    route: '/freelance/job-contracts',
    icon: 'clock',
    color: 'primary',
    keywords: ['contrats', 'pointages', 'check-ins', 'freelance', 'missions'],
  },
  {
    label: 'Portefeuilles',
    category: 'Portefeuilles',
    route: '/wallet/all',
    icon: 'credit-card',
    color: 'success',
    keywords: ['portefeuilles', 'wallets', 'soldes', 'trésorerie', 'séquestre'],
  },
  {
    label: 'Transactions',
    category: 'Portefeuilles',
    route: '/wallet/transactions',
    icon: 'arrow-left-right',
    color: 'success',
    keywords: ['transactions', 'paiements', 'virements', 'retraits', 'dépôts'],
  },
  {
    label: 'Paramètres Portefeuille',
    category: 'Portefeuilles',
    route: '/wallet/parameters',
    icon: 'settings',
    color: 'success',
    keywords: ['paramètres', 'frais', 'commissions', 'limites', 'wallet'],
  },
  {
    label: 'Centre de Notifications',
    category: 'Notifications',
    route: '/notifications',
    icon: 'bell',
    color: 'info',
    keywords: ['notifications', 'alertes', 'messages', 'journal'],
  },
  {
    label: 'Règles & Modèles de Notifications',
    category: 'Notifications',
    route: '/notifications/preferences',
    icon: 'settings',
    color: 'info',
    keywords: ['modèles', 'templates', 'règles', 'canaux', 'préférences'],
  },
  {
    label: 'Campagnes Broadcast',
    category: 'Notifications',
    route: '/notifications/broadcast',
    icon: 'send',
    color: 'info',
    keywords: ['campagnes', 'broadcast', 'diffusion', 'push', 'email'],
  },
  {
    label: 'Modération Chat',
    category: 'Chat & Modération',
    route: '/chat/moderation',
    icon: 'message-square',
    color: 'warning',
    keywords: ['chat', 'modération', 'messages', 'salons', 'signalements'],
  },
]

@Component({
  selector: 'search-box-rounded-right',
  imports: [Icon, FormsModule],
  template: `
    <div id="search-box-rounded-right" class="app-search position-relative">
      <input
        type="search"
        class="form-control rounded-pill topbar-search"
        name="search"
        placeholder="Rechercher un module (ex: KYC, Litiges...)"
        autocomplete="off"
        [(ngModel)]="query"
        (focus)="isOpen = true"
        (input)="isOpen = true"
        (keydown.enter)="onEnter($event)"
        (keydown.escape)="isOpen = false"
      />
      <app-icon icon="search" class="app-search-icon text-muted"></app-icon>

      @if (isOpen && query.trim().length > 0) {
        <div
          class="dropdown-menu show shadow-lg border-0 p-2 mt-1"
          style="width: 340px; max-height: 380px; overflow-y: auto; z-index: 1055; left: 0;"
        >
          <div class="px-2 py-1 text-muted fw-semibold" style="font-size: 0.72rem; text-transform: uppercase;">
            Navigation rapide ({{ filteredItems.length }})
          </div>
          @if (filteredItems.length === 0) {
            <div class="p-3 text-center text-muted fs-sm">
              Aucun module trouvé pour « {{ query }} »
            </div>
          } @else {
            @for (item of filteredItems; track item.route; let idx = $index) {
              <button
                type="button"
                class="dropdown-item rounded d-flex align-items-center gap-2 py-2 px-2 text-start"
                [class.bg-light-subtle]="idx === 0"
                (click)="navigateTo(item)"
              >
                <span
                  class="avatar-xs rounded bg-soft-{{ item.color }} text-{{ item.color }} d-flex align-items-center justify-content-center flex-shrink-0"
                >
                  <app-icon [icon]="item.icon" class="fs-14"></app-icon>
                </span>
                <div class="flex-grow-1 min-w-0">
                  <div class="fw-semibold text-body text-truncate fs-sm">{{ item.label }}</div>
                  <div class="text-muted text-truncate" style="font-size: 0.72rem;">{{ item.category }}</div>
                </div>
                <app-icon icon="chevron-right" class="text-muted fs-xs"></app-icon>
              </button>
            }
          }
        </div>
      }
    </div>
  `,
  styles: ``,
})
export class SearchBoxRoundedRight {
  query = ''
  isOpen = false

  constructor(
    private router: Router,
    private elRef: ElementRef
  ) {}

  get filteredItems(): QuickNavItem[] {
    const q = this.query.trim().toLowerCase()
    if (!q) return []
    return QUICK_NAV_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.route.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
    ).slice(0, 8)
  }

  navigateTo(item: QuickNavItem): void {
    this.isOpen = false
    this.query = ''
    this.router.navigateByUrl(item.route)
  }

  onEnter(event: Event): void {
    event.preventDefault()
    const results = this.filteredItems
    if (results.length > 0) {
      this.navigateTo(results[0])
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false
    }
  }
}

