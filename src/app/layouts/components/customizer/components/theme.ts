import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'
import { CustomizationOptionType } from '@layouts/components/customizer/customizer'

const darkImg = 'assets/images/layouts/theme-dark.png'
const lightImg = 'assets/images/layouts/theme-light.png'
const systemImg = 'assets/images/layouts/theme-system.png'

@Component({
  selector: 'theme',
  imports: [],
  template: `
    <div class="p-3 border-bottom border-dashed">
      <h5 class="mb-3 fw-bold">Color Scheme</h5>
      <div class="row">
        @for (item of themeOptions; track item.value) {
          <div class="col-4">
            <div class="form-check card-radio">
              <input class="form-check-input" type="radio" name="data-bs-theme" [id]="'theme-' + item.value" [value]="item.value" [checked]="layout.theme === item.value" (change)="layout.updateLayout({ theme: item.value })" />
              <label class="form-check-label p-0 w-100" [for]="'theme-' + item.value">
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
export class Theme {
  constructor(public layout: LayoutService) {}

  themeOptions: CustomizationOptionType[] = [
    { value: 'light', image: lightImg },
    { value: 'dark', image: darkImg },
    { value: 'system', image: systemImg },
  ]

  protected readonly toPascalCase = toPascalCase
}
