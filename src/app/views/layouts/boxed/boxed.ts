import { Component } from '@angular/core'
import { LayoutInfo } from '@app/components/layout-info/layout-info'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-boxed',
  imports: [PageBreadcrumb, LayoutInfo],
  templateUrl: './boxed.html',
})
export class Boxed {
  constructor(public layout: LayoutService) {}

  ngOnInit(): void {
    this.layout.updateLayout({
      width: 'boxed',
    })
  }
}
