import { Component, Input, type OnChanges, type SimpleChanges } from '@angular/core'

@Component({
  selector: 'app-password-strength-bar',
  imports: [],
  templateUrl: './password-strength-bar.html',
  styles: ``,
})
export class PasswordStrengthBar implements OnChanges {
  @Input() password: string = ''
  passwordStrength: number = 0
  strengthBars = new Array(4)

  private calculatePasswordStrength(password: string): number {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[\W_]/.test(password)) strength++
    return strength
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['password']) {
      this.passwordStrength = this.calculatePasswordStrength(this.password)
    }
  }
}
