import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'
import { CustomizationOptionType } from '@layouts/components/customizer/customizer'

const darkImg = 'assets/images/layouts/topbar-color-dark.png'
const gradientImg = 'assets/images/layouts/topbar-color-gradient.png'
const grayImg = 'assets/images/layouts/topbar-color-gray.png'
const lightImg = 'assets/images/layouts/topbar-color-light.png'

@Component({
  selector: 'topbar-color',
  imports: [],
  template: `
    <div class="p-3 border-bottom border-dashed">
      <h5 class="mb-3 fw-bold">Topbar Color</h5>
      <div class="row g-3">
        @for (item of topBarColorOptions; track item.value) {
          <div class="col-4">
            <div class="form-check card-radio">
              <input class="form-check-input" type="radio" name="data-topbar-color" [id]="'topbar-color-' + item.value" [value]="item.value" [checked]="layout.topbarColor === item.value" (change)="layout.updateLayout({ topbarColor: item.value })" />
              <label class="form-check-label p-0 w-100" [for]="'topbar-color-' + item.value">
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
export class TopbarColor {
  constructor(public layout: LayoutService) {}

  topBarColorOptions: CustomizationOptionType[] = [
    { value: 'light', image: lightImg },
    { value: 'dark', image: darkImg },
    { value: 'gray', image: grayImg },
    { value: 'gradient', image: gradientImg },
  ]

  protected readonly toPascalCase = toPascalCase
}
