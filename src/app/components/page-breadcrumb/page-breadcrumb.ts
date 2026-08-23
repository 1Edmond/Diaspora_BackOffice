import { META_DATA } from '@/app/constants'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-page-breadcrumb',
  imports: [RouterLink],
  templateUrl: './page-breadcrumb.html',
  styles: ``,
})
export class PageBreadcrumb {
  name = META_DATA.name
  @Input() title: string = 'Welcome!'
  @Input() subTitle: string | null = null
}
