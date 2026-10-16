import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { IdentityService } from '@core/services/identity/identity.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import { RefreshToken, User } from '@core/models/identity/user.model'

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, FormsModule, RouterLink, Icon],
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
    private identityService: IdentityService,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
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

  async confirmActivate() {
    if (!this.user) return
    const actionLabel = this.user.status === 'Inactive' ? "l'activation" : "la réactivation"
    const confirmed = await this.confirmModal.confirm({
      title: this.user.status === 'Inactive' ? 'Activer le compte' : 'Réactiver le compte',
      message: `Confirmez-vous ${actionLabel} du compte de ${this.user.email} ?`,
      confirmText: 'Confirmer',
      variant: 'success'
    })
    if (!confirmed) return

    this.actionLoading = true
    this.identityService.activateUser(this.user.id).subscribe({
      next: () => {
        this.actionLoading = false
        this.showMessage('success', 'Compte activé avec succès.')
        this.loadUser(this.user!.id)
      },
      error: (err) => {
        this.actionLoading = false
        this.showMessage('error', err?.error?.message || 'Erreur lors de l\'activation.')
      },
    })
  }

  async confirmRevokeAllTokens() {
    if (!this.user) return
    const confirmed = await this.confirmModal.confirm({
      title: 'Révoquer toutes les sessions',
      message: `Voulez-vous révoquer immédiatement toutes les sessions actives pour ${this.user.email} ?`,
      confirmText: 'Révoquer',
      variant: 'warning'
    })
    if (!confirmed) return

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

  async confirmDelete() {
    if (!this.user) return
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer le compte',
      message: `ATTENTION : Êtes-vous sûr de vouloir supprimer (soft-delete) le compte ${this.user.email} ?`,
      confirmText: 'Supprimer',
      variant: 'danger'
    })
    if (!confirmed) return

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

  async confirmRestore() {
    if (!this.user) return
    const confirmed = await this.confirmModal.confirm({
      title: 'Restaurer le compte',
      message: `Confirmez-vous la restauration du compte supprimé ${this.user.email} ?`,
      confirmText: 'Restaurer',
      variant: 'warning'
    })
    if (!confirmed) return

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
      this.toast.success(msg)
      setTimeout(() => (this.successMessage = ''), 5000)
    } else {
      this.errorMessage = msg
      this.toast.error(msg)
      setTimeout(() => (this.errorMessage = ''), 6000)
    }
  }
}
