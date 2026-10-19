import { currentYear, META_DATA } from '@/app/constants'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { LoginRequest } from '@core/models/auth.models'
import { AuthService } from '@core/services/auth.service'
import { ToastService } from '@core/services/toast.service'

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, FormsModule, CommonModule, Icon],
  templateUrl: './sign-in.html',
  styles: ``,
})
export class SignIn {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author

  email = ''
  password = ''
  rememberMe = true
  error = ''
  loading = false

  private auth = inject(AuthService)
  private router = inject(Router)
  private toastService = inject(ToastService)

  onSubmit(signInForm?: NgForm) {
    if (signInForm && signInForm.invalid) {
      this.error = 'Veuillez remplir correctement tous les champs obligatoires.'
      return
    }

    this.error = ''
    this.loading = true

    const request: LoginRequest = {
      email: this.email,
      password: this.password,
    }

    this.auth.login(request).subscribe({
      next: () => {
        this.loading = false
        this.toastService.success('Connexion réussie. Bienvenue sur Diaspora !')
        this.router.navigate([''])
      },
      error: (err) => {
        this.loading = false
        const errorMessage = err.error?.error || err.error?.message || 'Identifiants incorrects ou compte inactif.'
        this.error = errorMessage
        this.toastService.error('Identifiants incorrects ou compte inactif.')
      },
    })
  }
}
