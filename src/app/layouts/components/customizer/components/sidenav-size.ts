import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'
import { CustomizationOptionType } from '@layouts/components/customizer/customizer'

const defaultImg = 'assets/images/layouts/sidenav-size-default.png'
const onHoverActiveImg = 'assets/images/layouts/sidenav-size-on-hover-active.png'
const compactImg = 'assets/images/layouts/sidenav-size-compact.png'
const offcanvasImg = 'assets/images/layouts/sidenav-size-offcanvas.png'
const onHoverImg = 'assets/images/layouts/sidenav-size-on-hover.png'
const condensedImg = 'assets/images/layouts/sidenav-size-condensed.png'

@Component({
  selector: 'sidenav-size',
  imports: [],
  template: `
    <div class="p-3 border-bottom border-dashed">
      <h5 class="mb-3 fw-bold">Sidebar Size</h5>
      <div class="row g-3">
        @for (item of sidenavSizeOptions; track item.value) {
          <div class="col-4">
            <div class="form-check sidebar-setting card-radio">
              <input class="form-check-input" type="radio" name="data-sidenav-size" [id]="'sidenav-size-' + item.value" [value]="item.value" [checked]="layout.sidenavSize === item.value" (change)="layout.updateLayout({ sidenavSize: item.value })" />
              <label class="form-check-label p-0 w-100" [for]="'sidenav-size-' + item.value">
                <img [src]="item.image" alt="layout-img" class="img-fluid" />
              </label>
            </div>
            <h5 class="text-center text-muted mt-2 mb-0">{{ toPascalCase(item.value) }}</h5>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class SidenavSize {
  constructor(public layout: LayoutService) {}

  sidenavSizeOptions: CustomizationOptionType[] = [
    { value: 'default', image: defaultImg },
    { value: 'compact', image: compactImg },
    { value: 'condensed', image: condensedImg },
    { value: 'on-hover', image: onHoverImg },
    { value: 'on-hover-active', image: onHoverActiveImg },
    { value: 'offcanvas', image: offcanvasImg },
  ]

  protected readonly toPascalCase = toPascalCase
}
