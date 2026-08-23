import { Component } from '@angular/core'
import { LayoutInfo } from '@app/components/layout-info/layout-info'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-sidebar-on-hover',
  imports: [PageBreadcrumb, LayoutInfo],
  templateUrl: './sidebar-on-hover.html',
  styles: ``,
})
export class SidebarOnHover {
  constructor(public layout: LayoutService) {}

  ngOnInit(): void {
    this.layout.updateLayout({
      sidenavSize: 'on-hover',
    })
  }
}
