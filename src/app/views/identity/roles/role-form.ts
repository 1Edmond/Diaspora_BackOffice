import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { FormsModule, NgForm } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { IdentityService } from '@core/services/identity/identity.service'
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
  imports: [PageBreadcrumb, RouterLink, FormsModule],
  templateUrl: './role-form.html',
  styles: ``,
})
export class RoleForm implements OnInit {
  role: RoleDetail | null = null
  editing = false
  loading = false
  error = ''
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
    private identityService: IdentityService
  ) {}

  ngOnInit() {
    this.identityService.getAvailablePermissions().subscribe({
      next: (services: AvailableService[]) => {
        this.availableServices = services
      },
      error: () => {},
    })

    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.editing = true
      this.identityService.getRole(id).subscribe({
        next: (role: RoleDetail) => {
          this.role = role
          this.formData = {
            name: role.name,
            description: role.description || '',
          }
          this.originalKeys = new Set(role.permissions.map((p) => p.permissionKey))
          this.selectedKeys = new Set(this.originalKeys)
        },
        error: () => this.router.navigate(['/identity/roles']),
      })
    }
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
          this.error = err.error?.error || err.error?.message || 'Failed to update role'
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
              next: () => this.router.navigate(['/identity/roles', role.id]),
              error: (err: any) => {
                this.permissionKeysLoading = false
                this.loading = false
                this.error = err.error?.error || err.error?.message || 'Failed to assign permissions'
              },
            })
          } else {
            this.router.navigate(['/identity/roles', role.id])
          }
        },
        error: (err: any) => {
          this.loading = false
          this.error = err.error?.error || err.error?.message || 'Failed to create role'
        },
      })
    }
  }

  private savePermissionChanges(roleId: string) {
    const toAdd = Array.from(this.selectedKeys).filter((k) => !this.originalKeys.has(k))
    const toRemove = Array.from(this.originalKeys).filter((k) => !this.selectedKeys.has(k))

    if (toAdd.length === 0 && toRemove.length === 0) {
      this.router.navigate(['/identity/roles', roleId])
      return
    }

    this.permissionKeysLoading = true

    if (toAdd.length > 0) {
      this.identityService.assignPermissionsToRole(roleId, toAdd).subscribe({
        next: () => this.continueRemoving(roleId, toRemove),
        error: (err: any) => {
          this.permissionKeysLoading = false
          this.loading = false
          this.error = err.error?.error || err.error?.message || 'Failed to assign permissions'
        },
      })
    } else {
      this.continueRemoving(roleId, toRemove)
    }
  }

  private continueRemoving(roleId: string, toRemove: string[]) {
    if (toRemove.length === 0) {
      this.router.navigate(['/identity/roles', roleId])
      return
    }
    this.identityService.removePermissionsFromRole(roleId, toRemove).subscribe({
      next: () => this.router.navigate(['/identity/roles', roleId]),
      error: (err: any) => {
        this.permissionKeysLoading = false
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Failed to remove permissions'
      },
    })
  }
}
