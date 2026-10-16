import { currentYear, META_DATA } from '@/app/constants'
import { Component, OnInit } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { UserDto } from '@core/models/auth.models'
import { AuthService } from '@core/services/auth.service'

@Component({
  selector: 'app-lock-screen',
  imports: [RouterLink, FormsModule, Icon],
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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
          sessionStorage.removeItem('diaspora_is_locked')
          const returnUrl = sessionStorage.getItem('diaspora_lock_return_url') || '/dashboard'
          sessionStorage.removeItem('diaspora_lock_return_url')
          this.router.navigateByUrl(returnUrl)
        },
        error: () => {
          this.loading = false
          this.error = 'Mot de passe incorrect.'
        },
      })
  }

  logout(): void {
    sessionStorage.removeItem('diaspora_is_locked')
    sessionStorage.removeItem('diaspora_lock_return_url')
    this.authService.logout()
  }
}