import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { IdentityService } from '@core/services/identity/identity.service'
import { User, UserListResponse } from '@core/models/identity/user.model'

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, RouterLink, FormsModule, Icon],
  templateUrl: './users-list.html',
  styles: ``,
})
export class UsersList implements OnInit {
  users: any[] = []
  page = 1
  pageSize = 10
  totalCount = 0
  searchTerm = ''
  loading = false

  constructor(
    private identityService: IdentityService
  ) {}

  ngOnInit() {
    this.loadUsers()
  }

  loadUsers() {
    this.loading = true
    this.identityService.getUsers({ pageNumber: this.page, pageSize: this.pageSize, searchTerm: this.searchTerm || undefined }).subscribe({
      next: (res: UserListResponse) => {
        this.users = res.items
        this.totalCount = res.totalCount
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

  onPageChange(page: number) {
    this.page = page
    this.loadUsers()
  }

  onDelete(user: User) {
    if (confirm(`Are you sure you want to delete user ${user.email}?`)) {
      this.identityService.deleteUser(user.id).subscribe({
        next: () => this.loadUsers(),
        error: () => {},
      })
    }
  }

  onSuspend(user: User) {
    this.identityService.suspendUser(user.id, { reason: 'Suspended by admin' }).subscribe({
      next: () => this.loadUsers(),
      error: () => {},
    })
  }

  onActivate(user: User) {
    this.identityService.activateUser(user.id).subscribe({
      next: () => this.loadUsers(),
      error: () => {},
    })
  }
}