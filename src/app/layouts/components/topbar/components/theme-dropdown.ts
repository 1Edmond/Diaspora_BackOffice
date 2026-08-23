import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { LayoutService } from '@core/services/layout.service'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

type ThemeType = {
  label: string
  value: string
  icon: string
}

@Component({
  selector: 'theme-dropdown',
  imports: [Icon, NgbDropdownModule],
  template: `
    <div class="topbar-item">
      <div ngbDropdown placement="bottom-end">
        <button class="topbar-link drop-arrow-none" type="button" ngbDropdownToggle>
          <app-icon [icon]="currentTheme.icon" class="topbar-link-icon"></app-icon>
        </button>
        <div ngbDropdownMenu class="dropdown-menu-end">
          @for (theme of themeData; track $index) {
            <a class="cursor-pointer" ngbDropdownItem [class.active]="theme.value === currentTheme.value" (click)="setTheme(theme)">
              <app-icon [icon]="theme.icon" class="align-middle me-1 fs-16"></app-icon>
              <span class="align-middle">{{ theme.label }}</span>
            </a>
          }
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ThemeDropdown {
  themeData: ThemeType[] = [
    { label: 'Light', value: 'light', icon: 'sun' },
    { label: 'Dark', value: 'dark', icon: 'moon' },
    { label: 'System', value: 'system', icon: 'sun-moon' },
  ]

  currentTheme: ThemeType

  constructor(private layout: LayoutService) {
    const found = this.themeData.find((t) => t.value === this.layout.theme)
    this.currentTheme = found ?? this.themeData[0]
  }

  setTheme(theme: ThemeType) {
    this.currentTheme = theme
    this.layout.updateLayout({ theme: theme.value })
  }
}
