import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-delete-account',
  imports: [RouterLink],
  templateUrl: './delete-account.html',
  styles: ``,
})
export class DeleteAccount {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
}
