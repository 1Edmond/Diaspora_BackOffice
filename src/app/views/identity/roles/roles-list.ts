import { Component, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { IdentityService } from '@core/services/identity/identity.service'
import { ConfirmModalService } from '@core/services/confirm-modal.service'
import { ToastService } from '@core/services/toast.service'
import { AvailableService, Role, RoleDetail } from '@core/models/identity/role.model'

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [PageBreadcrumb, RouterLink, FormsModule, Icon],
  templateUrl: './roles-list.html',
  styles: ``,
})
export class RolesList implements OnInit {
  roles: Role[] = []
  availableServices: AvailableService[] = []
  searchTerm = ''
  loading = false

  // Modal de gestion rapide des permissions
  selectedRole: RoleDetail | null = null
  selectedKeys: Set<string> = new Set()
  originalKeys: Set<string> = new Set()
  savingPermissions = false
  loadingRolePermissions = false
  modalRef: NgbModalRef | null = null

  constructor(
    private identityService: IdentityService,
    private confirmModal: ConfirmModalService,
    private modalService: NgbModal,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadRoles()
    this.loadAvailablePermissions()
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
        this.toast.error('Erreur lors du chargement des rôles.')
      },
    })
  }

  loadAvailablePermissions() {
    this.identityService.getAvailablePermissions().subscribe({
      next: (services) => {
        this.availableServices = services || []
      },
      error: () => {},
    })
  }

  isAdminRole(roleName?: string): boolean {
    const n = (roleName || '').trim().toLowerCase()
    return n === 'admin' || n === 'superadmin' || n === 'administrateur'
  }

  getAllPermissionKeys(): string[] {
    const keys: string[] = []
    for (const s of this.availableServices) {
      for (const r of s.resources || []) {
        for (const p of r.permissions || []) {
          keys.push(p.permissionKey)
        }
      }
    }
    return keys
  }

  openPermissionsModal(role: Role, content: any) {
    this.loadingRolePermissions = true
    this.selectedRole = null
    this.selectedKeys.clear()
    this.originalKeys.clear()
    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg', scrollable: true })

    this.identityService.getRole(role.id).subscribe({
      next: (detail) => {
        this.selectedRole = detail
        this.originalKeys = new Set((detail.permissions || []).map((p) => p.permissionKey))
        this.selectedKeys = new Set(this.originalKeys)
        if (this.isAdminRole(detail.name)) {
          this.getAllPermissionKeys().forEach((k) => this.selectedKeys.add(k))
        }
        this.loadingRolePermissions = false
      },
      error: () => {
        this.loadingRolePermissions = false
        this.toast.error('Impossible de charger les permissions du rôle.')
        this.modalRef?.close()
      },
    })
  }

  togglePermission(key: string) {
    if (this.selectedKeys.has(key)) {
      this.selectedKeys.delete(key)
    } else {
      this.selectedKeys.add(key)
    }
  }

  selectAllInModal() {
    this.getAllPermissionKeys().forEach((k) => this.selectedKeys.add(k))
  }

  deselectAllInModal() {
    this.selectedKeys.clear()
  }

  savePermissions() {
    if (!this.selectedRole) return
    const roleId = this.selectedRole.id
    const toAdd = Array.from(this.selectedKeys).filter((k) => !this.originalKeys.has(k))
    const toRemove = Array.from(this.originalKeys).filter((k) => !this.selectedKeys.has(k))

    if (toAdd.length === 0 && toRemove.length === 0) {
      this.toast.success('Les permissions du rôle ont été mises à jour avec succès.')
      this.modalRef?.close()
      return
    }

    this.savingPermissions = true
    const finalize = () => {
      this.savingPermissions = false
      this.toast.success('Les permissions du rôle ont été mises à jour avec succès.')
      this.modalRef?.close()
      this.loadRoles()
    }

    if (toAdd.length > 0) {
      this.identityService.assignPermissionsToRole(roleId, toAdd).subscribe({
        next: () => {
          if (toRemove.length > 0) {
            this.identityService.removePermissionsFromRole(roleId, toRemove).subscribe({
              next: () => finalize(),
              error: (err) => {
                this.savingPermissions = false
                this.toast.error(err?.error?.error || 'Erreur lors de la mise à jour des permissions.')
              },
            })
          } else {
            finalize()
          }
        },
        error: (err) => {
          this.savingPermissions = false
          this.toast.error(err?.error?.error || 'Erreur lors de l\'attribution des permissions.')
        },
      })
    } else if (toRemove.length > 0) {
      this.identityService.removePermissionsFromRole(roleId, toRemove).subscribe({
        next: () => finalize(),
        error: (err) => {
          this.savingPermissions = false
          this.toast.error(err?.error?.error || 'Erreur lors de la révocation des permissions.')
        },
      })
    }
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