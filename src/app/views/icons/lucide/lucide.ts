import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { lucideIconData } from './data'

@Component({
  selector: 'app-lucide',
  imports: [PageBreadcrumb],
  templateUrl: './lucide.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Lucide {
  lucideIconData = lucideIconData
}
