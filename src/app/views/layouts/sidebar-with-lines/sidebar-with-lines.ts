import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-sidebar-with-lines',
  imports: [PageBreadcrumb, Icon],
  templateUrl: './sidebar-with-lines.html',
  styles: ``,
})
export class SidebarWithLines {
  constructor(public layout: LayoutService) {}
  ngOnInit() {
    this.layout.setHtmlAttribute('class', 'sidebar-with-line')
  }

  ngOnDestroy() {
    this.layout.setHtmlAttribute('class', '')
    this.layout.reset()
  }
}
