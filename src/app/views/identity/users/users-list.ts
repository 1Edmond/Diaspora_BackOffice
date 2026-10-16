import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { IdentityService } from '@core/services/identity/identity.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import { User, UserListResponse } from '@core/models/identity/user.model'

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, RouterLink, FormsModule, Icon],
  templateUrl: './users-list.html',
  styles: ``,
})
export class UsersList implements OnInit {
  users: User[] = []
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  searchTerm = ''
  selectedStatus = ''
  includeDeleted = false
  loading = false

  // Suspension modal
  showSuspendModal = false
  targetUser: User | null = null
  suspendReason = ''
  actionLoading = false

  constructor(
    private identityService: IdentityService,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadUsers()
  }

  loadUsers() {
    this.loading = true
    this.identityService.getUsers({
      pageNumber: this.page,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      status: this.selectedStatus || undefined,
      includeDeleted: this.includeDeleted || this.selectedStatus === 'Deleted'
    }).subscribe({
      next: (res: UserListResponse) => {
        this.users = res.items
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages || Math.ceil(this.totalCount / this.pageSize) || 1
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  onSearch() {
    this.page = 1
    this.loadUsers()
  }

  onStatusChange() {
    this.page = 1
    this.loadUsers()
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return
    this.page = page
    this.loadUsers()
  }

  openSuspendModal(user: User) {
    this.targetUser = user
    this.suspendReason = ''
    this.showSuspendModal = true
  }

  closeSuspendModal() {
    this.showSuspendModal = false
    this.targetUser = null
    this.suspendReason = ''
  }

  confirmSuspend() {
    if (!this.targetUser || !this.suspendReason.trim()) return
    this.actionLoading = true
    this.identityService.suspendUser(this.targetUser.id, { reason: this.suspendReason.trim() }).subscribe({
      next: () => {
        this.actionLoading = false
        this.closeSuspendModal()
        this.toast.success('Utilisateur suspendu avec succès.')
        this.loadUsers()
      },
      error: () => {
        this.actionLoading = false
        this.toast.error('Erreur lors de la suspension.')
      },
    })
  }

  async onActivate(user: User) {
    const actionLabel = user.status === 'Inactive' ? "l'activation" : "la réactivation"
    const confirmed = await this.confirmModal.confirm({
      title: user.status === 'Inactive' ? 'Activer le compte' : 'Réactiver le compte',
      message: `Confirmez-vous ${actionLabel} du compte ${user.email} ?`,
      confirmText: 'Confirmer',
      variant: 'success'
    })
    if (!confirmed) return
    this.identityService.activateUser(user.id).subscribe({
      next: () => {
        this.toast.success('Compte activé avec succès.')
        this.loadUsers()
      },
      error: () => this.toast.error('Erreur lors de l\'activation.'),
    })
  }

  async onDelete(user: User) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer le compte',
      message: `Confirmez-vous la suppression (soft-delete) du compte ${user.email} ?`,
      confirmText: 'Supprimer',
      variant: 'danger'
    })
    if (!confirmed) return
    this.identityService.deleteUser(user.id).subscribe({
      next: () => {
        this.toast.success('Compte archivé avec succès.')
        this.loadUsers()
      },
      error: () => this.toast.error('Erreur lors de la suppression.'),
    })
  }

  async onRestore(user: User) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Restaurer le compte',
      message: `Confirmez-vous la restauration du compte ${user.email} ?`,
      confirmText: 'Restaurer',
      variant: 'warning'
    })
    if (!confirmed) return
    this.identityService.restoreUser(user.id).subscribe({
      next: () => {
        this.toast.success('Compte restauré avec succès.')
        this.loadUsers()
      },
      error: () => this.toast.error('Erreur lors de la restauration.'),
    })
  }
}
