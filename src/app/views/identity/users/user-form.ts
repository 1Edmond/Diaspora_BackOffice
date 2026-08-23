import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { FormsModule, NgForm } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { IdentityService } from '@core/services/identity/identity.service'
import { CreateUserRequest, UpdateUserRequest, User } from '@core/models/identity/user.model'
import { Role } from '@core/models/identity/role.model'

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [PageBreadcrumb, RouterLink, FormsModule],
  templateUrl: './user-form.html',
  styles: ``,
})
export class UserForm implements OnInit {
  user: User | null = null
  editing = false
  loading = false
  error = ''
  roles: Role[] = []

  formData = {
    email: '',
    password: '',
    role: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private identityService: IdentityService
  ) {}

  ngOnInit() {
    this.identityService.getRoles().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles
      },
      error: () => {},
    })

    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.editing = true
      this.identityService.getUser(id).subscribe({
        next: (user: User) => {
          this.user = user
          this.formData = {
            email: user.email,
            password: '',
            role: user.role[0] || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phoneNumber: user.phoneNumber ? user.phoneNumber.value : '',
            dateOfBirth: '',
          }
        },
        error: () => this.router.navigate(['/identity/users']),
      })
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return
    this.loading = true
    this.error = ''

    if (this.editing && this.user) {
      const data: UpdateUserRequest = {
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        phoneNumber: this.formData.phoneNumber,
      }
      this.identityService.updateUser(this.user.id, data).subscribe({
        next: () => this.router.navigate(['/identity/users', this.user!.id]),
        error: (err: any) => {
          this.loading = false
          this.error = err.error?.error || err.error?.message || 'Failed to update user'
        },
      })
    } else {
      const data: CreateUserRequest = {
        email: this.formData.email,
        password: this.formData.password,
        role: this.formData.role ? [this.formData.role] : [],
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        phoneNumber: this.formData.phoneNumber,
        dateOfBirth: this.formData.dateOfBirth,
      }
      this.identityService.createUser(data).subscribe({
        next: () => this.router.navigate(['/identity/users']),
        error: (err: any) => {
          this.loading = false
          this.error = err.error?.error || err.error?.message || 'Failed to create user'
        },
      })
    }
  }
}
