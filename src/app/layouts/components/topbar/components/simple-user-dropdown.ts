import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { UserDto } from '@core/models/auth.models'
import { AuthService } from '@core/services/auth.service'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { Subscription } from 'rxjs'

@Component({
  selector: 'simple-user-dropdown',
  imports: [Icon, RouterLink, NgbDropdownModule],
  template: `
    <div id="simple-user-dropdown" class="topbar-item nav-user">
      <div #dropdown="ngbDropdown" ngbDropdown placement="bottom-end">
        <button
          type="button"
          class="topbar-link dropdown-toggle drop-arrow-none px-2 border-0 bg-transparent d-flex align-items-center"
          ngbDropdownToggle
        >
          <span
            class="avatar-sm rounded-circle bg-soft-primary text-primary fw-bold d-flex align-items-center justify-content-center me-lg-2 flex-shrink-0"
            style="width: 34px; height: 34px; font-size: 0.85rem;"
          >
            {{ initials }}
          </span>
          <div class="d-lg-flex flex-column align-items-start d-none text-start me-1">
            <div class="d-flex align-items-center gap-1">
              <h6 class="my-0 fw-semibold text-truncate" style="max-width: 140px;">{{ displayName }}</h6>
              <span class="badge bg-soft-primary text-primary" style="font-size: 0.65rem;">{{ primaryRole }}</span>
            </div>
            @if (user?.email) {
              <small class="text-muted text-truncate" style="max-width: 160px; font-size: 0.7rem;">{{ user?.email }}</small>
            }
          </div>
          <app-icon icon="chevron-down" class="align-middle d-none d-lg-inline ms-1"></app-icon>
        </button>

        <div ngbDropdownMenu class="dropdown-menu-end shadow-lg border-0 py-2" style="min-width: 240px;">
          <!-- En-tête utilisateur -->
          <div class="px-3 py-2 border-bottom mb-1">
            <div class="d-flex align-items-center gap-2">
              <span
                class="avatar-sm rounded-circle bg-soft-primary text-primary fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
              >
                {{ initials }}
              </span>
              <div class="min-w-0 flex-grow-1">
                <h6 class="m-0 fw-bold text-truncate">{{ displayName }}</h6>
                <div class="text-muted fs-xs text-truncate">{{ user?.email || 'Session active' }}</div>
                <div class="mt-1">
                  @for (r of roles; track r) {
                    <span class="badge bg-soft-info text-info me-1" style="font-size: 0.68rem;">{{ r }}</span>
                  }
                </div>
              </div>
            </div>
          </div>

          <a routerLink="/identity/profile" ngbDropdownItem (click)="dropdown.close()" class="py-2">
            <app-icon icon="user-cog" class="me-2 fs-lg text-primary"></app-icon>
            <span>Mon Compte & Sécurité</span>
          </a>

          <a routerLink="/kyc/requirements" ngbDropdownItem (click)="dropdown.close()" class="py-2">
            <app-icon icon="sliders" class="me-2 fs-lg text-success"></app-icon>
            <span>Exigences KYC</span>
          </a>

          <a routerLink="/notifications" ngbDropdownItem (click)="dropdown.close()" class="py-2">
            <app-icon icon="bell" class="me-2 fs-lg text-info"></app-icon>
            <span>Centre de Notifications</span>
          </a>

          <div class="dropdown-divider my-1"></div>

          <button type="button" ngbDropdownItem (click)="lockScreen(); dropdown.close()" class="py-2">
            <app-icon icon="lock" class="me-2 fs-lg text-warning"></app-icon>
            <span>Verrouiller l'écran</span>
          </button>

          <button type="button" ngbDropdownItem (click)="logout(); dropdown.close()" class="py-2 fw-semibold text-danger">
            <app-icon icon="log-out" class="me-2 fs-lg text-danger"></app-icon>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class SimpleUserDropdown implements OnInit, OnDestroy {
  user: UserDto | null = null
  private sub?: Subscription

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser()
    this.sub = this.authService.currentUser$.subscribe((u) => {
      this.user = u
    })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  get displayName(): string {
    if (!this.user) return 'Administrateur'
    const full = `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim()
    if (full) return full
    return this.user.email ? this.user.email.split('@')[0] : 'Administrateur'
  }

  get initials(): string {
    if (!this.user) return 'AD'
    const first = (this.user.firstName || '').trim()
    const last = (this.user.lastName || '').trim()
    if (first && last) {
      return `${first[0]}${last[0]}`.toUpperCase()
    }
    if (first) {
      return first.substring(0, 2).toUpperCase()
    }
    if (this.user.email) {
      return this.user.email.substring(0, 2).toUpperCase()
    }
    return 'AD'
  }

  get roles(): string[] {
    if (!this.user?.role || !Array.isArray(this.user.role) || this.user.role.length === 0) {
      return ['Admin']
    }
    return this.user.role
  }

  get primaryRole(): string {
    return this.roles[0] || 'Admin'
  }

  lockScreen(): void {
    sessionStorage.setItem('diaspora_lock_return_url', this.router.url)
    sessionStorage.setItem('diaspora_is_locked', 'true')
    this.router.navigate(['/auth/lock-screen'])
  }

  logout(): void {
    this.authService.logout()
  }
}

