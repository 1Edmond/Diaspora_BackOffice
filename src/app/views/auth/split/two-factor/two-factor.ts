import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgOtpInputComponent } from 'ng-otp-input'

@Component({
  selector: 'app-two-factor',
  imports: [RouterLink, NgOtpInputComponent],
  templateUrl: './two-factor.html',
  styles: ``,
})
export class TwoFactor {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
}
