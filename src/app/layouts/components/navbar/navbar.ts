import { Component } from '@angular/core'
import { AppMenu } from '@layouts/components/navbar/components/app-menu'

@Component({
  selector: 'app-navbar',
  imports: [AppMenu],
  template: `
    <header class="topnav">
      <nav class="navbar navbar-expand-lg">
        <nav class="container-fluid">
          <app-menu-navbar />
        </nav>
      </nav>
    </header>
  `,
})
export class Navbar {}
