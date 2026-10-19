import { MenuItemType } from '@/app/types'

export const menuItems: MenuItemType[] = [
  {
    'icon': 'compass',
    'slug': 'main',
    'label': 'Principal',
    'isTitle': true,
    'children': [
      {
        'url': '/dashboard/ecommerce',
        'slug': 'pages:dashboard-ecommerce',
        'label': 'Tableau de Bord',
        'icon': 'layout-dashboard',
      },
    ],
  },
  {
    'icon': 'fingerprint',
    'slug': 'identity',
    'label': 'Identité & Accès',
    'isTitle': true,
    'children': [
      {
        'url': '/dashboard/identity',
        'slug': 'pages:dashboard-identity',
        'label': 'Dashboard Identité',
        'icon': 'activity',
      },
      {
        'url': '/identity/users',
        'slug': 'pages:identity-users',
        'label': 'Utilisateurs',
        'icon': 'users',
      },
      {
        'url': '/identity/roles',
        'slug': 'pages:identity-roles',
        'label': 'Rôles',
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
    'label': 'Vérification KYC',
    'isTitle': true,
    'children': [
      {
        'url': '/kyc/dashboard',
        'slug': 'pages:kyc-dashboard',
        'label': 'Dashboard KYC',
        'icon': 'pie-chart',
      },
      {
        'url': '/kyc/list',
        'slug': 'pages:kyc-list',
        'label': 'Dossiers de Vérification',
        'icon': 'user-check',
      },
      {
        'url': '/kyc/requirements',
        'slug': 'pages:kyc-requirements',
        'label': 'Exigences Documentaires',
        'icon': 'file-check',
      },
    ],
  },
  {
    'icon': 'contact',
    'slug': 'profiles',
    'label': 'Profils Citoyens',
    'isTitle': true,
    'children': [
      {
        'url': '/profiles',
        'slug': 'pages:profiles-list',
        'label': 'Tous les Profils',
        'icon': 'user-round',
      },
      {
        'url': '/profiles/pending',
        'slug': 'pages:profiles-pending',
        'label': 'En Attente de Validation',
        'icon': 'hourglass',
      },
      {
        'url': '/profiles/types',
        'slug': 'pages:profiles-types',
        'label': 'Types de Profils',
        'icon': 'globe',
      },
      {
        'url': '/profiles/mobile-config',
        'slug': 'pages:profiles-mobile-config',
        'label': 'Config Mobile & Fonctionnalités',
        'icon': 'smartphone',
      },
    ],
  },
  {
    'icon': 'files',
    'slug': 'documents',
    'label': 'Documents & Justificatifs',
    'isTitle': true,
    'children': [
      {
        'url': '/documents',
        'slug': 'pages:documents',
        'label': 'Tous les Documents',
        'icon': 'file-text',
      },
      {
        'url': '/documents/types',
        'slug': 'pages:documents-types',
        'label': 'Types de Documents',
        'icon': 'folder',
      },
    ],
  },
  {
    'icon': 'stamp',
    'slug': 'procedures',
    'label': 'Démarches Consulaires',
    'isTitle': true,
    'children': [
      {
        'url': '/procedures',
        'slug': 'pages:procedures',
        'label': 'Définitions des Démarches',
        'icon': 'list-checks',
      },
      {
        'url': '/procedures/user-procedures',
        'slug': 'pages:user-procedures',
        'label': 'Suivi des Dossiers Citoyens',
        'icon': 'trending-up',
      },
      {
        'url': '/procedures/locations',
        'slug': 'pages:locations',
        'label': 'Lieux & Consulats',
        'icon': 'map-pin',
      },
    ],
  },
  {
    'icon': 'store',
    'slug': 'marketplace',
    'label': 'Marketplace & Colis',
    'isTitle': true,
    'children': [
      {
        'url': '/marketplace/dashboard',
        'slug': 'pages:marketplace-dashboard',
        'label': 'Dashboard Marketplace',
        'icon': 'bar-chart-3',
      },
      {
        'url': '/marketplace/listings',
        'slug': 'pages:marketplace-listings',
        'label': 'Toutes les Annonces',
        'icon': 'shopping-bag',
      },
      {
        'url': '/marketplace/pending',
        'slug': 'pages:marketplace-pending',
        'label': 'Annonces en Attente',
        'icon': 'clock',
      },
      {
        'url': '/marketplace/categories',
        'slug': 'pages:marketplace-categories',
        'label': 'Catégories',
        'icon': 'tags',
      },
      {
        'url': '/marketplace/reports',
        'slug': 'pages:marketplace-reports',
        'label': 'Signalements',
        'icon': 'flag',
      },
      {
        'url': '/marketplace/reviews',
        'slug': 'pages:marketplace-reviews',
        'label': 'Avis & Notations',
        'icon': 'star',
      },
      {
        'url': '/marketplace/requests',
        'slug': 'pages:marketplace-requests',
        'label': 'Demandes de Service',
        'icon': 'message-square',
      },
      {
        'url': '/marketplace/providers',
        'slug': 'pages:marketplace-providers',
        'label': 'Analyse Prestataires',
        'icon': 'truck',
      },
      {
        'url': '/marketplace/disputes',
        'slug': 'pages:marketplace-disputes',
        'label': 'Litiges & Réclamations',
        'icon': 'alert-triangle',
      },
      {
        'url': '/marketplace/payment-policies',
        'link': '/marketplace/payment-policies',
        'slug': 'pages:marketplace-payment-policies',
        'label': 'Politiques de Règlement',
        'icon': 'credit-card',
      },
      {
        'url': '/marketplace/parameters',
        'slug': 'pages:marketplace-parameters',
        'label': 'Paramètres Généraux',
        'icon': 'sliders',
      },
    ],
  },
  {
    'icon': 'laptop',
    'slug': 'freelance',
    'label': 'Freelance & Missions',
    'isTitle': true,
    'children': [
      {
        'url': '/freelance/job-postings',
        'slug': 'pages:freelance-postings',
        'label': 'Offres de Mission',
        'icon': 'briefcase',
      },
      {
        'url': '/freelance/job-categories',
        'slug': 'pages:freelance-categories',
        'label': 'Catégories de Métiers',
        'icon': 'layers',
      },
      {
        'url': '/freelance/job-contracts',
        'slug': 'pages:freelance-contracts',
        'label': 'Contrats & Pointages',
        'icon': 'file-signature',
      },
      {
        'url': '/freelance/job-reviews',
        'slug': 'pages:freelance-reviews',
        'label': 'Avis & Évaluations',
        'icon': 'thumbs-up',
      },
      {
        'url': '/freelance/job-templates',
        'slug': 'pages:freelance-templates',
        'label': 'Modèles de Mission',
        'icon': 'clipboard-list',
      },
    ],
  },
  {
    'icon': 'landmark',
    'slug': 'wallet',
    'label': 'Portefeuille & Trésorerie',
    'isTitle': true,
    'children': [
      {
        'url': '/wallet/all',
        'slug': 'pages:wallet-all',
        'label': 'Tous les Portefeuilles',
        'icon': 'wallet',
      },
      {
        'url': '/wallet/transactions',
        'slug': 'pages:wallet-transactions',
        'label': 'Transactions & Séquestres',
        'icon': 'arrow-left-right',
      },
      {
        'url': '/wallet/parameters',
        'slug': 'pages:wallet-parameters',
        'label': 'Paramètres Portefeuille',
        'icon': 'settings',
      },
    ],
  },
  {
    'icon': 'bell-ring',
    'slug': 'notifications',
    'label': 'Notifications & Broadcast',
    'isTitle': true,
    'children': [
      {
        'url': '/notifications',
        'slug': 'pages:notifications',
        'label': 'Centre de Notifications',
        'icon': 'bell',
      },
      {
        'url': '/notifications/preferences',
        'slug': 'pages:notification-preferences',
        'label': 'Règles & Modèles (Templates)',
        'icon': 'sliders-horizontal',
      },
      {
        'url': '/notifications/broadcast',
        'slug': 'pages:notifications-broadcast',
        'label': 'Campagnes Broadcast',
        'icon': 'send',
      },
    ],
  },
  {
    'icon': 'messages-square',
    'slug': 'chat',
    'label': 'Chat & Modération',
    'isTitle': true,
    'children': [
      {
        'url': '/chat/moderation',
        'slug': 'pages:chat-moderation',
        'label': 'Signalements & Modération',
        'icon': 'shield-alert',
      },
    ],
  },
]
