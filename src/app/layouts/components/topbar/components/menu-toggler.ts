import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'menu-toggler',
  imports: [Icon],
  template: `
    <button class="sidenav-toggle-button btn btn-default btn-icon" (click)="toggleSidebar()">
      <app-icon icon="menu" />
    </button>
    <button class="topnav-toggle-button px-2" (click)="toggleSidebar()">
      <app-icon icon="menu" />
    </button>
  `,
})
export class MenuToggler {
  constructor(public layout: LayoutService) {}

  toggleSidebar() {
    const currentSize = this.layout.sidenavSize

    if (currentSize === 'offcanvas') {
      this.layout.toggleMobileMenu()
    } else if (currentSize === 'compact') {
      this.layout.updateLayout({ sidenavSize: 'condensed' })
    } else {
      this.layout.updateLayout({
        sidenavSize: currentSize === 'condensed' ? 'default' : 'condensed',
      })
    }
  }
}
