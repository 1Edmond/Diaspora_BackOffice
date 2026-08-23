import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { StatisticsWidget } from '../../dashboard/ecommerce/components/statistics-widget/statistics-widget'
import { RouterLink } from '@angular/router'
import { IdentityService } from '@core/services/identity/identity.service'
import { KycService } from '@core/services/kyc.service'
import { KYCKPIItem, kycKpiData } from './data'
import { KYCStatus } from '@core/models/shared/enums.model'

@Component({
  selector: 'app-kyc-dashboard',
  standalone: true,
  imports: [PageBreadcrumb, StatisticsWidget, RouterLink, DatePipe],
  templateUrl: './kyc-dashboard.html',
  styles: ``,
})
export class KycDashboard implements OnInit {
  kpiData: KYCKPIItem[] = [...kycKpiData]
  pendingVerifications: any[] = []
  loading = true

  constructor(
    private identityService: IdentityService,
    private kycService: KycService
  ) {}

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.loading = true
    this.identityService.getKYCStatistics().subscribe({
      next: (stats) => {
        this.kpiData[0].value = stats.totalUsers
        this.kpiData[2].value = stats.usersWithAdvancedKYC + stats.usersWithIntermediateKYC + stats.usersWithBasicKYC
        this.kpiData[4].value = stats.verificationRate
      },
    })

    this.kycService.getVerifications({ pageSize: 5, status: KYCStatus.Pending }).subscribe({
      next: (res) => {
        this.pendingVerifications = res.items
        this.kpiData[1].value = res.totalCount
        this.loading = false
      },
      error: () => { this.loading = false },
    })

    this.kycService.getVerifications({ pageSize: 1, status: KYCStatus.Rejected }).subscribe({
      next: (res) => { this.kpiData[3].value = res.totalCount },
    })
  }
}
