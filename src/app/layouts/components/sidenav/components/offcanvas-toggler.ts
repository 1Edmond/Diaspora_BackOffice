import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'offcanvas-toggler',
  imports: [Icon],
  template: `
    <button class="button-close-offcanvas" (click)="toggleSidebar()">
      <app-icon icon="menu" class="align-middle" />
    </button>
  `,
  styles: ``,
})
export class OffcanvasToggler {
  constructor(public layout: LayoutService) {}

  toggleSidebar() {
    this.layout.toggleMobileMenu()
  }
}
