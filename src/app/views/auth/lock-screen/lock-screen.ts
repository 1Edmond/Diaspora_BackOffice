import { currentYear, META_DATA } from '@/app/constants'
import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { UserDto } from '@core/models/auth.models'
import { AuthService } from '@core/services/auth.service'
import { ToastService } from '@core/services/toast.service'

@Component({
  selector: 'app-lock-screen',
  imports: [RouterLink, FormsModule, CommonModule, Icon],
  templateUrl: './lock-screen.html',
  styles: ``,
})
export class LockScreen implements OnInit {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author

  currentUser: UserDto | null = null
  password = ''
  error = ''
  loading = false

  private authService = inject(AuthService)
  private router = inject(Router)
  private toastService = inject(ToastService)

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()
    if (!this.currentUser?.email) {
      this.router.navigate(['/auth/sign-in'])
    }
  }

  get displayName(): string {
    if (!this.currentUser) return 'Utilisateur'
    const full = `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim()
    return full || this.currentUser.email
  }

  get initials(): string {
    if (!this.currentUser) return 'AD'
    const first = (this.currentUser.firstName || '').trim()
    const last = (this.currentUser.lastName || '').trim()
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase()
    if (first) return first.substring(0, 2).toUpperCase()
    if (this.currentUser.email) return this.currentUser.email.substring(0, 2).toUpperCase()
    return 'AD'
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.password.trim()) {
      this.error = 'Veuillez saisir votre mot de passe.'
      this.toastService.error(this.error)
      return
    }

    if (!this.currentUser?.email) {
      this.router.navigate(['/auth/sign-in'])
      return
    }

    this.error = ''
    this.loading = true

    this.authService
      .login({
        email: this.currentUser.email,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.loading = false
          this.toastService.success('Session déverrouillée avec succès.')
          sessionStorage.removeItem('diaspora_is_locked')
          const returnUrl = sessionStorage.getItem('diaspora_lock_return_url') || '/dashboard'
          sessionStorage.removeItem('diaspora_lock_return_url')
          this.router.navigateByUrl(returnUrl)
        },
        error: (err) => {
          this.loading = false
          const errMsg = err?.error?.message || err?.error?.error || 'Mot de passe incorrect ou session expirée.'
          this.error = errMsg
          this.toastService.error(errMsg)
        },
      })
  }

  logout(): void {
    sessionStorage.removeItem('diaspora_is_locked')
    sessionStorage.removeItem('diaspora_lock_return_url')
    this.authService.logout()
  }
}