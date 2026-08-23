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

  typeOptions = [
    { value: TransactionType.Deposit, label: TransactionTypeLabels[TransactionType.Deposit] },
    { value: TransactionType.TransferOut, label: TransactionTypeLabels[TransactionType.TransferOut] },
    { value: TransactionType.TransferIn, label: TransactionTypeLabels[TransactionType.TransferIn] },
    { value: TransactionType.TransferFee, label: TransactionTypeLabels[TransactionType.TransferFee] },
    { value: TransactionType.ProcedurePayment, label: TransactionTypeLabels[TransactionType.ProcedurePayment] },
    { value: TransactionType.MarketplacePayment, label: TransactionTypeLabels[TransactionType.MarketplacePayment] },
    { value: TransactionType.MarketplaceReceipt, label: TransactionTypeLabels[TransactionType.MarketplaceReceipt] },
    { value: TransactionType.Refund, label: TransactionTypeLabels[TransactionType.Refund] },
  ]

  statusOptions = [
    { value: TransactionStatus.Pending, label: TransactionStatusLabels[TransactionStatus.Pending] },
    { value: TransactionStatus.Completed, label: TransactionStatusLabels[TransactionStatus.Completed] },
    { value: TransactionStatus.Failed, label: TransactionStatusLabels[TransactionStatus.Failed] },
  ]

  constructor(
    private walletService: WalletService,
    public profileState: ProfileStateService
  ) {}

  ngOnInit() {
    if (this.profileState.selectedProfileId()) {
      this.loadTransactions()
    }
    effect(() => {
      const pid = this.profileState.selectedProfileId()
      if (pid) {
        this.loadTransactions()
      }
    })
  }

  loadTransactions() {
    const profileId = this.profileState.selectedProfileId()
    if (!profileId) return
    this.loading = true
    this.walletService.getTransactions(profileId, {
      pageNumber: this.page,
      pageSize: this.pageSize,
      type: this.typeFilter ? (Number(this.typeFilter) as TransactionType) : undefined,
      status: this.statusFilter ? (Number(this.statusFilter) as TransactionStatus) : undefined,
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

  onFilterChange() {
    this.page = 1
    this.loadTransactions()
  }

  onPageChange(page: number) {
    this.page = page
    this.loadTransactions()
  }
}
