import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, TemplateRef } from '@angular/core'
import { NgbRating, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-rating',
  imports: [NgbRating],
  providers: [NgbRatingConfig],
  templateUrl: './rating.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Rating {
  @Input() rate!: number
  @Input() max: number = 5
  @Input() readonly: boolean = true
  @Input() resettable: boolean = false
  @Input() starTemplate?: TemplateRef<any>
  @Input() disabled: boolean = false
  @Input() tabindex: number = 0
}
