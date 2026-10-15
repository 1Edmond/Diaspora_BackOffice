import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb';
import { Icon } from '@app/components/icon/icon';
import { StatisticsWidgetComponent } from '@app/components/statistics-widget/statistics-widget';
import { IdentityService } from '@core/services/identity/identity.service';
import { WalletService } from '@core/services/wallet.service';
import { DocumentService } from '@core/services/document.service';
import { ProcedureService } from '@core/services/procedure.service';
import { MarketplaceService } from '@core/services/marketplace.service';
import { FreelanceService } from '@core/services/freelance.service';
import { KYCStatistics } from '@core/models/identity/user.model';
import { PlatformRevenueDto } from '@core/models/wallet/wallet.model';
import { DisputeDto, DisputeStatus } from '@core/models/marketplace/dispute.model';

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PageBreadcrumb,
    Icon,
    StatisticsWidgetComponent,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './ecommerce.html',
})
export class Ecommerce implements OnInit {
  loading = true;

  // KPIs
  totalUsers = 0;
  pendingKycCount = 0;
  pendingDocsCount = 0;
  activeProceduresCount = 0;
  openDisputesCount = 0;
  activeMissionsCount = 0;

  // Trésorerie
  revenueData: PlatformRevenueDto | null = null;
  totalHeldXof = 0;
  totalCommissionXof = 0;

  // Alertes et litiges urgents
  urgentDisputes: DisputeDto[] = [];
  pendingDocuments: any[] = [];

  constructor(
    private router: Router,
    private identityService: IdentityService,
    private walletService: WalletService,
    private documentService: DocumentService,
    private procedureService: ProcedureService,
    private marketplaceService: MarketplaceService,
    private freelanceService: FreelanceService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    // 1. Identity & KYC
    this.identityService.getKYCStatistics().subscribe({
      next: (stats: KYCStatistics) => {
        this.totalUsers = stats.totalUsers || 0;
        this.pendingKycCount = stats.usersWithBasicKYC || 0;
      },
      error: () => {},
    });

    // 2. Trésorerie Plateforme
    this.walletService.getPlatformRevenue().subscribe({
      next: (rev: PlatformRevenueDto) => {
        this.revenueData = rev;
        const xofSummary = rev.currencies?.find((c) => c.currency === 'XOF');
        if (xofSummary) {
          this.totalCommissionXof = xofSummary.platformBalance;
          this.totalHeldXof = xofSummary.totalEscrowHeld;
        } else if (rev.currencies && rev.currencies.length > 0) {
          this.totalCommissionXof = rev.currencies[0].platformBalance;
          this.totalHeldXof = rev.currencies[0].totalEscrowHeld;
        }
      },
      error: () => {},
    });

    // 3. Documents en attente
    this.documentService.getPendingDocuments(1, 5).subscribe({
      next: (res) => {
        this.pendingDocsCount = res.totalCount || 0;
        this.pendingDocuments = res.items || [];
      },
      error: () => {},
    });

    // 4. Démarches consulaires
    this.procedureService.getAllUserProceduresAdmin(undefined, undefined, 1, 5).subscribe({
      next: (res) => {
        this.activeProceduresCount = res.totalCount || 0;
      },
      error: () => {},
    });

    // 5. Litiges Marketplace
    this.marketplaceService.getDisputes(DisputeStatus.Opened, 1, 5).subscribe({
      next: (res) => {
        this.openDisputesCount = res.totalCount || 0;
        this.urgentDisputes = res.items || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });

    // 6. Missions freelance
    this.freelanceService.getJobPostings({ page: 1, pageSize: 1, status: 1 }).subscribe({
      next: (res) => {
        this.activeMissionsCount = res.totalCount || 0;
      },
      error: () => {},
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
