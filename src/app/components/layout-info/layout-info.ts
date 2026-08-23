import { Component, Input } from '@angular/core'
import { Icon } from '../icon/icon'

@Component({
  selector: 'app-layout-info',
  imports: [Icon],
  templateUrl: './layout-info.html',
  styles: ``,
})
export class LayoutInfo {
  @Input() option: string = ''
  @Input() value: string = ''
}
