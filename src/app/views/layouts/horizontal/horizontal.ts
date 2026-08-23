import { Component } from '@angular/core'
import { LayoutInfo } from '@app/components/layout-info/layout-info'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-horizontal',
  imports: [PageBreadcrumb, LayoutInfo],
  templateUrl: './horizontal.html',
  styles: ``,
})
export class Horizontal {
  constructor(public layout: LayoutService) {}

  ngOnInit(): void {
    this.layout.updateLayout({
      orientation: 'horizontal',
    })
  }
}
