import { Component } from '@angular/core'
import { chartjs } from '@app/components/chartjs/chartjs'
import { multiPieChartOptions } from '../../data'

@Component({
  selector: 'app-total-sales',
  imports: [chartjs],
  templateUrl: './total-sales.html',
  styles: ``,
})
export class TotalSales {
  multiPieChartOptions = multiPieChartOptions
}
