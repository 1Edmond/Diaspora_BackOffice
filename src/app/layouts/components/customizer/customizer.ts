import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { LayoutService } from '@core/services/layout.service'
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { Dir } from './components/dir'
import { Orientation } from './components/orientation'
import { Position } from './components/position'
import { SidenavColor } from './components/sidenav-color'
import { SidenavSize } from './components/sidenav-size'
import { SidenavUser } from './components/sidenav-user'
import { Skin } from './components/skin'
import { Theme } from './components/theme'
import { TopbarColor } from './components/topbar-color'
import { Width } from './components/width'

export type CustomizationOptionType = {
  value: string
  image: string
}

@Component({
  selector: 'app-customizer',
  imports: [SimplebarAngularModule, Icon, Skin, Theme, Orientation, TopbarColor, SidenavColor, SidenavSize, Width, Position, SidenavUser, Dir],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="d-flex justify-content-between text-bg-primary gap-2 p-3" style="background-image: url(assets/images/settings-bg.png);">
      <div>
        <h5 class="mb-1 fw-bold text-white text-uppercase">Admin Customizer</h5>
        <p class="text-white text-opacity-75 fst-italic fw-medium mb-0">Easily configure layout, styles, and preferences for your admin interface.</p>
      </div>

      <div class="flex-grow-0">
        <button (click)="close()" type="button" class="btn btn-sm bg-white bg-opacity-25 text-white rounded-circle btn-icon">
          <app-icon icon="x" class="fs-lg"></app-icon>
        </button>
      </div>
    </div>

    <ngx-simplebar class="offcanvas-body theme-customizer-bar p-0 h-100" id="theme-c-ng" style="max-height: 80vh">
      <skin />

      <theme />

      <orientation />

      <topbar-color />

      <sidenav-color />

      <sidenav-size />

      <width />

      <app-dir />

      <position />

      <sidenav-user />
    </ngx-simplebar>

    <div class="offcanvas-footer border-top p-3 text-center">
      <div class="row justify-content-end">
        <div class="col-6">
          <a href="https://1.envato.market/uboldadmin" target="_blank" rel="noopener noreferrer" class="btn btn-success fw-semibold py-2 w-100"><iconify-icon icon="tabler:basket" class="me-2 fs-md"></iconify-icon> Buy Now</a>
        </div>
        <div class="col-6">
          <button (click)="layout.reset()" type="button" class="btn btn-danger fw-semibold py-2 w-100" id="reset-layout">
            <iconify-icon icon="tabler:refresh" class="me-2 fs-md"></iconify-icon>
            Reset
          </button>
        </div>
      </div>
    </div>
  `,
})
export class Customizer {
  constructor(
    public activeOffcanvas: NgbActiveOffcanvas,
    public layout: LayoutService
  ) {}

  close(): void {
    this.activeOffcanvas.close()
  }
}
