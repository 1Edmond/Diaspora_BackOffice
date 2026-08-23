import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'loot-box',
  imports: [RouterLink, Icon, NgbDropdownModule],
  template: `
    <div id="loot-box" class="topbar-item">
      <div ngbDropdown>
        <a [routerLink]="[]" class="topbar-link btn shadow-none btn-link drop-arrow-none px-2" ngbDropdownToggle>
          Loot Box
          <app-icon icon="chevron-down" class="ms-1"></app-icon>
        </a>
        <div ngbDropdownMenu>
          <a [routerLink]="[]" ngbDropdownItem>
            <app-icon icon="circle-user-round" class="me-1 fs-lg align-middle"></app-icon>
            <span class="align-middle">Secret Identity</span>
          </a>
          <a [routerLink]="[]" ngbDropdownItem>
            <app-icon icon="bolt" class="me-1 fs-lg align-middle"></app-icon>
            <span class="align-middle">Control Panel</span>
          </a>
          <a [routerLink]="[]" ngbDropdownItem>
            <app-icon icon="headset" class="me-1 fs-lg align-middle"></app-icon>
            <span class="align-middle">Help Squad</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class LootBox {}
