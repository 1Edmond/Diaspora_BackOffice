import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'

@Component({
  selector: 'app-lock-screen',
  imports: [RouterLink, Icon],
  templateUrl: './lock-screen.html',
  styles: ``,
})
export class LockScreen {
  currentYear = currentYear
  name = META_DATA.name
  username = META_DATA.username
  author = META_DATA.author
}
