import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'
import { CustomizationOptionType } from '@layouts/components/customizer/customizer'

const verticalImg = 'assets/images/layouts/orientation-vertical.png'
const horizontalImg = 'assets/images/layouts/orientation-horizontal.png'

@Component({
  selector: 'orientation',
  imports: [],
  template: `
    <div class="p-3 border-bottom border-dashed">
      <h5 class="mb-3 fw-bold">Orientation</h5>
      <div class="row g-3">
        @for (item of orientationOptions; track item.value) {
          <div class="col-4">
            <div class="form-check card-radio">
              <input class="form-check-input" type="radio" name="data-layout" [id]="'orientation-' + item.value" [value]="item.value" [checked]="layout.orientation === item.value" (change)="layout.updateLayout({ orientation: item.value })" />
              <label class="form-check-label p-0 w-100" [for]="'orientation-' + item.value">
                <img [src]="item.image" alt="layout-img" class="img-fluid" />
              </label>
            </div>
            <h5 class="fs-sm text-center text-muted mt-2 mb-0">{{ toPascalCase(item.value) }}</h5>
          </div>
        }
      </div>
    </div>
  `,
})
export class Orientation {
  constructor(public layout: LayoutService) {}

  orientationOptions: CustomizationOptionType[] = [
    { value: 'vertical', image: verticalImg },
    { value: 'horizontal', image: horizontalImg },
  ]

  protected readonly toPascalCase = toPascalCase
}
