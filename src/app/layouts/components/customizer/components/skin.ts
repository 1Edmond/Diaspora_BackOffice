import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'
import { CustomizationOptionType } from '@layouts/components/customizer/customizer'

const auroraImg = 'assets/images/layouts/skin-aurora.png'
const bronzeImg = 'assets/images/layouts/skin-bronze.png'
const classicImg = 'assets/images/layouts/skin-classic.png'
const crystalImg = 'assets/images/layouts/skin-crystal.png'
const defaultImg = 'assets/images/layouts/skin-default.png'
const edgeImg = 'assets/images/layouts/skin-edge.png'
const elegantImg = 'assets/images/layouts/skin-elegant.png'
const flatImg = 'assets/images/layouts/skin-flat.png'
const galaxyImg = 'assets/images/layouts/skin-galaxy.png'
const goldImg = 'assets/images/layouts/skin-gold.png'
const luxeImg = 'assets/images/layouts/skin-luxe.png'
const materialImg = 'assets/images/layouts/skin-material.png'
const matrixImg = 'assets/images/layouts/skin-matrix.png'
const maxImg = 'assets/images/layouts/skin-max.png'
const minimalImg = 'assets/images/layouts/skin-minimal.png'
const modernImg = 'assets/images/layouts/skin-modern.png'
const monoImg = 'assets/images/layouts/skin-mono.png'
const neoImg = 'assets/images/layouts/skin-neo.png'
const neonImg = 'assets/images/layouts/skin-neon.png'
const novaImg = 'assets/images/layouts/skin-nova.png'
const orbitImg = 'assets/images/layouts/skin-orbit.png'
const pixelImg = 'assets/images/layouts/skin-pixel.png'
const prismImg = 'assets/images/layouts/skin-prism.png'
const retroImg = 'assets/images/layouts/skin-retro.png'
const saasImg = 'assets/images/layouts/skin-saas.png'
const silverImg = 'assets/images/layouts/skin-silver.png'
const sodiumImg = 'assets/images/layouts/skin-sodium.png'
const softImg = 'assets/images/layouts/skin-soft.png'
const vaporImg = 'assets/images/layouts/skin-vapor.png'
const vividImg = 'assets/images/layouts/skin-vivid.png'
const xenonImg = 'assets/images/layouts/skin-xenon.png'
const zenImg = 'assets/images/layouts/skin-zen.png'

@Component({
  selector: 'skin',
  imports: [],
  template: `
    <div class="p-3 border-bottom border-dashed">
      <h5 class="mb-3 fw-bold">Select Theme</h5>
      <div class="row g-3">
        @for (item of skinOptions; track item.value) {
          <div class="col-6">
            <div class="form-check card-radio">
              <input class="form-check-input" type="radio" name="data-skin" [id]="'skin-' + item.value" [value]="item.value" [checked]="layout.skin === item.value" (change)="layout.updateLayout({ skin: item.value })" />
              <label class="form-check-label p-0 w-100" [for]="'skin-' + item.value">
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
export class Skin {
  constructor(public layout: LayoutService) {}

  skinOptions: CustomizationOptionType[] = [
    { value: 'default', image: defaultImg },
    { value: 'minimal', image: minimalImg },
    { value: 'modern', image: modernImg },
    { value: 'material', image: materialImg },
    { value: 'saas', image: saasImg },
    { value: 'flat', image: flatImg },
    { value: 'galaxy', image: galaxyImg },
    { value: 'retro', image: retroImg },
    { value: 'neon', image: neonImg },
    { value: 'pixel', image: pixelImg },
  ]

  protected readonly toPascalCase = toPascalCase
}
