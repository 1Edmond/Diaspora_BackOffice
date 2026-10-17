import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { FormsModule, NgForm } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { IdentityService } from '@core/services/identity/identity.service'
import { ToastService } from '@core/services/toast.service'
import {
  AvailableService,
  CreateRoleRequest,
  RoleDetail,
  RoleCreatedResponse,
  UpdateRoleRequest,
} from '@core/models/identity/role.model'

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [PageBreadcrumb, RouterLink, FormsModule, Icon],
  templateUrl: './role-form.html',
  styles: ``,
})
export class RoleForm implements OnInit {
  role: RoleDetail | null = null
  editing = false
  loading = false
  error = ''
  success = ''
  availableServices: AvailableService[] = []
  selectedKeys: Set<string> = new Set()
  originalKeys: Set<string> = new Set()
  permissionKeysLoading = false

  formData = {
    name: '',
    description: '',
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private identityService: IdentityService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.editing = true
    }

    this.identityService.getAvailablePermissions().subscribe({
      next: (services: AvailableService[]) => {
        this.availableServices = services
        this.syncAdminPermissionsIfNeeded()
      },
      error: () => {
        this.toast.error('Erreur lors du chargement de la liste des permissions disponibles.')
      },
    })

    if (id) {
      this.loadRole(id)
    }
  }

  loadRole(id: string) {
    this.identityService.getRole(id).subscribe({
      next: (role: RoleDetail) => {
        this.role = role
        this.formData = {
          name: role.name,
          description: role.description || '',
        }
        this.originalKeys = new Set(role.permissions.map((p) => p.permissionKey))
        this.selectedKeys = new Set(this.originalKeys)
        this.syncAdminPermissionsIfNeeded()
      },
      error: () => {
        this.toast.error('Impossible de charger les détails du rôle.')
        this.router.navigate(['/identity/roles'])
      },
    })
  }

  isAdminRole(name?: string): boolean {
    const n = (name || this.formData.name || '').trim().toLowerCase()
    return n === 'admin' || n === 'superadmin' || n === 'administrateur'
  }

  getAllAvailablePermissionKeys(): string[] {
    const keys: string[] = []
    for (const srv of this.availableServices) {
      for (const res of srv.resources || []) {
        for (const perm of res.permissions || []) {
          keys.push(perm.permissionKey)
        }
      }
    }
    return keys
  }

  private syncAdminPermissionsIfNeeded() {
    if (this.role && this.isAdminRole(this.role.name) && this.availableServices.length > 0) {
      const allKeys = this.getAllAvailablePermissionKeys()
      allKeys.forEach((k) => this.selectedKeys.add(k))
    }
  }

  selectAllPermissions() {
    const allKeys = this.getAllAvailablePermissionKeys()
    allKeys.forEach((k) => this.selectedKeys.add(k))
  }

  deselectAllPermissions() {
    this.selectedKeys.clear()
  }

  isSelected(permissionKey: string): boolean {
    return this.selectedKeys.has(permissionKey)
  }

  togglePermission(permissionKey: string) {
    if (this.selectedKeys.has(permissionKey)) {
      this.selectedKeys.delete(permissionKey)
    } else {
      this.selectedKeys.add(permissionKey)
    }
  }

  isDirtyPermission(permissionKey: string): boolean {
    return this.originalKeys.has(permissionKey) !== this.selectedKeys.has(permissionKey)
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return
    this.loading = true
    this.error = ''
    this.success = ''

    if (this.editing && this.role) {
      const data: UpdateRoleRequest = {
        name: this.formData.name,
        description: this.formData.description,
      }
      this.identityService.updateRole(this.role.id, data).subscribe({
        next: () => {
          this.savePermissionChanges(this.role!.id)
        },
        error: (err: any) => {
          this.loading = false
          this.error = err.error?.error || err.error?.message || 'Erreur lors de la mise à jour du rôle.'
          this.toast.error(this.error)
        },
      })
    } else {
      const data: CreateRoleRequest = {
        name: this.formData.name,
        description: this.formData.description,
      }
      this.identityService.createRole(data).subscribe({
        next: (role: RoleCreatedResponse) => {
          this.permissionKeysLoading = true
          if (this.selectedKeys.size > 0) {
            this.identityService.assignPermissionsToRole(role.id, Array.from(this.selectedKeys)).subscribe({
              next: () => {
                this.permissionKeysLoading = false
                this.loading = false
                this.toast.success('Rôle créé et permissions attribuées avec succès.')
                this.router.navigate(['/identity/roles', role.id])
              },
              error: (err: any) => {
                this.permissionKeysLoading = false
                this.loading = false
                this.error = err.error?.error || err.error?.message || 'Erreur lors de l\'attribution des permissions.'
                this.toast.error(this.error)
              },
            })
          } else {
            this.permissionKeysLoading = false
            this.loading = false
            this.toast.success('Rôle créé avec succès.')
            this.router.navigate(['/identity/roles', role.id])
          }
        },
        error: (err: any) => {
          this.loading = false
          this.error = err.error?.error || err.error?.message || 'Erreur lors de la création du rôle.'
          this.toast.error(this.error)
        },
      })
    }
  }

  private savePermissionChanges(roleId: string) {
    const toAdd = Array.from(this.selectedKeys).filter((k) => !this.originalKeys.has(k))
    const toRemove = Array.from(this.originalKeys).filter((k) => !this.selectedKeys.has(k))

    if (toAdd.length === 0 && toRemove.length === 0) {
      this.loading = false
      this.success = 'Les permissions du rôle ont été mises à jour avec succès.'
      this.toast.success('Les permissions du rôle ont été mises à jour avec succès.')
      this.loadRole(roleId)
      return
    }

    this.permissionKeysLoading = true

    if (toAdd.length > 0) {
      this.identityService.assignPermissionsToRole(roleId, toAdd).subscribe({
        next: () => this.continueRemoving(roleId, toRemove),
        error: (err: any) => {
          this.permissionKeysLoading = false
          this.loading = false
          this.error = err.error?.error || err.error?.message || 'Erreur lors de la mise à jour des permissions.'
          this.toast.error(this.error)
        },
      })
    } else {
      this.continueRemoving(roleId, toRemove)
    }
  }

  private continueRemoving(roleId: string, toRemove: string[]) {
    if (toRemove.length === 0) {
      this.permissionKeysLoading = false
      this.loading = false
      this.originalKeys = new Set(this.selectedKeys)
      this.success = 'Les permissions du rôle ont été mises à jour avec succès.'
      this.toast.success('Les permissions du rôle ont été mises à jour avec succès.')
      this.loadRole(roleId)
      return
    }
    this.identityService.removePermissionsFromRole(roleId, toRemove).subscribe({
      next: () => {
        this.permissionKeysLoading = false
        this.loading = false
        this.originalKeys = new Set(this.selectedKeys)
        this.success = 'Les permissions du rôle ont été mises à jour avec succès.'
        this.toast.success('Les permissions du rôle ont été mises à jour avec succès.')
        this.loadRole(roleId)
      },
      error: (err: any) => {
        this.permissionKeysLoading = false
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Erreur lors de la suppression des permissions.'
        this.toast.error(this.error)
      },
    })
  }
}
