import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-card-with-action',
  standalone: true,
  imports: [NgbCollapse],
  templateUrl: './card-with-action.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CardWithAction {
  @Input() title!: string
  @Input() isTogglable?: boolean
  @Input() isReloadable?: boolean
  @Input() isCloseable?: boolean
  @Input() bodyClass?: string
  @Input() className?: string
  isCollapsed = false
  isReloading = false
  isVisible = true

  reload() {
    this.isReloading = true
    setTimeout(() => (this.isReloading = false), 1500)
  }

  close() {
    this.isVisible = false
  }
}
