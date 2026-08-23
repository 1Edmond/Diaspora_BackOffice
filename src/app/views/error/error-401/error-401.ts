import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-error-401',
  imports: [RouterLink],
  templateUrl: './error-401.html',
  styles: ``,
})
export class Error401 {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
}
