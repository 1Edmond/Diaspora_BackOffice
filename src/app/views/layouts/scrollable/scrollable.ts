import { Component } from '@angular/core'
import { LayoutInfo } from '@app/components/layout-info/layout-info'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-scrollable',
  imports: [PageBreadcrumb, LayoutInfo],
  templateUrl: './scrollable.html',
  styles: ``,
})
export class Scrollable {
  constructor(public layout: LayoutService) {}

  ngOnInit(): void {
    this.layout.updateLayout({
      position: 'scrollable',
    })
  }
}
