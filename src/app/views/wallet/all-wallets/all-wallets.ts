import { Component, OnInit, inject, TemplateRef } from '@angular/core'
import { DatePipe, DecimalPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { WalletService } from '@core/services/wallet.service'
import { ProfileService } from '@core/services/profile.service'
import {
  WalletDto,
  PlatformRevenueDto,
  PlatformRevenueCurrencySummary,
} from '@core/models/wallet/wallet.model'
import { ProfileTypeDto } from '@core/models/profile/profile.model'

@Component({
  selector: 'app-all-wallets',
  standalone: true,
  imports: [PageBreadcrumb, DatePipe, DecimalPipe, RouterLink, FormsModule, Icon],
  templateUrl: './all-wallets.html',
  styles: ``,
})
export class AllWallets implements OnInit {
  private walletService = inject(WalletService)
  private profileService = inject(ProfileService)
  private modalService = inject(NgbModal)

  revenue: PlatformRevenueDto | null = null
  wallets: WalletDto[] = []
  profileTypes: ProfileTypeDto[] = []

  selectedProfileTypeId = ''
  selectedProfileType: ProfileTypeDto | null = null

  loadingRevenue = false
  loadingWallets = false
  loadingProfileTypes = false
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
    this.loadProfileTypes()
    this.loadRevenue()
    this.loadWallets()
  }

  loadProfileTypes() {
    this.loadingProfileTypes = true
    this.profileService.getProfileTypes().subscribe({
      next: (pts) => {
        this.profileTypes = pts || []
        this.loadingProfileTypes = false
        if (this.profileTypes.length > 0 && !this.selectedProfileTypeId) {
          this.selectedProfileTypeId = this.profileTypes[0].id
          this.selectedProfileType = this.profileTypes[0]
          this.currencyFilter = this.selectedProfileType.currency
          this.loadWallets()
        }
      },
      error: () => {
        this.loadingProfileTypes = false
      },
    })
  }

  onProfileTypeFilterChange() {
    this.selectedProfileType = this.profileTypes.find((pt) => pt.id === this.selectedProfileTypeId) || null
    if (this.selectedProfileType) {
      this.currencyFilter = this.selectedProfileType.currency
    } else {
      this.currencyFilter = ''
    }
    this.page = 1
    this.loadWallets()
  }

  get selectedCurrency(): string {
    return this.selectedProfileType?.currency || this.currencyFilter || 'XOF'
  }

  get profileTypeRevenue(): PlatformRevenueCurrencySummary | null {
    if (!this.revenue?.currencies) return null
    return (
      this.revenue.currencies.find(
        (c) => c.currency.toUpperCase() === this.selectedCurrency.toUpperCase()
      ) || null
    )
  }

  get totalWalletsBalance(): number {
    const targetCurr = this.selectedCurrency.toUpperCase()
    return this.wallets
      .filter((w) => w.currency.toUpperCase() === targetCurr)
      .reduce((sum, w) => sum + (w.balance || 0), 0)
  }

  get totalWalletsHeld(): number {
    const targetCurr = this.selectedCurrency.toUpperCase()
    const fromWallets = this.wallets
      .filter((w) => w.currency.toUpperCase() === targetCurr)
      .reduce((sum, w) => sum + (w.heldBalance || 0), 0)
    const fromRev = this.profileTypeRevenue?.totalEscrowHeld || 0
    return Math.max(fromWallets, fromRev)
  }

  get totalCommissions(): number {
    return this.profileTypeRevenue?.platformBalance || 0
  }

  get activeWalletsCount(): number {
    const targetCurr = this.selectedCurrency.toUpperCase()
    return this.wallets.filter((w) => w.currency.toUpperCase() === targetCurr && w.isActive).length
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
