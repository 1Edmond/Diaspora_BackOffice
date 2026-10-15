import { Component, OnInit, Input, signal } from '@angular/core'
import { DatePipe, DecimalPipe, CommonModule } from '@angular/common'
import { Icon } from '@app/components/icon/icon'
import { RouterLink } from '@angular/router'
import { WalletService } from '@core/services/wallet.service'
import { WalletDto, TransactionDto } from '@core/models/wallet/wallet.model'
import {
  TransactionStatus,
  TransactionStatusLabels,
  TransactionStatusBadgeVariants,
} from '@core/models/shared/enums.model'

@Component({
  selector: 'app-profile-wallet-tab',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, Icon, RouterLink],
  templateUrl: './profile-wallet-tab.html',
  styles: ``,
})
export class ProfileWalletTab implements OnInit {
  @Input() profileId!: string
  @Input() userId!: string

  wallet = signal<WalletDto | null>(null)
  transactions = signal<TransactionDto[]>([])
  loading = false
  error = ''

  TransactionStatus = TransactionStatus
  TransactionStatusLabels = TransactionStatusLabels
  TransactionStatusBadgeVariants = TransactionStatusBadgeVariants

  constructor(private walletService: WalletService) {}

  ngOnInit() {
    if (this.profileId) {
      this.loadWalletData()
    }
  }

  loadWalletData() {
    this.loading = true
    this.error = ''

    this.walletService.getWallet(this.profileId).subscribe({
      next: (w) => {
        this.wallet.set(w)
        this.loadTransactions()
      },
      error: (err: any) => {
        this.loading = false
        if (err.status !== 404) {
          this.error = err.error?.error || err.error?.message || 'Impossible de charger le portefeuille'
        }
      }
    })
  }

  loadTransactions() {
    this.walletService.getTransactions(this.profileId, { pageNumber: 1, pageSize: 15 }).subscribe({
      next: (res) => {
        this.transactions.set(res.items || [])
        this.loading = false
      },
      error: () => {
        this.loading = false
      }
    })
  }

  getStatusBadge(status: number): string {
    return this.TransactionStatusBadgeVariants[status as TransactionStatus] || 'secondary'
  }

  getStatusLabel(status: number): string {
    return this.TransactionStatusLabels[status as TransactionStatus] || 'Inconnu'
  }
}