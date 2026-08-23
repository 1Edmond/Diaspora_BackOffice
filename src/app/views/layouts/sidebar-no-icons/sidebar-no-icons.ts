import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'app-sidebar-no-icons',
  imports: [PageBreadcrumb, Icon],
  templateUrl: './sidebar-no-icons.html',
  styles: ``,
})
export class SidebarNoIcons {
  constructor(public layout: LayoutService) {}
  ngOnInit() {
    this.layout.setHtmlAttribute('class', 'sidebar-no-icons sidebar-with-line')
  }

  ngOnDestroy() {
    this.layout.setHtmlAttribute('class', '')
    this.layout.reset()
  }
}
