import { Component, OnDestroy, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { LayoutService } from '@core/services/layout.service'
import { Footer } from '@layouts/components/footer/footer'
import { Navbar } from '@layouts/components/navbar/navbar'
import { Sidenav } from '@layouts/components/sidenav/sidenav'
import { Topbar } from '@layouts/components/topbar/topbar'
import { debounceTime, fromEvent, Subscription } from 'rxjs'

@Component({
  selector: 'app-horizontal-layout',
  imports: [Footer, RouterOutlet, Topbar, Navbar, Sidenav],
  template: `
    <div class="wrapper">
      <app-topbar />

      @if (!isMobileSidebarVisible) {
        <app-navbar />
      }

      @if (isMobileSidebarVisible) {
        <app-sidenav />
      }

      <div class="content-page">
        <router-outlet />

        <app-footer />
      </div>
    </div>
  `,
})
export class HorizontalLayout implements OnInit, OnDestroy {
  constructor(public layout: LayoutService) {}

  resizeSubscription!: Subscription

  isMobileSidebarVisible = false
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
    if (width < 992) {
      this.isMobileSidebarVisible = true
      this.layout.updateLayout({ sidenavSize: 'offcanvas' })
    } else {
      this.isMobileSidebarVisible = false
      this.layout.updateLayout({
        sidenavSize: this.defaultSidenavSize,
      })
    }
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe()
  }
}
