import { Component } from '@angular/core'
import { LayoutInfo } from '@app/components/layout-info/layout-info'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-sidebar-image',
  imports: [PageBreadcrumb, LayoutInfo],
  templateUrl: './sidebar-image.html',
  styles: ``,
})
export class SidebarImage {
  constructor(public layout: LayoutService) {}

  ngOnInit(): void {
    this.layout.updateLayout({
      sidenavColor: 'image',
    })
  }
}
