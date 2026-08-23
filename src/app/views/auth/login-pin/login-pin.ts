import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { NgOtpInputComponent } from 'ng-otp-input'
import { AuthService } from '@core/services/auth.service'
import { LoginPinRequest } from '@core/models/auth.models'

@Component({
  selector: 'app-login-pin',
  imports: [NgOtpInputComponent, RouterLink, FormsModule],
  templateUrl: './login-pin.html',
  styles: ``,
})
export class LoginPin {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
  username = META_DATA.username

  email = ''
  pin = ''
  error = ''
  loading = false

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    // Get email from session storage if available
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.email = user.email || '';
      } catch {}
    }
  }

  onOtpChange(pin: string) {
    this.pin = pin;
  }

  onSubmit(form: NgForm) {
    if (!this.pin || this.pin.length !== 6) {
      this.error = 'Please enter the 6-digit PIN';
      return;
    }

    this.error = ''
    this.loading = true

    const request: LoginPinRequest = {
      email: this.email,
      pin: this.pin,
    }

    this.auth.loginPin(request).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate([''])
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Invalid PIN'
      }
    })
  }
}