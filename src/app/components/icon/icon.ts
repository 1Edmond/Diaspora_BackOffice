import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Icon {
  @Input({ required: true }) icon!: string
  @Input() prefix: string = 'lucide:'
  @Input() size?: string
  @Input() color?: string
  @Input() class?: string

  get fullIcon(): string {
    return this.prefix + this.icon
  }
}
