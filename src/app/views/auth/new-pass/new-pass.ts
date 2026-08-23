import { PasswordStrengthBar } from '@/app/components/password-strength-bar/password-strength-bar'
import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { NgOtpInputComponent } from 'ng-otp-input'
import { AuthService } from '@core/services/auth.service'
import { VerifyEmailRequest, ResetPasswordRequest } from '@core/models/auth.models'

@Component({
  selector: 'app-new-pass',
  imports: [RouterLink, NgOtpInputComponent, PasswordStrengthBar, FormsModule],
  templateUrl: './new-pass.html',
  styles: ``,
})
export class NewPass {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author

  email = ''
  code = ''
  password = ''
  confirmPassword = ''
  error = ''
  loading = false
  codeVerified = false

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

  verifyCode(form: NgForm) {
    if (!this.code || this.code.length !== 6) {
      this.error = 'Please enter the 6-digit code';
      return;
    }

    this.error = '';
    this.loading = true;

    const request: VerifyEmailRequest = {
      email: this.email,
      code: this.code,
    };

    this.auth.verifyEmail(request).subscribe({
      next: () => {
        this.loading = false;
        this.codeVerified = true;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || err.error?.message || 'Invalid or expired code';
      }
    });
  }

  onSubmit(form: NgForm) {
    if (!this.codeVerified) {
      this.error = 'Please verify the code first';
      return;
    }
    if (form.invalid) return;

    this.error = '';
    this.loading = true;

    const request: ResetPasswordRequest = {
      email: this.email,
      code: this.code,
      newPassword: this.password,
      confirmPassword: this.confirmPassword,
    };

    this.auth.resetPassword(request).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/auth/sign-in'], { queryParams: { reset: 'success' } });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || err.error?.message || 'Failed to reset password';
      }
    });
  }

  resendCode() {
    this.error = '';
    this.loading = true;

    this.auth.resendVerificationCode({ email: this.email }).subscribe({
      next: () => {
        this.loading = false;
        // Could show success message
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || err.error?.message || 'Failed to resend code';
      }
    });
  }
}