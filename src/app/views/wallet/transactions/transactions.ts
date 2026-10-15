import { Component, OnInit, effect } from '@angular/core'
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { WalletService } from '@core/services/wallet.service'
import { ProfileStateService } from '@core/services/profile-state.service'
import { TransactionDto } from '@core/models/wallet/wallet.model'
import { ProfileDropdown } from '@shared/components/profile-dropdown/profile-dropdown'
import {
  TransactionType,
  TransactionStatus,
  TransactionTypeLabels,
  TransactionStatusLabels,
  TransactionStatusBadgeVariants,
  TransactionDirection,
  TransactionDirectionLabels,
  TransactionDirectionBadgeVariants,
} from '@core/models/shared/enums.model'

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, DecimalPipe, FormsModule, ProfileDropdown],
  templateUrl: './transactions.html',
  styles: ``,
})
export class Transactions implements OnInit {
  transactions: TransactionDto[] = []
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  typeFilter = ''
  statusFilter = ''
  loading = false

  TransactionType = TransactionType
  TransactionStatus = TransactionStatus
  TransactionTypeLabels = TransactionTypeLabels
  TransactionStatusLabels = TransactionStatusLabels
  TransactionStatusBadgeVariants = TransactionStatusBadgeVariants
  TransactionDirection = TransactionDirection
  TransactionDirectionLabels = TransactionDirectionLabels
  TransactionDirectionBadgeVariants = TransactionDirectionBadgeVariants

  activeTab: 'all' | 'by-profile' = 'all'

  typeOptions = [
    { value: TransactionType.Deposit, label: TransactionTypeLabels[TransactionType.Deposit] },
    { value: TransactionType.TransferOut, label: TransactionTypeLabels[TransactionType.TransferOut] },
    { value: TransactionType.TransferIn, label: TransactionTypeLabels[TransactionType.TransferIn] },
    { value: TransactionType.TransferFee, label: TransactionTypeLabels[TransactionType.TransferFee] },
    { value: TransactionType.ProcedurePayment, label: TransactionTypeLabels[TransactionType.ProcedurePayment] },
    { value: TransactionType.MarketplacePayment, label: TransactionTypeLabels[TransactionType.MarketplacePayment] },
    { value: TransactionType.MarketplaceReceipt, label: TransactionTypeLabels[TransactionType.MarketplaceReceipt] },
    { value: TransactionType.Refund, label: TransactionTypeLabels[TransactionType.Refund] },
    { value: TransactionType.MarketplacePaymentHold, label: TransactionTypeLabels[TransactionType.MarketplacePaymentHold] },
    { value: TransactionType.MarketplacePaymentRelease, label: TransactionTypeLabels[TransactionType.MarketplacePaymentRelease] },
    { value: TransactionType.MarketplacePaymentRefund, label: TransactionTypeLabels[TransactionType.MarketplacePaymentRefund] },
    { value: TransactionType.MarketplacePlatformCommission, label: TransactionTypeLabels[TransactionType.MarketplacePlatformCommission] },
  ]

  statusOptions = [
    { value: TransactionStatus.Pending, label: TransactionStatusLabels[TransactionStatus.Pending] },
    { value: TransactionStatus.Completed, label: TransactionStatusLabels[TransactionStatus.Completed] },
    { value: TransactionStatus.Failed, label: TransactionStatusLabels[TransactionStatus.Failed] },
  ]

  constructor(
    private walletService: WalletService,
    public profileState: ProfileStateService
  ) {
    effect(() => {
      const pid = this.profileState.selectedProfileId()
      if (pid && this.activeTab === 'by-profile') {
        this.page = 1
        this.loadTransactions()
      }
    })
  }

  ngOnInit() {
    this.loadTransactions()
  }

  setTab(tab: 'all' | 'by-profile') {
    this.activeTab = tab
    this.page = 1
    this.loadTransactions()
  }

  loadTransactions() {
    this.loading = true
    const type = this.typeFilter ? (Number(this.typeFilter) as TransactionType) : undefined
    const status = this.statusFilter ? (Number(this.statusFilter) as TransactionStatus) : undefined

    if (this.activeTab === 'by-profile') {
      const profileId = this.profileState.selectedProfileId()
      if (!profileId) {
        this.transactions = []
        this.totalCount = 0
        this.totalPages = 1
        this.loading = false
        return
      }

      this.walletService.getTransactions(profileId, {
        pageNumber: this.page,
        pageSize: this.pageSize,
        type,
        status,
      }).subscribe({
        next: (res) => {
          this.transactions = res.items
          this.totalCount = res.totalCount
          this.totalPages = res.totalPages
          this.loading = false
        },
        error: () => { this.loading = false },
      })
    } else {
      this.walletService.getAllTransactions({
        pageNumber: this.page,
        pageSize: this.pageSize,
        type,
        status,
      }).subscribe({
        next: (res) => {
          this.transactions = res.items
          this.totalCount = res.totalCount
          this.totalPages = res.totalPages
          this.loading = false
        },
        error: () => { this.loading = false },
      })
    }
  }

  onFilterChange() {
    this.page = 1
    this.loadTransactions()
  }

  onPageChange(page: number) {
    this.page = page
    this.loadTransactions()
  }

  exportCsv() {
    if (!this.transactions || this.transactions.length === 0) return

    const headers = ['Date', 'ID Transaction', 'Type', 'Direction', 'Montant', 'Frais', 'Solde Après', 'Devise', 'Statut', 'Description']
    const rows = this.transactions.map(t => [
      t.createdAt,
      t.id,
      TransactionTypeLabels[t.type] || t.type,
      t.direction === TransactionDirection.Credit ? 'Credit' : 'Debit',
      t.amount,
      t.fee,
      t.balanceAfter,
      t.currency,
      TransactionStatusLabels[t.status] || t.status,
      `"${(t.description || '').replace(/"/g, '""')}"`
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
