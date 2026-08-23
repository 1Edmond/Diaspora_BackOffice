import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { IdentityService } from '@core/services/identity/identity.service'
import { Permission } from '@core/models/identity/role.model'

@Component({
  selector: 'app-permissions-list',
  standalone: true,
  imports: [PageBreadcrumb, FormsModule, Icon],
  templateUrl: './permissions-list.html',
  styles: ``,
})
export class PermissionsList implements OnInit {
  permissions: Permission[] = []
  totalCount = 0
  searchTerm = ''
  loading = false

  constructor(
    private identityService: IdentityService
  ) {}

  ngOnInit() {
    this.loadPermissions()
  }

  get filteredPermissions(): Permission[] {
    if (!this.searchTerm) return this.permissions
    const term = this.searchTerm.toLowerCase()
    return this.permissions.filter(
      (p) =>
        p.permissionKey.toLowerCase().includes(term) ||
        (p.permission || '').toLowerCase().includes(term) ||
        (p.serviceName || '').toLowerCase().includes(term) ||
        (p.resourceName || '').toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term)
    )
  }

  loadPermissions() {
    this.loading = true
    this.identityService.getAllPermissions().subscribe({
      next: (res) => {
        this.permissions = res.permissions
        this.totalCount = res.totalCount
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }
}
