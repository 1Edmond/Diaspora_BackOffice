import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgOtpInputComponent } from 'ng-otp-input'

@Component({
  selector: 'app-login-pin',
  imports: [RouterLink, NgOtpInputComponent],
  templateUrl: './login-pin.html',
  styles: ``,
})
export class LoginPin {
  currentYear = currentYear
  name = META_DATA.name
  username = META_DATA.username
  author = META_DATA.author
}
