import { MenuItemType } from '@/app/types'
import { CommonModule } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NavigationFocusService } from '@core/services/navigation-focus.service'
import { menuItems } from '@layouts/components/data'

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, Icon],
  templateUrl: './sidebar.html',
  styles: ``,
})
export class Sidebar {
  router = inject(Router)
  navigationFocusService = inject(NavigationFocusService)

  menuItems = menuItems

  displayedMenuItems = computed(() => {
    const active = this.navigationFocusService.activeModule()
    if (!active) {
      return this.menuItems
    }
    const filtered = this.menuItems.filter((item) => item.slug === active)
    return filtered.length > 0 ? filtered : this.menuItems
  })

  isActive(item: MenuItemType): boolean {
    return this.router.url === item.url
  }
}
