import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'
import { CustomizationOptionType } from '@layouts/components/customizer/customizer'

const lightImg = 'assets/images/layouts/sidenav-color-light.png'
const darkImg = 'assets/images/layouts/sidenav-color-dark.png'
const gradientImg = 'assets/images/layouts/sidenav-color-gradient.png'
const grayImg = 'assets/images/layouts/sidenav-color-gray.png'
const imageImg = 'assets/images/layouts/sidenav-color-image.png'

@Component({
  selector: 'sidenav-color',
  imports: [],
  template: `
    <div class="p-3 border-bottom border-dashed">
      <h5 class="mb-3 fw-bold">Sidenav Color</h5>
      <div class="row g-3">
        @for (item of sidenavColorOptions; track item.value) {
          <div class="col-4">
            <div class="form-check sidebar-setting card-radio">
              <input class="form-check-input" type="radio" name="data-menu-color" [id]="'sidenav-color-' + item.value" [value]="item.value" [checked]="layout.sidenavColor === item.value" (change)="layout.updateLayout({ sidenavColor: item.value })" />
              <label class="form-check-label p-0 w-100" [for]="'sidenav-color-' + item.value">
                <img [src]="item.image" alt="layout-img" class="img-fluid" />
              </label>
            </div>
            <h5 class="fs-sm text-center text-muted mt-2 mb-0">{{ toPascalCase(item.value) }}</h5>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class SidenavColor {
  constructor(public layout: LayoutService) {}

  sidenavColorOptions: CustomizationOptionType[] = [
    { value: 'light', image: lightImg },
    { value: 'dark', image: darkImg },
    { value: 'gray', image: grayImg },
    { value: 'gradient', image: gradientImg },
    { value: 'image', image: imageImg },
  ]

  protected readonly toPascalCase = toPascalCase
}
