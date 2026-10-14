import { Component, OnInit, Input, signal } from '@angular/core'
import { DatePipe, DecimalPipe, CommonModule } from '@angular/common'
import { Icon } from '@app/components/icon/icon'
import { RouterLink } from '@angular/router'
import { ProfileService } from '@core/services/profile.service'
import { BaseResponse, PagedList } from '@core/models/shared/base-response.model'
import {
  TransactionStatus,
  TransactionStatusLabels,
  TransactionStatusBadgeVariants,
  TransactionDirection,
  TransactionDirectionLabels,
  TransactionDirectionBadgeVariants,
} from '@core/models/shared/enums.model'

interface WalletSummary {
  balance: number
  currency: string
  pendingBalance: number
  totalEarned: number
  totalSpent: number
}

interface TransactionSummary {
  id: string
  type: 'credit' | 'debit'
  amount: number
  currency: string
  status: number
  description: string
  reference: string
  createdAt: string
}

@Component({
  selector: 'app-profile-wallet-tab',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, Icon, RouterLink],
  templateUrl: './profile-wallet-tab.html',
  styles: ``,
})
export class ProfileWalletTab implements OnInit {
  @Input() userId!: string

  wallet: WalletSummary | null = null
  transactions = signal<TransactionSummary[]>([])
  loading = false
  error = ''

  TransactionStatus = TransactionStatus
  TransactionStatusLabels = TransactionStatusLabels
  TransactionStatusBadgeVariants = TransactionStatusBadgeVariants
  TransactionDirection = TransactionDirection
  TransactionDirectionLabels = TransactionDirectionLabels
  TransactionDirectionBadgeVariants = TransactionDirectionBadgeVariants

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.loadWallet()
    this.loadTransactions()
  }

  loadWallet() {
    this.loading = true
    // TODO: Implement actual API call when backend endpoint is available
    setTimeout(() => {
      this.wallet = {
        balance: 1250.75,
        currency: 'XOF',
        pendingBalance: 150.00,
        totalEarned: 5000.00,
        totalSpent: 3749.25
      }
      this.loading = false
    }, 500)
  }

  loadTransactions() {
    // TODO: Implement actual API call when backend endpoint is available
    setTimeout(() => {
      this.transactions.set([
        { id: '1', type: 'credit', amount: 500, currency: 'XOF', status: 1, description: 'Service payment received', reference: 'TXN-001', createdAt: new Date().toISOString() },
        { id: '2', type: 'debit', amount: 50, currency: 'XOF', status: 1, description: 'Platform fee', reference: 'TXN-002', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', type: 'credit', amount: 750, currency: 'XOF', status: 0, description: 'Service payment pending', reference: 'TXN-003', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: '4', type: 'debit', amount: 100, currency: 'XOF', status: 2, description: 'Withdrawal failed', reference: 'TXN-004', createdAt: new Date(Date.now() - 172800000).toISOString() },
      ])
    }, 500)
  }

  getStatusBadge(status: number): string {
    return this.TransactionStatusBadgeVariants[status as TransactionStatus] || 'secondary'
  }

  getStatusLabel(status: number): string {
    return this.TransactionStatusLabels[status as TransactionStatus] || 'Unknown'
  }
}