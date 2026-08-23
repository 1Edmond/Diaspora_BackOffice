import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'monochrome-toggler',
  imports: [Icon],
  template: `
    <div id="monochrome-toggler" class="topbar-item">
      <button class="topbar-link" type="button" (click)="this.layout.toggleMonochrome()">
        <span class="topbar-link-icon">
          <app-icon icon="palette"></app-icon>
        </span>
      </button>
    </div>
  `,
  styles: ``,
})
export class MonochromeToggler {
  constructor(public layout: LayoutService) {}
}
