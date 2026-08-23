import { Component } from '@angular/core'

@Component({
  selector: 'app-logo',
  imports: [],
  template: `
    <a routerLink="/" class="logo">
      <span class="logo logo-light">
        <span class="logo-lg"><img src="assets/images/logo.png" alt="logo" /></span>
        <span class="logo-sm"><img src="assets/images/logo-sm.png" alt="small logo" /></span>
      </span>

      <span class="logo logo-dark">
        <span class="logo-lg"><img src="assets/images/logo-black.png" alt="dark logo" /></span>
        <span class="logo-sm"><img src="assets/images/logo-sm.png" alt="small logo" /></span>
      </span>
    </a>
  `,
  styles: ``,
})
export class AppLogo {}
