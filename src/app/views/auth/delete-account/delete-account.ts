import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '@core/services/auth.service'
import { DeleteAccountRequest } from '@core/models/auth.models'

@Component({
  selector: 'app-delete-account',
  imports: [RouterLink, FormsModule],
  templateUrl: './delete-account.html',
  styles: ``,
})
export class DeleteAccount {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author

  password = ''
  error = ''
  loading = false
  confirmed = false

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return

    this.error = ''
    this.loading = true

    const request: DeleteAccountRequest = {
      password: this.password,
    }

    this.auth.deleteAccount(request).subscribe({
      next: () => {
        this.loading = false
        this.auth.logout()
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || err.error?.message || 'Failed to delete account. Please try again.'
      }
    })
  }
}