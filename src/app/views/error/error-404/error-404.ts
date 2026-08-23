import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-error-404',
  imports: [RouterLink],
  templateUrl: './error-404.html',
  styles: ``,
})
export class Error404 {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
}
