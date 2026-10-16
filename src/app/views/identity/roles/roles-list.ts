import { Component, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { IdentityService } from '@core/services/identity/identity.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import { Role } from '@core/models/identity/role.model'

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [PageBreadcrumb, RouterLink, FormsModule, Icon],
  templateUrl: './roles-list.html',
  styles: ``,
})
export class RolesList implements OnInit {
  roles: Role[] = []
  searchTerm = ''
  loading = false

  constructor(
    private identityService: IdentityService,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadRoles()
  }

  loadRoles() {
    this.loading = true
    this.identityService.getRoles().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  async onDelete(role: Role) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer le rôle',
      message: `Êtes-vous sûr de vouloir supprimer le rôle "${role.name}" ?`,
      confirmText: 'Supprimer',
      variant: 'danger'
    })
    if (!confirmed) return
    this.identityService.deleteRole(role.id).subscribe({
      next: () => {
        this.toast.success('Rôle supprimé avec succès.')
        this.loadRoles()
      },
      error: () => this.toast.error('Erreur lors de la suppression du rôle.'),
    })
  }
}