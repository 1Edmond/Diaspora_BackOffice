import { MenuItemType } from '@/app/types'
import { scrollToElement } from '@/app/utils/layout'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { NavigationEnd, Router, RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { LayoutService } from '@core/services/layout.service'
import { menuItems } from '@layouts/components/data'
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap'
import { filter } from 'rxjs'

@Component({
  selector: 'app-menu',
  imports: [NgbCollapse, RouterLink, CommonModule, Icon],
  template: `
    <ul class="side-nav">
      @for (item of menuItems; track item.slug) {
        @if (item.isTitle) {
          <li class="side-nav-title mt-2">{{ item.label }}</li>
        }
        @for (child of item.children || [item]; track child.slug) {
          @if (hasSubMenu(child)) {
            <ng-container *ngTemplateOutlet="menuItemWithChildren; context: { item: child, isTopLevel: true }"></ng-container>
          } @else {
            <ng-container *ngTemplateOutlet="menuItem; context: { item: child, isTopLevel: true }"></ng-container>
          }
        }
      }
    </ul>

    <ng-template #menuItemWithChildren let-item="item" let-isTopLevel="isTopLevel">
      <li class="side-nav-item" [class.active]="isChildActive(item)">
        <button class="side-nav-link" (click)="toggleCollapse(item)" [attr.aria-expanded]="!isCollapsed(item)" [class.active]="isChildActive(item)">
          @if (item.icon && isTopLevel) {
            <span class="menu-icon"><app-icon [icon]="item.icon"></app-icon></span>
          }
          <span class="menu-text">{{ item.label }}</span>
          @if (item.badge) {
            <span class="badge {{ item.badge.className }}">{{ item.badge.text }}</span>
          } @else {
            <div class="menu-arrow"></div>
          }
        </button>

        <div [ngbCollapse]="isCollapsed(item)">
          <ul class="sub-menu">
            @for (child of item.children; track child.slug) {
              @if (hasSubMenu(child)) {
                <ng-container *ngTemplateOutlet="menuItemWithChildren; context: { item: child, isTopLevel: false }"></ng-container>
              } @else {
                <ng-container *ngTemplateOutlet="menuItem; context: { item: child, isTopLevel: false }"></ng-container>
              }
            }
          </ul>
        </div>
      </li>
    </ng-template>

    <ng-template #menuItem let-item="item" let-isTopLevel="isTopLevel">
      <li class="side-nav-item" [class.active]="isActive(item)">
        <a [routerLink]="item.url" class="side-nav-link" [attr.data-active-link]="isActive(item)" [class.disabled]="item.isDisabled" [class.special-menu]="item.isSpecial">
          @if (item.icon && isTopLevel) {
            <span class="menu-icon">
              <app-icon [icon]="item.icon"></app-icon>
            </span>
          }
          <span class="menu-text">{{ item.label }}</span>
          @if (item.badge) {
            <span class="badge {{ item.badge.className }}">{{ item.badge.text }}</span>
          }
        </a>
      </li>
    </ng-template>
  `,
  styles: ``,
})
export class AppMenu implements OnInit {
  router = inject(Router)
  layout = inject(LayoutService)

  @ViewChild('MenuItemWithChildren', { static: true })
  menuItemWithChildren!: TemplateRef<{ item: MenuItemType }>

  @ViewChild('MenuItem', { static: true })
  menuItem!: TemplateRef<{ item: MenuItemType }>

  menuItems = menuItems

  openSubmenus: { [key: string]: boolean } = {}

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.initializeOpenStates(this.menuItems)
      setTimeout(() => this.scrollToActiveLink(), 50)
    })

    this.initializeOpenStates(this.menuItems)
    setTimeout(() => this.scrollToActiveLink(), 100)
  }

  hasSubMenu(item: MenuItemType): boolean {
    return !!item.children && item.children?.length > 0
  }

  initializeOpenStates(items: MenuItemType[]) {
    for (const item of items) {
      if (this.hasSubMenu(item)) {
        this.openSubmenus[item.slug] = this.isChildActive(item)
        this.initializeOpenStates(item.children || [])
      }
    }
  }

  isCollapsed(item: MenuItemType): boolean {
    return !this.openSubmenus[item.slug]
  }

  toggleCollapse(item: MenuItemType): void {
    this.openSubmenus[item.slug] = !this.openSubmenus[item.slug]
  }

  isChildActive(item: MenuItemType): boolean {
    if (item.url && this.router.url === item.url) return true
    if (!item.children) return false
    return item.children.some((child: MenuItemType) => this.isChildActive(child))
  }

  isActive(item: MenuItemType): boolean {
    return this.router.url === item.url
  }

  scrollToActiveLink(): void {
    const activeItem = document.querySelector('[data-active-link="true"]') as HTMLElement
    const scrollContainer = document.querySelector('#sidenav .simplebar-content-wrapper') as HTMLElement

    if (activeItem && scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()

      const offset = itemRect.top - containerRect.top - window.innerHeight * 0.4

      scrollToElement(scrollContainer, scrollContainer.scrollTop + offset, 500)
    }
  }
}
