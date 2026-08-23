import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { AuthService } from '@core/services/auth.service'

@Component({
  selector: 'app-reset-pass',
  imports: [FormsModule, RouterLink, Icon],
  templateUrl: './reset-pass.html',
  styles: ``,
})
export class ResetPass {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author

  email = ''
  error = ''
  loading = false

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return

    this.error = ''
    this.loading = true

    this.auth.forgotPassword({ email: this.email }).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate(['/auth/split/success-mail'], { queryParams: { email: this.email, action: 'reset' } })
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Failed to send reset email. Please try again.'
      }
    })
  }
}