import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { StatisticsWidget } from '../ecommerce/components/statistics-widget/statistics-widget'
import { KPIItem, kpiData } from './data'

@Component({
  selector: 'app-identity-dashboard',
  standalone: true,
  imports: [PageBreadcrumb, StatisticsWidget],
  templateUrl: './identity-dashboard.html',
  styles: ``,
})
export class IdentityDashboard {
  kpiData = kpiData
}