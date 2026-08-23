import { Component, OnDestroy, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { LayoutService } from '@core/services/layout.service'
import { Footer } from '@layouts/components/footer/footer'
import { Sidenav } from '@layouts/components/sidenav/sidenav'
import { Topbar } from '@layouts/components/topbar/topbar'
import { debounceTime, fromEvent, Subscription } from 'rxjs'

@Component({
  selector: 'app-vertical-layout',
  imports: [RouterOutlet, Sidenav, Topbar, Footer],
  template: `
    <div class="wrapper">
      <app-sidenav />

      <app-topbar />

      <div class="content-page">
        <router-outlet />

        <app-footer />
      </div>
    </div>
  `,
})
export class VerticalLayout implements OnInit, OnDestroy {
  constructor(public layout: LayoutService) {}

  resizeSubscription!: Subscription
  private defaultSidenavSize!: string

  ngOnInit() {
    this.defaultSidenavSize = this.layout.sidenavSize
    this.onResize()

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.onResize())
  }

  onResize(): void {
    const width = window.outerWidth
    const currentSize = this.layout.sidenavSize
    if (width <= 768) {
      this.layout.updateLayout({ sidenavSize: 'offcanvas' })
    } else if (width <= 1140 && currentSize !== 'offcanvas') {
      this.layout.updateLayout({ sidenavSize: 'condensed' })
    } else {
      this.layout.updateLayout({
        sidenavSize: this.defaultSidenavSize,
      })
    }
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe()
  }
}
