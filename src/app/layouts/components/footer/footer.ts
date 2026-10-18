import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styles: ``,
})
export class Footer {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
}
