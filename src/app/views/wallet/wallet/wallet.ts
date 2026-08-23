import { Component, OnInit, effect } from '@angular/core'
import { DatePipe, CurrencyPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { WalletService } from '@core/services/wallet.service'
import { ProfileStateService } from '@core/services/profile-state.service'
import { WalletDto } from '@core/models/wallet/wallet.model'
import { ProfileDropdown } from '@shared/components/profile-dropdown/profile-dropdown'

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, CurrencyPipe, RouterLink, FormsModule, ProfileDropdown],
  templateUrl: './wallet.html',
  styles: ``,
})
export class WalletComponent implements OnInit {
  wallet: WalletDto | null = null
  loading = true
  error = ''
  success = ''

  depositAmount = 0
  depositNotes = ''

  constructor(
    private walletService: WalletService,
    public profileState: ProfileStateService
  ) {}

  ngOnInit() {
    if (this.profileState.selectedProfileId()) {
      this.loadWallet()
    }
    effect(() => {
      const pid = this.profileState.selectedProfileId()
      if (pid) {
        this.loadWallet()
      }
    })
  }

  loadWallet() {
    const profileId = this.profileState.selectedProfileId()
    if (!profileId) {
      this.loading = false
      return
    }
    this.loading = true
    this.walletService.getWallet(profileId).subscribe({
      next: (w) => {
        this.wallet = w
        this.loading = false
      },
      error: () => { this.loading = false },
    })
  }

  deposit() {
    if (!this.wallet || !this.depositAmount) return
    this.walletService.deposit(this.wallet.externalProfileId, {
      amount: this.depositAmount,
      description: this.depositNotes || `Deposit to ${this.wallet.externalProfileId}`,
    }).subscribe({
      next: (res) => {
        this.success = `Deposited ${res.amount} ${res.currency} (balance: ${res.balanceAfter} ${res.currency})`
        this.depositAmount = 0
        this.depositNotes = ''
        this.loadWallet()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Deposit failed'
      },
    })
  }

  clearMessages() {
    this.error = ''
    this.success = ''
  }
}
