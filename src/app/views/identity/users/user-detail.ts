import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { IdentityService } from '@core/services/identity/identity.service'
import { RefreshToken, User } from '@core/models/identity/user.model'

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, FormsModule, RouterLink],
  templateUrl: './user-detail.html',
  styles: ``,
})
export class UserDetail implements OnInit {
  user: User | null = null
  loading = true
  actionLoading = false
  refreshTokens: RefreshToken[] = []
  loadingTokens = false
  activeTab: 'overview' | 'security' = 'overview'

  successMessage = ''
  errorMessage = ''

  // Suspend modal state
  showSuspendModal = false
  suspendReason = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private identityService: IdentityService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!
    this.loadUser(id)
  }

  loadUser(id: string) {
    this.loading = true
    this.identityService.getUser(id).subscribe({
      next: (user: User) => {
        this.user = user
        this.loading = false
        this.loadTokens(id)
      },
      error: () => {
        this.loading = false
        this.router.navigate(['/identity/users'])
      },
    })
  }

  loadTokens(userId: string) {
    this.loadingTokens = true
    this.identityService.getRefreshTokens(userId).subscribe({
      next: (tokens) => {
        this.refreshTokens = tokens || []
        this.loadingTokens = false
      },
      error: () => {
        this.loadingTokens = false
      },
    })
  }

  openSuspendModal() {
    this.suspendReason = ''
    this.showSuspendModal = true
  }

  closeSuspendModal() {
    this.showSuspendModal = false
    this.suspendReason = ''
  }

  confirmSuspend() {
    if (!this.user || !this.suspendReason.trim()) return
    this.actionLoading = true
    this.identityService.suspendUser(this.user.id, { reason: this.suspendReason.trim() }).subscribe({
      next: () => {
        this.actionLoading = false
        this.closeSuspendModal()
        this.showMessage('success', 'Utilisateur suspendu avec succès.')
        this.loadUser(this.user!.id)
      },
      error: (err) => {
        this.actionLoading = false
        this.showMessage('error', err?.error?.message || 'Erreur lors de la suspension de l\'utilisateur.')
      },
    })
  }

  confirmActivate() {
    if (!this.user) return
    if (!confirm(`Confirmez-vous la réactivation du compte de ${this.user.email} ?`)) return

    this.actionLoading = true
    this.identityService.activateUser(this.user.id).subscribe({
      next: () => {
        this.actionLoading = false
        this.showMessage('success', 'Compte réactivé avec succès.')
        this.loadUser(this.user!.id)
      },
      error: (err) => {
        this.actionLoading = false
        this.showMessage('error', err?.error?.message || 'Erreur lors de la réactivation.')
      },
    })
  }

  confirmRevokeAllTokens() {
    if (!this.user) return
    if (!confirm(`Voulez-vous révoquer immédiatement toutes les sessions actives pour ${this.user.email} ?`)) return

    this.actionLoading = true
    this.identityService.revokeAllTokens(this.user.id).subscribe({
      next: () => {
        this.actionLoading = false
        this.showMessage('success', 'Toutes les sessions et jetons ont été révoqués.')
        this.loadTokens(this.user!.id)
      },
      error: (err) => {
        this.actionLoading = false
        this.showMessage('error', err?.error?.message || 'Erreur lors de la révocation des jetons.')
      },
    })
  }

  confirmDelete() {
    if (!this.user) return
    if (!confirm(`ATTENTION : Êtes-vous sûr de vouloir supprimer (soft-delete) le compte ${this.user.email} ?`)) return

    this.actionLoading = true
    this.identityService.deleteUser(this.user.id).subscribe({
      next: () => {
        this.actionLoading = false
        this.showMessage('success', 'Compte supprimé avec succès.')
        this.loadUser(this.user!.id)
      },
      error: (err) => {
        this.actionLoading = false
        this.showMessage('error', err?.error?.message || 'Erreur lors de la suppression.')
      },
    })
  }

  confirmRestore() {
    if (!this.user) return
    if (!confirm(`Confirmez-vous la restauration du compte supprimé ${this.user.email} ?`)) return

    this.actionLoading = true
    this.identityService.restoreUser(this.user.id).subscribe({
      next: () => {
        this.actionLoading = false
        this.showMessage('success', 'Compte restauré avec succès.')
        this.loadUser(this.user!.id)
      },
      error: (err) => {
        this.actionLoading = false
        this.showMessage('error', err?.error?.message || 'Erreur lors de la restauration.')
      },
    })
  }

  private showMessage(type: 'success' | 'error', msg: string) {
    if (type === 'success') {
      this.successMessage = msg
      setTimeout(() => (this.successMessage = ''), 5000)
    } else {
      this.errorMessage = msg
      setTimeout(() => (this.errorMessage = ''), 6000)
    }
  }
}
