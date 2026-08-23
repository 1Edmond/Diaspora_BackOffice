import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'
import { CustomizationOptionType } from '@layouts/components/customizer/customizer'

const fluidImg = 'assets/images/layouts/width-fluid.png'
const boxedImg = 'assets/images/layouts/width-boxed.png'

@Component({
  selector: 'width',
  imports: [],
  template: `
    <div class="p-3 border-bottom border-dashed">
      <h5 class="mb-3 fw-bold">Layout Width</h5>
      <div class="row g-3">
        @for (item of widthOptions; track item.value) {
          <div class="col-4">
            <div class="form-check sidebar-setting card-radio">
              <input class="form-check-input" type="radio" name="data-layout-width" [id]="'layout-width-' + item.value" [value]="item.value" [checked]="layout.width === item.value" (change)="layout.updateLayout({ width: item.value })" />
              <label class="form-check-label p-0 w-100" [for]="'layout-width-' + item.value">
                <img [src]="item.image" alt="layout-img" class="img-fluid" />
              </label>
            </div>
            <h5 class="text-center text-muted mt-2 mb-0">
              {{ toPascalCase(item.value) }}
            </h5>
          </div>
        }
      </div>
    </div>
  `,
})
export class Width {
  constructor(public layout: LayoutService) {}

  widthOptions: CustomizationOptionType[] = [
    { value: 'fluid', image: fluidImg },
    { value: 'boxed', image: boxedImg },
  ]

  protected readonly toPascalCase = toPascalCase
}
