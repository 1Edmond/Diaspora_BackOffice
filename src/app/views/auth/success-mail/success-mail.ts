import { currentYear, META_DATA } from '@/app/constants'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { AuthService } from '@core/services/auth.service'

@Component({
  selector: 'app-success-mail',
  imports: [RouterLink],
  templateUrl: './success-mail.html',
  styles: ``,
})
export class SuccessMail implements OnInit {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author

  email = ''
  action = ''
  message = ''
  loading = false

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || ''
      this.action = params['action'] || 'verify'

      if (this.action === 'reset') {
        this.message = `We've sent a password reset link to ${this.email}. Please check your inbox.`
      } else {
        this.message = `We've sent a verification code to ${this.email}. Please check your inbox.`
      }
    });
  }

  resendEmail() {
    if (!this.email) return

    this.loading = true
    this.auth.resendVerificationCode({ email: this.email }).subscribe({
      next: () => {
        this.loading = false
        this.message = `We've resent the verification code to ${this.email}. Please check your inbox.`
      },
      error: () => {
        this.loading = false
        this.message = 'Failed to resend email. Please try again later.'
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['']);
  }
}