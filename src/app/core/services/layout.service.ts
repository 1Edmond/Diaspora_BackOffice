import { DOCUMENT, isPlatformBrowser } from '@angular/common'
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { ActivatedRoute, CanActivate } from '@angular/router'
import { Customizer } from '@layouts/components/customizer/customizer'
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap'
import { BehaviorSubject } from 'rxjs'

const STORAGE_KEY = '__THEME_CONFIG__'

export type LayoutState = {
  skin: string
  theme: string
  orientation: string
  topbarColor: string
  sidenavSize: string
  sidenavColor: string
  sidenavUser: boolean
  width: string
  position: string
  direction: 'ltr' | 'rtl'
  monochrome: boolean
}

const INIT_STATE: LayoutState = {
  skin: 'default',
  theme: 'light',
  orientation: 'vertical',
  sidenavSize: 'default',
  sidenavColor: 'light',
  sidenavUser: false,
  topbarColor: 'dark',
  width: 'fluid',
  position: 'fixed',
  direction: 'ltr',
  monochrome: false,
}

@Injectable({ providedIn: 'root' })
export class LayoutService implements CanActivate {
  private isBrowser: boolean

  constructor(
    private offcanvasService: NgbOffcanvas,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: object,
    private activatedRoute: ActivatedRoute
  ) {
    this.isBrowser = isPlatformBrowser(platformId)
    if (this.isBrowser) {
      this.applyAttributes()
      this.applyQueryParams()
      this.persistToStorage()
    }
  }

  state = signal<LayoutState>(this.loadInitialState())

  private html = document.documentElement

  private layoutStateSubject = new BehaviorSubject<LayoutState>(this.state())
  canActivate(): boolean {
    this.state.set(this.loadInitialState())
    this.applyAttributes()
    return true
  }

  readonly layoutState$ = toObservable(this.state)

  private loadInitialState(): LayoutState {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : INIT_STATE
    } catch {
      return INIT_STATE
    }
  }

  private persistToStorage() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()))
  }

  setHtmlAttribute(attr: string, value: string) {
    this.document.documentElement.setAttribute(attr, value)
  }

  private getSystemTheme(): 'light' | 'dark' {
    if (this.isBrowser) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  private applyAttributes(): void {
    const current = this.state()
    this.setHtmlAttribute('dir', current.direction)
    this.setHtmlAttribute('data-skin', current.skin)
    this.setHtmlAttribute('data-bs-theme', current.theme === 'system' ? this.getSystemTheme() : current.theme)
    this.setHtmlAttribute('data-layout-position', current.position)
    this.setHtmlAttribute('data-layout-width', current.width)
    this.setHtmlAttribute('data-topbar-color', current.topbarColor)
    this.setHtmlAttribute('data-menu-color', current.sidenavColor)
    this.setHtmlAttribute('data-sidenav-size', current.sidenavSize)
    this.setHtmlAttribute('data-sidenav-user', String(current.sidenavUser))
    this.setHtmlAttribute('data-layout', current.orientation === 'horizontal' ? 'topnav' : '')
    if (current.monochrome) {
      this.html.classList.add('monochrome')
    } else {
      this.html.classList.remove('monochrome')
    }
  }

  private applyQueryParams(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const layoutUpdates: Partial<LayoutState> = {}

      Object.keys(params).forEach((key) => {
        if (key in INIT_STATE) {
          let value: any = params[key]

          if (value === 'true') value = true
          if (value === 'false') value = false

          if (key === 'sidenavSize') {
            const allowed = ['default', 'compact', 'condensed', 'on-hover', 'on-hover-active', 'offcanvas']
            if (!allowed.includes(value)) {
              value = INIT_STATE.sidenavSize
            }
          }

          layoutUpdates[key as keyof LayoutState] = value
        }
      })

      if (Object.keys(layoutUpdates).length) {
        this.updateLayout(layoutUpdates)
      }
    })
  }

  get direction() {
    return this.state().direction
  }

  get skin() {
    return this.state().skin
  }

  get theme() {
    return this.state().theme
  }

  get orientation() {
    return this.state().orientation
  }

  get position() {
    return this.state().position
  }

  get width() {
    return this.state().width
  }

  get topbarColor() {
    return this.state().topbarColor
  }

  get sidenavColor() {
    return this.state().sidenavColor
  }

  get sidenavSize() {
    return this.state().sidenavSize
  }

  get sidenavUser() {
    return this.state().sidenavUser
  }

  get monochrome() {
    return this.state().monochrome
  }

  updateLayout(newState: Partial<LayoutState>): void {
    this.state.update((s) => ({
      ...s,
      ...newState,
    }))
    this.applyAttributes()
    this.persistToStorage()
  }

  reset(): void {
    this.state.set(INIT_STATE)
    this.applyAttributes()
    this.persistToStorage()

    // required to trigger change detection (for charts)
    this.layoutStateSubject.next(this.state())
  }

  toggleMobileMenu(): void {
    this.document.documentElement.classList.toggle('sidebar-enable')
    if (this.document.documentElement.classList.contains('sidebar-enable')) {
      this.showBackdrop()
    } else {
      this.hideBackdrop()
    }
  }

  showBackdrop() {
    const backdrop = document.createElement('div')
    backdrop.id = 'custom-backdrop'
    backdrop.className = 'offcanvas-backdrop fade show'
    document.body.appendChild(backdrop)
    document.body.style.overflow = 'hidden'
    if (window.outerWidth > 767) {
      document.body.style.paddingRight = '15px'
    }
    backdrop.addEventListener('click', () => {
      this.html.classList.remove('sidebar-enable')
      this.hideBackdrop()
    })
  }

  hideBackdrop() {
    const backdrop = document.getElementById('custom-backdrop')
    if (backdrop) {
      document.body.removeChild(backdrop)
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }

  openCustomizer(): void {
    this.offcanvasService.open(Customizer, {
      position: 'end',
      backdrop: true,
      scroll: true,
    })
  }

  toggleMonochrome(persist = true): void {
    const monochrome = !this.state().monochrome
    if (monochrome) {
      this.html.classList.add('monochrome')
    } else {
      this.html.classList.remove('monochrome')
    }
    if (persist) {
      this.state.update((s) => ({ ...s, monochrome: monochrome }))
      this.persistToStorage()
    }
    this.layoutStateSubject.next({ ...this.state(), monochrome: monochrome })
  }

  toggleSidebar(): void {
    const currentSize = this.state().sidenavSize
    const isCollapsed = currentSize === 'offcanvas' || currentSize === 'condensed'
    this.updateLayout({ sidenavSize: isCollapsed ? 'default' : 'offcanvas' })
  }
}
