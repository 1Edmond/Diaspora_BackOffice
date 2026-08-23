import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core'
import { RouterLink } from '@angular/router'
import { LayoutService } from '@core/services/layout.service'

import { ThemeDropdown } from './components/theme-dropdown'
import { ModulesDropdown } from './components/modules-dropdown'
import { NotificationDropdownPeople } from './components/notification-dropdown-people'
import { FullscreenToggler } from './components/fullscreen-toggler'
import { MonochromeToggler } from './components/monochrome-toggler'
import { CustomizerToggler } from './components/customizer-toggler'
import { MenuToggler } from './components/menu-toggler'
import { SimpleUserDropdown } from './components/simple-user-dropdown'
import { SearchBoxRoundedRight } from './components/search-box-rounded-right'
import { ProfileSelector } from './components/profile-selector'

@Component({
  selector: 'app-topbar',
  imports: [
    RouterLink,
    ThemeDropdown,
    NotificationDropdownPeople,
    FullscreenToggler,
    MonochromeToggler,
    SimpleUserDropdown,
    CustomizerToggler,
    MenuToggler,
    SearchBoxRoundedRight,
    ModulesDropdown,
    ProfileSelector,
  ],
  template: `
    <header class="app-topbar">
      <div class="container-fluid topbar-menu">
        <div class="d-flex align-items-center gap-2">
          <!-- Topbar Brand Logo -->
          <div class="logo-topbar">
            <!-- Logo light -->
            <a routerLink="/" class="logo-light">
              <span class="logo-lg">
                <img src="assets/images/logo.png" alt="logo" />
              </span>
              <span class="logo-sm">
                <img src="assets/images/logo-sm.png" alt="small logo" />
              </span>
            </a>

            <!-- Logo Dark -->
            <a routerLink="/" class="logo-dark">
              <span class="logo-lg">
                <img src="assets/images/logo-black.png" alt="dark logo" />
              </span>
              <span class="logo-sm">
                <img src="assets/images/logo-sm.png" alt="small logo" />
              </span>
            </a>
          </div>

          <menu-toggler />
        </div>

        <div class="d-flex align-items-center gap-2">
          <search-box-rounded-right class="d-none d-xl-flex" />

          <profile-selector class="d-flex" />

          <theme-dropdown class="d-none d-sm-flex" />

          <modules-dropdown class="d-none d-xl-flex" />

          <notification-dropdown-people />

          <fullscreen-toggler class="d-none d-md-flex" />

          <monochrome-toggler class="d-none d-xl-flex" />

          <customizer-toggler class="d-none d-sm-flex" />

          <simple-user-dropdown />
        </div>
      </div>
    </header>
  `,
})
export class Topbar implements AfterViewInit {
  constructor(
    public layout: LayoutService,
    private el: ElementRef
  ) {}

  ngAfterViewInit() {
    this.handleScroll()
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.handleScroll()
  }

  handleScroll() {
    const header: HTMLElement = this.el.nativeElement.querySelector('.app-topbar')

    if (!header) return

    if (window.scrollY >= 50) {
      header.classList.add('topbar-active')
    } else {
      header.classList.remove('topbar-active')
    }
  }
}
