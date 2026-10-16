import { Component, OnInit, inject, TemplateRef } from '@angular/core'
import { DatePipe, DecimalPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { WalletService } from '@core/services/wallet.service'
import { WalletDto, PlatformRevenueDto } from '@core/models/wallet/wallet.model'

@Component({
  selector: 'app-all-wallets',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, DecimalPipe, RouterLink, FormsModule, Icon],
  templateUrl: './all-wallets.html',
  styles: ``,
})
export class AllWallets implements OnInit {
  private walletService = inject(WalletService)
  private modalService = inject(NgbModal)

  revenue: PlatformRevenueDto | null = null
  wallets: WalletDto[] = []

  loadingRevenue = false
  loadingWallets = false
  error = ''
  success = ''

  currencyFilter = ''
  statusFilter = ''
  searchQuery = ''

  page = 1
  pageSize = 20
  totalCount = 0
  totalPages = 1

  // Modal Deposit
  selectedWallet: WalletDto | null = null
  depositAmount: number | null = null
  depositDescription = ''
  submittingDeposit = false
  private modalRef: NgbModalRef | null = null

  readonly availableCurrencies = ['XOF', 'EUR', 'USD']

  ngOnInit() {
    this.loadRevenue()
    this.loadWallets()
  }

  loadRevenue() {
    this.loadingRevenue = true
    this.walletService.getPlatformRevenue().subscribe({
      next: (res) => {
        this.revenue = res
        this.loadingRevenue = false
      },
      error: () => {
        this.loadingRevenue = false
      },
    })
  }

  loadWallets() {
    this.loadingWallets = true
    const isActive = this.statusFilter === '' ? undefined : this.statusFilter === 'active'

    this.walletService.getWalletsAdmin(
      this.currencyFilter || undefined,
      isActive,
      this.page,
      this.pageSize
    ).subscribe({
      next: (res) => {
        this.wallets = res.items
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loadingWallets = false
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Erreur lors du chargement des portefeuilles'
        this.loadingWallets = false
      },
    })
  }

  get filteredWallets(): WalletDto[] {
    if (!this.searchQuery.trim()) {
      return this.wallets
    }
    const query = this.searchQuery.trim().toLowerCase()
    return this.wallets.filter((w) =>
      w.externalProfileId.toLowerCase().includes(query) ||
      w.userId.toLowerCase().includes(query) ||
      w.currency.toLowerCase().includes(query)
    )
  }

  onFilterChange() {
    this.page = 1
    this.loadWallets()
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return
    this.page = page
    this.loadWallets()
  }

  openDepositModal(wallet: WalletDto, content: TemplateRef<any>) {
    this.selectedWallet = wallet
    this.depositAmount = null
    this.depositDescription = ''
    this.modalRef = this.modalService.open(content, { centered: true })
  }

  confirmDeposit() {
    if (!this.selectedWallet || !this.depositAmount || this.depositAmount <= 0) return

    this.submittingDeposit = true
    this.error = ''
    this.success = ''

    this.walletService.deposit(this.selectedWallet.externalProfileId, {
      amount: this.depositAmount,
      description: this.depositDescription || `Dépôt administratif pour ${this.selectedWallet.externalProfileId}`,
    }).subscribe({
      next: (res) => {
        this.success = `Dépôt de ${res.amount} ${res.currency} effectué avec succès (Nouveau solde : ${res.balanceAfter} ${res.currency}).`
        this.submittingDeposit = false
        this.modalRef?.close()
        this.loadWallets()
        this.loadRevenue()
      },
      error: (err: any) => {
        this.error = err.error?.error || err.error?.message || 'Échec du dépôt'
        this.submittingDeposit = false
      },
    })
  }

  clearAlerts() {
    this.error = ''
    this.success = ''
  }
}
