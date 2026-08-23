export type MenuItemType = {
  slug: string
  label: string
  isTitle?: boolean
  icon?: string
  url?: string
  badge?: {
    className: string
    text: string
  }
  target?: string
  isDisabled?: boolean
  isSpecial?: boolean
  children?: MenuItemType[]
}
