import { Component, OnInit, signal } from '@angular/core'
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { MarketplaceService } from '@core/services/marketplace.service'
import {
  DisputeDto,
  DisputeStatus,
  DisputeStatusLabels,
  DisputeStatusBadgeVariants,
  ResolveDisputeRequest,
} from '@core/models/marketplace/dispute.model'

type TabType = 'all' | 'active' | 'resolved'
type ArbitrationMode = 'buyer_100' | 'seller_100' | 'split' | 'dismiss'

@Component({
  selector: 'app-disputes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PageBreadcrumb, DatePipe, CurrencyPipe, Icon],
  templateUrl: './disputes.html',
  styles: [`
    .evidence-preview-img {
      max-height: 140px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid #dee2e6;
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
    }
    .evidence-preview-img:hover {
      transform: scale(1.03);
    }
    .cursor-pointer {
      cursor: pointer;
    }
  `],
})
export class Disputes implements OnInit {
  disputes = signal<DisputeDto[]>([])
  loading = false
  error = ''
  successMessage = ''

  tab: TabType = 'all'
  page = 1
  pageSize = 10
  totalCount = 0
  totalPages = 1
  statusFilter: DisputeStatus | null = null

  // Details Modal
  selectedDispute: DisputeDto | null = null
  detailsModalRef: any = null

  // Arbitration Modal
  arbitratingDispute: DisputeDto | null = null
  resolveModalRef: any = null
  arbitrationMode: ArbitrationMode = 'buyer_100'
  buyerRefundPercentage: number = 100
  sellerPayoutPercentage: number = 0
  resolutionNotes: string = ''
  resolving: boolean = false
  arbitrationError: string = ''

  DisputeStatus = DisputeStatus
  DisputeStatusLabels = DisputeStatusLabels
  DisputeStatusBadgeVariants = DisputeStatusBadgeVariants

  constructor(
    private marketplaceService: MarketplaceService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadDisputes()
  }

  loadDisputes() {
    this.loading = true
    this.error = ''

    let statusParam: DisputeStatus | undefined = undefined
    if (this.statusFilter !== null) {
      statusParam = this.statusFilter
    }

    this.marketplaceService.getDisputes(statusParam, this.page, this.pageSize).subscribe({
      next: (res) => {
        let items = res.items || []
        if (this.tab === 'active' && this.statusFilter === null) {
          items = items.filter(
            (d) => d.status === DisputeStatus.Opened || d.status === DisputeStatus.UnderReview
          )
        } else if (this.tab === 'resolved' && this.statusFilter === null) {
          items = items.filter(
            (d) =>
              d.status === DisputeStatus.ResolvedBuyerRefunded ||
              d.status === DisputeStatus.ResolvedSellerPaid ||
              d.status === DisputeStatus.ResolvedSplit ||
              d.status === DisputeStatus.Dismissed
          )
        }
        this.disputes.set(items)
        this.totalCount = res.totalCount
        this.totalPages = res.totalPages
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.error =
          err.error?.error || err.error?.message || 'Erreur lors du chargement des litiges.'
      },
    })
  }

  switchTab(newTab: TabType) {
    this.tab = newTab
    this.statusFilter = null
    this.page = 1
    this.loadDisputes()
  }

  onFilterChange() {
    this.page = 1
    this.loadDisputes()
  }

  onPageChange(newPage: number) {
    this.page = newPage
    this.loadDisputes()
  }

  openDetailsModal(content: any, dispute: DisputeDto) {
    this.selectedDispute = dispute
    this.detailsModalRef = this.modalService.open(content, { centered: true, size: 'lg' })
  }

  closeDetailsModal() {
    this.detailsModalRef?.close()
    this.detailsModalRef = null
    this.selectedDispute = null
  }

  openArbitrationModal(content: any, dispute: DisputeDto) {
    this.arbitratingDispute = dispute
    this.arbitrationMode = 'buyer_100'
    this.buyerRefundPercentage = 100
    this.sellerPayoutPercentage = 0
    this.resolutionNotes = ''
    this.arbitrationError = ''
    this.resolving = false
    this.resolveModalRef = this.modalService.open(content, { centered: true, size: 'lg' })
  }

  closeArbitrationModal() {
    this.resolveModalRef?.close()
    this.resolveModalRef = null
    this.arbitratingDispute = null
    this.arbitrationError = ''
  }

  onArbitrationModeChange() {
    switch (this.arbitrationMode) {
      case 'buyer_100':
        this.buyerRefundPercentage = 100
        this.sellerPayoutPercentage = 0
        break
      case 'seller_100':
        this.buyerRefundPercentage = 0
        this.sellerPayoutPercentage = 100
        break
      case 'split':
        this.buyerRefundPercentage = 50
        this.sellerPayoutPercentage = 50
        break
      case 'dismiss':
        this.buyerRefundPercentage = 0
        this.sellerPayoutPercentage = 0
        break
    }
  }

  onBuyerPercentChange(val: number) {
    const buyer = Math.max(0, Math.min(100, Number(val) || 0))
    this.buyerRefundPercentage = buyer
    this.sellerPayoutPercentage = 100 - buyer
  }

  onSellerPercentChange(val: number) {
    const seller = Math.max(0, Math.min(100, Number(val) || 0))
    this.sellerPayoutPercentage = seller
    this.buyerRefundPercentage = 100 - seller
  }

  isArbitrationValid(): boolean {
    if (!this.resolutionNotes.trim()) {
      return false
    }

    if (this.arbitrationMode === 'split') {
      const sum = Number(this.buyerRefundPercentage) + Number(this.sellerPayoutPercentage)
      if (Math.round(sum) !== 100) {
        return false
      }
      if (this.buyerRefundPercentage < 0 || this.sellerPayoutPercentage < 0) {
        return false
      }
    }

    return true
  }

  submitArbitration() {
    if (!this.arbitratingDispute || !this.isArbitrationValid() || this.resolving) {
      return
    }

    let finalStatus: DisputeStatus
    let buyerPct = 0
    let sellerPct = 0

    switch (this.arbitrationMode) {
      case 'buyer_100':
        finalStatus = DisputeStatus.ResolvedBuyerRefunded
        buyerPct = 100
        sellerPct = 0
        break
      case 'seller_100':
        finalStatus = DisputeStatus.ResolvedSellerPaid
        buyerPct = 0
        sellerPct = 100
        break
      case 'split':
        finalStatus = DisputeStatus.ResolvedSplit
        buyerPct = this.buyerRefundPercentage
        sellerPct = this.sellerPayoutPercentage
        break
      case 'dismiss':
        finalStatus = DisputeStatus.Dismissed
        buyerPct = 0
        sellerPct = 0
        break
    }

    const payload: ResolveDisputeRequest = {
      finalStatus,
      resolutionNotes: this.resolutionNotes.trim(),
      buyerRefundPercentage: buyerPct,
      sellerPayoutPercentage: sellerPct,
    }

    this.resolving = true
    this.arbitrationError = ''

    this.marketplaceService.resolveDispute(this.arbitratingDispute.id, payload).subscribe({
      next: () => {
        this.resolving = false
        this.successMessage = `Le litige #${this.arbitratingDispute?.id.substring(0, 8)} a été arbitré avec succès.`
        this.closeArbitrationModal()
        this.loadDisputes()
        setTimeout(() => (this.successMessage = ''), 5000)
      },
      error: (err) => {
        this.resolving = false
        this.arbitrationError =
          err.error?.error || err.error?.message || "Erreur lors de l'arbitrage du litige."
      },
    })
  }

  isImage(url: string): boolean {
    if (!url) return false
    const cleanUrl = url.toLowerCase().split('?')[0]
    return (
      cleanUrl.endsWith('.jpg') ||
      cleanUrl.endsWith('.jpeg') ||
      cleanUrl.endsWith('.png') ||
      cleanUrl.endsWith('.webp') ||
      cleanUrl.endsWith('.gif')
    )
  }

  isTerminalStatus(status: DisputeStatus): boolean {
    return (
      status === DisputeStatus.ResolvedBuyerRefunded ||
      status === DisputeStatus.ResolvedSellerPaid ||
      status === DisputeStatus.ResolvedSplit ||
      status === DisputeStatus.Dismissed
    )
  }
}
