import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { NgOtpInputComponent } from 'ng-otp-input'
import { AuthService } from '@core/services/auth.service'
import { TwoFactorRequest } from '@core/models/auth.models'

@Component({
  selector: 'app-two-factor',
  imports: [RouterLink, NgOtpInputComponent, FormsModule],
  templateUrl: './two-factor.html',
  styles: ``,
})
export class TwoFactor {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author

  email = ''
  code = ''
  error = ''
  loading = false

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  onOtpChange(code: string) {
    this.code = code;
  }

  onSubmit(form: NgForm) {
    if (!this.code || this.code.length !== 6) {
      this.error = 'Please enter the 6-digit code';
      return;
    }

    this.error = ''
    this.loading = true

    const request: TwoFactorRequest = {
      email: this.email,
      code: this.code,
    }

    this.auth.twoFactor(request).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate([''])
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Invalid or expired code'
      }
    })
  }

  resendCode() {
    this.error = ''
    this.loading = true

    this.auth.resendVerificationCode({ email: this.email }).subscribe({
      next: () => {
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Failed to resend code'
      }
    })
  }
}