import { Component } from '@angular/core'
import { LayoutInfo } from '@app/components/layout-info/layout-info'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-sidebar-gray',
  imports: [PageBreadcrumb, LayoutInfo],
  templateUrl: './sidebar-gray.html',
  styles: ``,
})
export class SidebarGray {
  constructor(public layout: LayoutService) {}

  ngOnInit(): void {
    this.layout.updateLayout({
      sidenavColor: 'gray',
    })
  }
}
