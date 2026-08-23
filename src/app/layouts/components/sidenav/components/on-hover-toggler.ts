import { Component } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'on-hover-toggler',
  imports: [],
  template: `
    <button class="button-on-hover" (click)="toggleSidebar()">
      <span class="btn-on-hover-icon"></span>
    </button>
  `,
  styles: ``,
})
export class OnHoverToggler {
  constructor(public layout: LayoutService) {}

  toggleSidebar() {
    this.layout.updateLayout({
      sidenavSize: this.layout.sidenavSize === 'on-hover-active' ? 'on-hover' : 'on-hover-active',
    })
  }
}
