import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { CountUpDirective } from 'ngx-countup'
import { StateType } from '../../data'

@Component({
  selector: 'statistics-widget',
  imports: [CountUpDirective],
  templateUrl: './statistics-widget.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StatisticsWidget {
  @Input() item!: StateType
  Number = Number
}
