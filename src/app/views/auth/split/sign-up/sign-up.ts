import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PasswordStrengthBar } from '@app/components/password-strength-bar/password-strength-bar'
import { AuthService } from '@core/services/auth.service'
import { RegisterRequest } from '@core/models/auth.models'

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, PasswordStrengthBar, Icon, RouterLink],
  templateUrl: './sign-up.html',
  styles: ``,
})
export class SignUp {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
  username = META_DATA.username

  fullName = ''
  email = ''
  password = ''
  error = ''
  loading = false
  agreed = false

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return

    this.error = ''
    this.loading = true

    const request: RegisterRequest = {
      email: this.email,
      password: this.password,
      role: ['User'],
      firstName: this.fullName,
      dateOfBirth: new Date().toISOString().split('T')[0],
    }

    this.auth.register(request).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate(['/auth/split/success-mail'], { queryParams: { email: this.email } })
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Registration failed. Please try again.'
      }
    })
  }
}