import { Component, DOCUMENT, Inject, signal } from '@angular/core'
import { Icon } from '@app/components/icon/icon'

type FullScreenTypes = {
  requestFullscreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  mozCancelFullScreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
  webkitExitFullscreen?: () => Promise<void>
  mozFullScreenElement?: Element
  msFullscreenElement?: Element
  webkitFullscreenElement?: Element
  msRequestFullscreen?: () => Promise<void>
  mozRequestFullscreen?: () => Promise<void>
  webkitRequestFullscreen?: () => Promise<void>
}

@Component({
  selector: 'fullscreen-toggler',
  imports: [Icon],
  template: `
    <div id="fullscreen-toggler" class="topbar-item">
      <button class="topbar-link" type="button" data-toggle="fullscreen" (click)="fullscreen()">
        @if (!isFullscreen()) {
          <app-icon icon="maximize" class="topbar-link-icon"></app-icon>
        } @else {
          <app-icon icon="minimize" class="topbar-link-icon"></app-icon>
        }
      </button>
    </div>
  `,
  styles: ``,
})
export class FullscreenToggler {
  constructor(@Inject(DOCUMENT) private document: Document & FullScreenTypes) {
    this.element = this.document.documentElement as FullScreenTypes
  }

  element!: FullScreenTypes
  isFullscreen = signal(false)

  fullscreen() {
    document.body.classList.toggle('fullscreen-active')
    if (!document.fullscreenElement && !this.element.mozFullScreenElement && !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen()
      } else if (this.element.mozRequestFullScreen) {
        this.element.mozRequestFullScreen()
      } else if (this.element.webkitRequestFullscreen) {
        this.element.webkitRequestFullscreen()
      } else if (this.element.msRequestFullscreen) {
        this.element.msRequestFullscreen()
      }
      this.isFullscreen.set(true)
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen()
      } else if (this.document.mozCancelFullScreen) {
        this.document.mozCancelFullScreen()
      } else if (this.document.webkitExitFullscreen) {
        this.document.webkitExitFullscreen()
      } else if (this.document.msExitFullscreen) {
        this.document.msExitFullscreen()
      }
      this.isFullscreen.set(false)
    }
  }
}
