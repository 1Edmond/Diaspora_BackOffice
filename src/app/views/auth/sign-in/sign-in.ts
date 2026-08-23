import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '@core/services/auth.service'
import { LoginRequest } from '@core/models/auth.models'

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-in.html',
  styles: ``,
})
export class SignIn {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author

  email = 'admin@example.com'
  password = 'password'
  error = ''
  loading = false

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = ''
    this.loading = true

    const request: LoginRequest = {
      email: this.email,
      password: this.password,
    }

    this.auth.login(request).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate([''])
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Invalid email or password'
      }
    })
  }
}
