import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { User } from '@core/models/identity/user.model'
import { AuthService } from '@core/services/auth.service'
import { IdentityService } from '@core/services/identity/identity.service'

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [PageBreadcrumb, RouterLink, FormsModule, Icon, DatePipe],
  templateUrl: './profile-edit.html',
  styles: ``,
})
export class ProfileEdit implements OnInit {
  user: User | null = null
  permissions: string[] = []
  twoFactorEnabled = true

  loading = false
  error = ''
  success = ''

  pwdLoading = false
  pwdError = ''
  pwdSuccess = ''

  formData = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
  }

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  constructor(
    private identityService: IdentityService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initFromAuthSession()

    this.identityService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.applyUser(user)
        if (user?.id) {
          this.loadPermissions(user.id)
        }
      },
      error: () => {
        const sessionUser = this.authService.getCurrentUser()
        if (sessionUser?.id) {
          this.loadPermissions(sessionUser.id)
          this.identityService.getUser(sessionUser.id).subscribe({
            next: (u) => this.applyUser(u),
            error: () => {},
          })
        }
      },
    })
  }

  private initFromAuthSession(): void {
    const dto = this.authService.getCurrentUser()
    if (!dto) return
    this.user = {
      id: dto.id,
      email: dto.email,
      role: Array.isArray(dto.role) ? dto.role : dto.role ? [String(dto.role)] : ['Admin'],
      status: dto.status || 'Active',
      emailVerified: dto.emailVerified ?? true,
      kycLevel: dto.kycLevel || 'Advanced',
      phoneNumber: dto.phoneNumber ? { value: dto.phoneNumber, countryCode: '' } : undefined,
      firstName: dto.firstName || '',
      lastName: dto.lastName || '',
      lastLoginAt: dto.lastLoginAt || new Date().toISOString(),
      createdAt: dto.createdAt || new Date().toISOString(),
    }
    this.formData = {
      firstName: dto.firstName || '',
      lastName: dto.lastName || '',
      phoneNumber: typeof dto.phoneNumber === 'string' ? dto.phoneNumber : '',
    }
  }

  private applyUser(user: User): void {
    if (!user) return
    this.user = {
      ...this.user,
      ...user,
      role: Array.isArray(user.role) && user.role.length > 0 ? user.role : this.user?.role || ['Admin'],
    }
    const rawPhone: any = user.phoneNumber
    const phoneStr =
      typeof rawPhone === 'string' ? rawPhone : rawPhone?.value || this.formData.phoneNumber || ''

    this.formData = {
      firstName: user.firstName || this.formData.firstName || '',
      lastName: user.lastName || this.formData.lastName || '',
      phoneNumber: phoneStr,
    }
  }

  private loadPermissions(userId: string): void {
    this.identityService.getUserPermissions(userId).subscribe({
      next: (res: any) => {
        const list = res?.permissions || res?.permissionKeys || res?.data || res || []
        if (Array.isArray(list)) {
          this.permissions = list.map((p: any) => (typeof p === 'string' ? p : p.key || p.name || String(p)))
        }
      },
      error: () => {
        this.permissions = [
          'identity.users.manage',
          'identity.roles.manage',
          'kyc.verifications.review',
          'wallet.transactions.audit',
          'procedures.manage',
          'marketplace.moderate',
        ]
      },
    })
  }

  get displayName(): string {
    if (!this.user) return 'Administrateur'
    const full = `${this.formData.firstName || this.user.firstName || ''} ${this.formData.lastName || this.user.lastName || ''}`.trim()
    return full || this.user.email || 'Administrateur'
  }

  get initials(): string {
    const first = (this.formData.firstName || this.user?.firstName || '').trim()
    const last = (this.formData.lastName || this.user?.lastName || '').trim()
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase()
    if (first) return first.substring(0, 2).toUpperCase()
    if (this.user?.email) return this.user.email.substring(0, 2).toUpperCase()
    return 'AD'
  }

  get roles(): string[] {
    if (!this.user?.role || !Array.isArray(this.user.role) || this.user.role.length === 0) {
      return ['Admin']
    }
    return this.user.role
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.user?.id) return
    this.loading = true
    this.error = ''
    this.success = ''

    this.identityService
      .updateUser(this.user.id, {
        firstName: this.formData.firstName.trim(),
        lastName: this.formData.lastName.trim(),
        phoneNumber: this.formData.phoneNumber.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.loading = false
          this.success = 'Vos informations personnelles ont été mises à jour avec succès.'
          if (this.user) {
            this.user.firstName = this.formData.firstName.trim()
            this.user.lastName = this.formData.lastName.trim()
          }
          const stored = this.authService.getCurrentUser()
          if (stored) {
            const updated = {
              ...stored,
              firstName: this.formData.firstName.trim(),
              lastName: this.formData.lastName.trim(),
              phoneNumber: this.formData.phoneNumber.trim(),
            }
            sessionStorage.setItem('currentUser', JSON.stringify(updated))
          }
        },
        error: (err: any) => {
          this.loading = false
          this.error =
            err.error?.error || err.error?.message || 'Impossible de mettre à jour le profil.'
        },
      })
  }

  onChangePassword(form: NgForm): void {
    this.pwdError = ''
    this.pwdSuccess = ''

    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword) {
      this.pwdError = 'Veuillez renseigner votre mot de passe actuel et le nouveau mot de passe.'
      return
    }

    if (this.passwordForm.newPassword.length < 8) {
      this.pwdError = 'Le nouveau mot de passe doit contenir au moins 8 caractères.'
      return
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.pwdError = 'La confirmation du mot de passe ne correspond pas.'
      return
    }

    this.pwdLoading = true
    this.identityService
      .changePassword({
        currentPassword: this.passwordForm.currentPassword,
        newPassword: this.passwordForm.newPassword,
      })
      .subscribe({
        next: () => {
          this.pwdLoading = false
          this.pwdSuccess = 'Votre mot de passe a été modifié avec succès.'
          this.passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }
          form.resetForm()
        },
        error: (err: any) => {
          this.pwdLoading = false
          this.pwdError =
            err.error?.error ||
            err.error?.message ||
            'Échec du changement de mot de passe. Vérifiez votre mot de passe actuel.'
        },
      })
  }

  lockSession(): void {
    sessionStorage.setItem('diaspora_lock_return_url', this.router.url)
    sessionStorage.setItem('diaspora_is_locked', 'true')
    this.router.navigate(['/auth/lock-screen'])
  }

  logout(): void {
    this.authService.logout()
  }
}