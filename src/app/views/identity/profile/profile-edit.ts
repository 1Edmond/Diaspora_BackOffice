import { Component, OnInit } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { IdentityService } from '@core/services/identity/identity.service'
import { User } from '@core/models/identity/user.model'

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [PageBreadcrumb, RouterLink, FormsModule],
  templateUrl: './profile-edit.html',
  styles: ``,
})
export class ProfileEdit implements OnInit {
  user: User | null = null
  loading = false
  error = ''
  success = ''

  formData = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
  }

  constructor(
    private identityService: IdentityService
  ) {}

  ngOnInit() {
    this.identityService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.user = user
        this.formData = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phoneNumber: user.phoneNumber ? user.phoneNumber.value : '',
        }
      },
      error: () => {},
    })
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return
    this.loading = true
    this.error = ''
    this.success = ''

    this.identityService.updateUser(this.user!.id, {
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      phoneNumber: this.formData.phoneNumber,
    }).subscribe({
      next: () => {
        this.loading = false
        this.success = 'Profile updated successfully'
      },
      error: (err: any) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Failed to update profile'
      },
    })
  }
}