import { Component } from '@angular/core'
import { LayoutInfo } from '@app/components/layout-info/layout-info'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-topbar-gray',
  imports: [PageBreadcrumb, LayoutInfo],
  templateUrl: './topbar-gray.html',
  styles: ``,
})
export class TopbarGray {
  constructor(public layout: LayoutService) {}

  ngOnInit(): void {
    this.layout.updateLayout({
      topbarColor: 'gray',
    })
  }
}
