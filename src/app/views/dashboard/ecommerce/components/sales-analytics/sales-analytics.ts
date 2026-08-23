import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { chartjs } from '@app/components/chartjs/chartjs'
import { stackedBarLineChartOptions } from '../../data'

@Component({
  selector: 'app-sales-analytics',
  imports: [chartjs, RouterLink],
  templateUrl: './sales-analytics.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SalesAnalytics {
  stackedBarLineChartOptions = stackedBarLineChartOptions
}
