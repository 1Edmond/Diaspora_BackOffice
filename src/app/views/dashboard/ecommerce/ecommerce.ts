import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { ProductInventory } from './components/product-inventory/product-inventory'
import { RecentOrders } from './components/recent-orders/recent-orders'
import { SalesAnalytics } from './components/sales-analytics/sales-analytics'
import { StatisticsWidget } from './components/statistics-widget/statistics-widget'
import { TotalSales } from './components/total-sales/total-sales'
import { stateData } from './data'

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [PageBreadcrumb, StatisticsWidget, TotalSales, SalesAnalytics, ProductInventory, RecentOrders],
  templateUrl: './ecommerce.html',
  styles: ``,
})
export class Ecommerce {
  stateData = stateData
}
