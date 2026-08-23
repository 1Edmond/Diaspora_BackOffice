import { MenuItemType } from '@/app/types'

export const menuItems: MenuItemType[] = [
  {
    'icon': 'layout-dashboard',
    'slug': 'main',
    'label': 'Main',
    'isTitle': true,
    'children': [
      {
        'url': '/dashboard/ecommerce',
        'slug': 'pages:dashboard-ecommerce',
        'label': 'Dashboard',
        'icon': 'layout-dashboard',
      },
    ],
  },
  {
    'icon': 'users',
    'slug': 'identity',
    'label': 'Identity',
    'isTitle': true,
    'children': [
      {
        'url': '/dashboard/identity',
        'slug': 'pages:dashboard-identity',
        'label': 'Dashboard',
        'icon': 'bar-chart-3',
      },
      {
        'url': '/identity/users',
        'slug': 'pages:identity-users',
        'label': 'Users',
        'icon': 'users',
      },
      {
        'url': '/identity/roles',
        'slug': 'pages:identity-roles',
        'label': 'Roles',
        'icon': 'shield',
      },
      {
        'url': '/identity/permissions',
        'slug': 'pages:identity-permissions',
        'label': 'Permissions',
        'icon': 'key',
      },
    ],
  },
  {
    'icon': 'shield-check',
    'slug': 'kyc',
    'label': 'KYC',
    'isTitle': true,
    'children': [
      {
        'url': '/kyc/dashboard',
        'slug': 'pages:kyc-dashboard',
        'label': 'Dashboard',
        'icon': 'bar-chart-3',
      },
      {
        'url': '/kyc/list',
        'slug': 'pages:kyc-list',
        'label': 'Verifications',
        'icon': 'list-checks',
      },
    ],
  },
  {
    'icon': 'user-round',
    'slug': 'profiles',
    'label': 'Profiles',
    'isTitle': true,
    'children': [
      {
        'url': '/profiles',
        'slug': 'pages:profiles-list',
        'label': 'All Profiles',
        'icon': 'users',
      },
      {
        'url': '/profiles/pending',
        'slug': 'pages:profiles-pending',
        'label': 'Pending Verifications',
        'icon': 'clock',
      },
      {
        'url': '/profiles/types',
        'slug': 'pages:profiles-types',
        'label': 'Profile Types',
        'icon': 'globe',
      },
    ],
  },
  {
    'icon': 'file-text',
    'slug': 'documents',
    'label': 'Documents',
    'isTitle': true,
    'children': [
      {
        'url': '/documents',
        'slug': 'pages:documents',
        'label': 'All Documents',
        'icon': 'file-text',
      },
      {
        'url': '/documents/types',
        'slug': 'pages:documents-types',
        'label': 'Document Types',
        'icon': 'folder',
      },
    ],
  },
  {
    'icon': 'list-checks',
    'slug': 'procedures',
    'label': 'Procedures',
    'isTitle': true,
    'children': [
      {
        'url': '/procedures',
        'slug': 'pages:procedures',
        'label': 'Definitions',
        'icon': 'list-checks',
      },
      {
        'url': '/procedures/user-procedures',
        'slug': 'pages:user-procedures',
        'label': 'User Progress',
        'icon': 'trending-up',
      },
      {
        'url': '/procedures/locations',
        'slug': 'pages:locations',
        'label': 'Locations',
        'icon': 'map-pin',
      },
    ],
  },
  {
    'icon': 'shopping-bag',
    'slug': 'marketplace',
    'label': 'Marketplace',
    'isTitle': true,
    'children': [
      {
        'url': '/marketplace/dashboard',
        'slug': 'pages:marketplace-dashboard',
        'label': 'Dashboard',
        'icon': 'bar-chart-3',
      },
      {
        'url': '/marketplace/listings',
        'slug': 'pages:marketplace-listings',
        'label': 'Listings',
        'icon': 'shopping-bag',
      },
      {
        'url': '/marketplace/pending',
        'slug': 'pages:marketplace-pending',
        'label': 'Pending Approval',
        'icon': 'clock',
      },
      {
        'url': '/marketplace/categories',
        'slug': 'pages:marketplace-categories',
        'label': 'Categories',
        'icon': 'tags',
      },
      {
        'url': '/marketplace/requests',
        'slug': 'pages:marketplace-requests',
        'label': 'Service Requests',
        'icon': 'message-square',
      },
      {
        'url': '/marketplace/reviews',
        'slug': 'pages:marketplace-reviews',
        'label': 'Reviews',
        'icon': 'star',
      },
    ],
  },
  {
    'icon': 'wallet',
    'slug': 'wallet',
    'label': 'Wallet',
    'isTitle': true,
    'children': [
      {
        'url': '/wallet',
        'slug': 'pages:wallet',
        'label': 'Wallet',
        'icon': 'wallet',
      },
      {
        'url': '/wallet/transactions',
        'slug': 'pages:wallet-transactions',
        'label': 'Transactions',
        'icon': 'arrow-left-right',
      },
      {
        'url': '/wallet/parameters',
        'slug': 'pages:wallet-parameters',
        'label': 'Parameters',
        'icon': 'settings',
      },
    ],
  },
  {
    'icon': 'bell',
    'slug': 'notifications',
    'label': 'Notifications',
    'isTitle': true,
    'children': [
      {
        'url': '/notifications',
        'slug': 'pages:notifications',
        'label': 'Notification Center',
        'icon': 'bell',
      },
    ],
  },
]
