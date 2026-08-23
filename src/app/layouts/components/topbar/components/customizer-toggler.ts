import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { LayoutService } from '@core/services/layout.service'

@Component({
  selector: 'customizer-toggler',
  imports: [Icon],
  template: `
    <div class="topbar-item">
      <button class="topbar-link btn-theme-setting" type="button" (click)="layout.openCustomizer()">
        <app-icon icon="settings" class="topbar-link-icon"></app-icon>
      </button>
    </div>
  `,
  styles: ``,
})
export class CustomizerToggler {
  constructor(public layout: LayoutService) {}
}
