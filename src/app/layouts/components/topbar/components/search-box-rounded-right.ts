import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'

@Component({
  selector: 'search-box-rounded-right',
  imports: [Icon],
  template: `
    <div id="search-box-rounded-right" class="app-search">
      <input type="search" class="form-control rounded-pill topbar-search" name="search" placeholder="Quick Search..." />
      <app-icon icon="search" class="app-search-icon text-muted"></app-icon>
    </div>
  `,
  styles: ``,
})
export class SearchBoxRoundedRight {}
