import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PasswordStrengthBar } from '@app/components/password-strength-bar/password-strength-bar'
import { NgOtpInputComponent } from 'ng-otp-input'

@Component({
  selector: 'app-new-pass',
  imports: [NgOtpInputComponent, PasswordStrengthBar, FormsModule, RouterLink, Icon],
  templateUrl: './new-pass.html',
  styles: ``,
})
export class NewPass {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
  password: string = ''
}
