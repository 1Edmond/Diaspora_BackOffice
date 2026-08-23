import { Component } from '@angular/core'
import { LayoutInfo } from '@app/components/layout-info/layout-info'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-sidebar-on-hover-active',
  imports: [PageBreadcrumb, LayoutInfo],
  templateUrl: './sidebar-on-hover-active.html',
  styles: ``,
})
export class SidebarOnHoverActive {
  constructor(public layout: LayoutService) {}

  ngOnInit(): void {
    this.layout.updateLayout({
      sidenavSize: 'on-hover-active',
    })
  }
}
