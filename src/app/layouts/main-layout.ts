import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { LayoutService } from '@core/services/layout.service'
import { HorizontalLayout } from '@layouts/horizontal-layout'
import { VerticalLayout } from '@layouts/vertical-layout'

@Component({
  selector: 'app-main-layout',
  imports: [VerticalLayout, RouterOutlet, HorizontalLayout],
  template: ` @if (layout.orientation === 'vertical') {
      <app-vertical-layout>
        <router-outlet />
      </app-vertical-layout>
    }

    @if (layout.orientation === 'horizontal') {
      <app-horizontal-layout>
        <router-outlet />
      </app-horizontal-layout>
    }`,
})
export class MainLayout {
  constructor(public layout: LayoutService) {}
}
