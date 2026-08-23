import { getColor } from '@/app/utils/string'
import { AfterViewInit, Component, HostListener, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'
import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  ChartConfiguration,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  Tooltip,
} from 'chart.js'
import { merge } from 'lodash-es'
import { BaseChartDirective, provideCharts } from 'ng2-charts'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-chartjs',
  imports: [BaseChartDirective],
  providers: [
    provideCharts({
      registerables: [
        LineController,
        LineElement,
        PointElement,
        Filler,
        CategoryScale,
        LinearScale,
        Tooltip,
        Legend,
        BarController,
        BarElement,
        BubbleController,
        RadarController,
        DoughnutController,
        ArcElement,
        PieController,
        PolarAreaController,
        ScatterController,
        RadialLinearScale,
      ],
    }),
  ],
  templateUrl: './chartjs.html',
  styles: ``,
})
export class chartjs implements OnInit, OnDestroy, AfterViewInit {
  @Input() getOptions!: () => ChartConfiguration
  @Input() height: number = 300

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective

  ngAfterViewInit(): void {
    setTimeout(() => this.chart?.chart?.resize(), 200)
  }

  @HostListener('window:resize')
  onWindowResize() {
    setTimeout(() => this.chart?.chart?.resize(), 200)
  }

  options!: ChartConfiguration
  private layoutSub!: Subscription

  get bodyFont() {
    return getComputedStyle(document.body).fontFamily.trim()
  }

  defaultOptions = (): ChartConfiguration['options'] => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: -10,
      },
    },
    scales: {
      x: {
        ticks: {
          font: { family: this.bodyFont },
          color: getColor('secondary-color'),
          display: true,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        ticks: {
          font: { family: this.bodyFont },
          color: getColor('secondary-color'),
        },
        grid: {
          display: true,
          color: getColor('chart-border-color'),
          lineWidth: 1,
        },
        border: {
          display: false,
          dash: [5, 5],
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { family: this.bodyFont },
          color: getColor('secondary-color'),
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          padding: 15,
        },
      },
      tooltip: {
        enabled: true,
        titleFont: { family: this.bodyFont },
        bodyFont: { family: this.bodyFont },
      },
    },
  })

  layout = inject(LayoutService)

  ngOnInit(): void {
    this.setChartOptions()

    // Refresh chart on theme/skin change
    this.layoutSub = this.layout.layoutState$.subscribe(() => {
      this.setChartOptions()
    })
  }

  ngOnDestroy(): void {
    this.layoutSub?.unsubscribe()
  }

  private setChartOptions() {
    const userConfig = this.getOptions()
    userConfig.options = merge({}, this.defaultOptions(), userConfig.options)

    const type = userConfig.type

    const isCartesian = type === 'line' || type === 'bar' || type === 'scatter' || type === 'bubble'

    const scales = userConfig.options?.scales
    if (isCartesian && scales) {
      const isHorizontalBar = type === 'bar' && userConfig.options?.indexAxis === 'y'

      if (isHorizontalBar) {
        scales['x']!.type = 'linear'
        scales['y']!.type = 'category'
      } else {
        scales['x']!.type = 'category'
        scales['y']!.type = 'linear'
      }
    }

    this.options = userConfig
    setTimeout(() => this.chart?.chart?.resize(), 200)
  }
}
