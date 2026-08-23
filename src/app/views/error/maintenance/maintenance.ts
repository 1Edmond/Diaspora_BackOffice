import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-maintenance',
  imports: [RouterLink],
  templateUrl: './maintenance.html',
  styles: ``,
})
export class Maintenance {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
}
