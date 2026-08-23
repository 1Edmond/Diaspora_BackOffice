import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '@core/services/auth.service'
import { LoginPinRequest } from '@core/models/auth.models'

@Component({
  selector: 'app-lock-screen',
  imports: [RouterLink, FormsModule],
  templateUrl: './lock-screen.html',
  styles: ``,
})
export class LockScreen {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
  username = META_DATA.username

  password = ''
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

    // Use the loginPin endpoint with the stored email and pin/password
    const user = this.auth.getCurrentUser()
    const email = user?.email || ''

    const request: LoginPinRequest = {
      email: email,
      pin: this.password,
    }

    this.auth.loginPin(request).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate([''])
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Invalid password'
      }
    })
  }

  logout() {
    this.auth.logout()
  }
}