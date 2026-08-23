import { MenuItemType } from '@/app/types'
import { CommonModule } from '@angular/common'
import { Component, TemplateRef, ViewChild } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { menuItems } from '@layouts/components/data'
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-menu-navbar',
  imports: [CommonModule, NgbDropdown, NgbDropdownToggle, RouterLink, NgbDropdownMenu, Icon],
  template: `
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav">
        @for (item of menuItems; track $index) {
          @if (!hasSubMenu(item)) {
            <li class="nav-item">
              <ng-container *ngTemplateOutlet="MenuItem; context: { item, linkClass: 'nav-link' }" />
            </li>
          }
          <!-- menu item with child -->
          @if (hasSubMenu(item)) {
            <ng-container *ngTemplateOutlet="MenuItemWithChildren; context: { item, wrapperClass: 'nav-item', togglerClass: 'nav-link', isTopLevel: true }" />
          }
        }
      </ul>
    </div>

    <ng-template #MenuItemWithChildren let-item="item" let-wrapperClass="wrapperClass" let-togglerClass="togglerClass" let-isTopLevel="isTopLevel">
      <li ngbDropdown [class]="wrapperClass" class="dropdown" [class.active]="isChildActive(item)">
        <a ngbDropdownToggle [class]="togglerClass" class="dropdown-toggle drop-arrow-none" role="button">
          @if (item.icon && isTopLevel) {
            <span class="menu-icon">
              <app-icon [icon]="item.icon" class="fs-xl" />
            </span>
          }
          <span class="menu-text"> {{ item.label }}</span>
          @if (item.badge) {
            <span class="badge {{ item.badge.className }}">{{ item.badge.text }}</span>
          } @else {
            <span class="menu-arrow drop-arrow-none"></span>
          }
        </a>
        <div ngbDropdownMenu class="dropdown-menu" [ngClass]="{ 'dropdown-menu-columns': (item.children || []).length > 10 }">
          @for (child of item.children; track $index) {
            <!-- menu item without any child -->
            @if (!hasSubMenu(child)) {
              <ng-container *ngTemplateOutlet="MenuItem; context: { item: child, linkClass: 'dropdown-item' }" />
            }

            <!-- menu item with child -->
            @if (hasSubMenu(child)) {
              <ng-container *ngTemplateOutlet="MenuItemWithChildren; context: { item: child, togglerClass: 'dropdown-item' }" />
            }
          }
        </div>
      </li>
    </ng-template>

    <ng-template #MenuItem let-item="item" let-linkClass="linkClass" let-isTopLevel="isTopLevel">
      @if (item.url) {
        <a [routerLink]="item.url" [target]="item.target" [class]="linkClass" [class.active]="isActive(item)" [class.disabled]="item.isDisabled" [class.special-menu]="item.isSpecial">
          @if (item.icon && isTopLevel) {
            <span class="menu-icon">
              <app-icon [icon]="item.icon" class="fs-xl" />
            </span>
          }
          <span class="menu-text">{{ item.label }}</span>
          @if (item.badge) {
            <span class="badge {{ item.badge.className }} opacity-50" [innerHTML]="item.badge.text"></span>
          }
        </a>
      }
    </ng-template>
  `,
})
export class AppMenu {
  constructor(public router: Router) {}

  @ViewChild('MenuItemWithChildren', { static: true })
  menuItemWithChildren!: TemplateRef<{
    item: MenuItemType
    wrapperClass?: string
    togglerClass?: string
  }>

  @ViewChild('MenuItem', { static: true })
  menuItem!: TemplateRef<{ item: MenuItemType; linkClass?: string }>

  menuItems = menuItems

  hasSubMenu(item: MenuItemType): boolean {
    return !!item.children && item.children?.length > 0
  }

  isChildActive(item: MenuItemType): boolean {
    if (item.url && this.router.url === item.url) return true
    if (!item.children) return false
    return item.children.some((child: MenuItemType) => this.isChildActive(child))
  }

  isActive(item: MenuItemType): boolean {
    return item.url === this.router.url
  }
}
