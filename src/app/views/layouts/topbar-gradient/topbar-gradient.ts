import { Component } from '@angular/core'
import { LayoutInfo } from '@app/components/layout-info/layout-info'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-topbar-gradient',
  imports: [LayoutInfo, PageBreadcrumb],
  templateUrl: './topbar-gradient.html',
  styles: ``,
})
export class TopbarGradient {
  constructor(public layout: LayoutService) {}

  ngOnInit(): void {
    this.layout.updateLayout({
      topbarColor: 'gradient',
    })
  }
}
