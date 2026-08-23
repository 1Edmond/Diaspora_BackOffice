import { Component, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { IdentityService } from '@core/services/identity/identity.service'
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
    private identityService: IdentityService
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

  onDelete(role: Role) {
    if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      this.identityService.deleteRole(role.id).subscribe({
        next: () => this.loadRoles(),
        error: () => {},
      })
    }
  }
}