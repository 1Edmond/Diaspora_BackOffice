import { Component, OnInit, OnDestroy } from '@angular/core'
import { DatePipe, DecimalPipe } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { WalletService } from '@core/services/wallet.service'
import { TransactionDto } from '@core/models/wallet/wallet.model'
import { ProfileSearchDropdown } from '@shared/components/profile-search-dropdown/profile-search-dropdown'
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs'
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
  imports: [PageBreadcrumb, DatePipe, DecimalPipe, FormsModule, ProfileSearchDropdown, Icon],
  templateUrl: './transactions.html',
  styles: ``,
})
export class Transactions implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()
  private searchSubject = new Subject<string>()

  transactions: TransactionDto[] = []
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  typeFilter = ''
  statusFilter = ''
  searchTerm = ''
  loading = false

  selectedProfileId = ''
  selectedWalletId = ''

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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page = 1
        this.loadTransactions()
      })

    this.route.queryParamMap.subscribe((params) => {
      const profileId = params.get('profileId')
      const walletId = params.get('walletId')
      if (profileId) {
        this.selectedProfileId = profileId
        this.activeTab = 'by-profile'
      }
      if (walletId) {
        this.selectedWalletId = walletId
      }
      this.loadTransactions()
    })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm)
  }

  setTab(tab: 'all' | 'by-profile') {
    this.activeTab = tab
    this.page = 1
    this.loadTransactions()
  }

  onProfileSelected(profileId: string) {
    this.selectedProfileId = profileId
    this.activeTab = 'by-profile'
    this.page = 1
    this.loadTransactions()
  }

  clearProfileFilter() {
    this.selectedProfileId = ''
    this.selectedWalletId = ''
    this.activeTab = 'all'
    this.page = 1
    this.loadTransactions()
  }

  loadTransactions() {
    this.loading = true
    const type = this.typeFilter ? (Number(this.typeFilter) as TransactionType) : undefined
    const status = this.statusFilter ? (Number(this.statusFilter) as TransactionStatus) : undefined
    const search = this.searchTerm.trim() || undefined

    if (this.activeTab === 'by-profile') {
      if (!this.selectedProfileId) {
        this.transactions = []
        this.totalCount = 0
        this.totalPages = 1
        this.loading = false
        return
      }

      this.walletService
        .getTransactions(this.selectedProfileId, {
          pageNumber: this.page,
          pageSize: this.pageSize,
          type,
          status,
          search,
        })
        .subscribe({
          next: (res) => {
            let items = res.items || []
            if (search) {
              const term = search.toLowerCase()
              items = items.filter(
                (t) =>
                  (t.description && t.description.toLowerCase().includes(term)) ||
                  (t.referenceId && t.referenceId.toLowerCase().includes(term)) ||
                  (t.currency && t.currency.toLowerCase().includes(term))
              )
            }
            this.transactions = items
            this.totalCount = res.totalCount
            this.totalPages = res.totalPages
            this.loading = false
          },
          error: () => {
            this.loading = false
          },
        })
    } else {
      this.walletService
        .getAllTransactions({
          pageNumber: this.page,
          pageSize: this.pageSize,
          type,
          status,
          search,
        })
        .subscribe({
          next: (res) => {
            let items = res.items || []
            if (this.selectedWalletId) {
              items = items.filter((t) => t.walletId === this.selectedWalletId)
            }
            if (search) {
              const term = search.toLowerCase()
              items = items.filter(
                (t) =>
                  (t.description && t.description.toLowerCase().includes(term)) ||
                  (t.referenceId && t.referenceId.toLowerCase().includes(term)) ||
                  (t.currency && t.currency.toLowerCase().includes(term))
              )
            }
            this.transactions = items
            this.totalCount = res.totalCount
            this.totalPages = res.totalPages
            this.loading = false
          },
          error: () => {
            this.loading = false
          },
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
    const rows = this.transactions.map((t) => [
      t.createdAt,
      t.id,
      TransactionTypeLabels[t.type] || t.type,
      t.direction === TransactionDirection.Credit ? 'Credit' : 'Debit',
      t.amount,
      t.fee,
      t.balanceAfter,
      t.currency,
      TransactionStatusLabels[t.status] || t.status,
      `"${(t.description || '').replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
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
