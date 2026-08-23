import { Routes } from '@angular/router'
import { AuthGuard } from '@core/services/auth.guard'
import { LayoutService } from '@core/services/layout.service'
import { MainLayout } from '@layouts/main-layout'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/ecommerce',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard, LayoutService],
    children: [
      {
        path: 'dashboard/ecommerce',
        loadComponent: () => import('./views/dashboard/ecommerce/ecommerce').then((m) => m.Ecommerce),
        data: { title: 'Ecommerce' },
      },
      {
        path: 'dashboard/identity',
        loadComponent: () => import('./views/dashboard/identity/identity-dashboard').then((m) => m.IdentityDashboard),
        data: { title: 'Identity Dashboard' },
      },
      {
        path: 'identity/users',
        loadComponent: () => import('./views/identity/users/users-list').then((m) => m.UsersList),
        data: { title: 'Users' },
      },
      {
        path: 'identity/users/new',
        loadComponent: () => import('./views/identity/users/user-form').then((m) => m.UserForm),
        data: { title: 'Add User' },
      },
      {
        path: 'identity/users/:id',
        loadComponent: () => import('./views/identity/users/user-detail').then((m) => m.UserDetail),
        data: { title: 'User Detail' },
      },
      {
        path: 'identity/users/:id/edit',
        loadComponent: () => import('./views/identity/users/user-form').then((m) => m.UserForm),
        data: { title: 'Edit User' },
      },
      {
        path: 'identity/roles',
        loadComponent: () => import('./views/identity/roles/roles-list').then((m) => m.RolesList),
        data: { title: 'Roles' },
      },
      {
        path: 'identity/roles/new',
        loadComponent: () => import('./views/identity/roles/role-form').then((m) => m.RoleForm),
        data: { title: 'Add Role' },
      },
      {
        path: 'identity/roles/:id',
        loadComponent: () => import('./views/identity/roles/role-form').then((m) => m.RoleForm),
        data: { title: 'Edit Role' },
      },
      {
        path: 'identity/permissions',
        loadComponent: () => import('./views/identity/permissions/permissions-list').then((m) => m.PermissionsList),
        data: { title: 'Permissions' },
      },
      {
        path: 'identity/profile',
        loadComponent: () => import('./views/identity/profile/profile-edit').then((m) => m.ProfileEdit),
        data: { title: 'My Profile' },
      },
      {
        path: 'kyc/dashboard',
        loadComponent: () => import('./views/kyc/kyc-dashboard/kyc-dashboard').then((m) => m.KycDashboard),
        data: { title: 'KYC Dashboard' },
      },
      {
        path: 'kyc/list',
        loadComponent: () => import('./views/kyc/kyc-list/kyc-list').then((m) => m.KycList),
        data: { title: 'KYC Verifications' },
      },
      {
        path: 'kyc/:id',
        loadComponent: () => import('./views/kyc/kyc-detail/kyc-detail').then((m) => m.KycDetail),
        data: { title: 'KYC Details' },
      },
      {
        path: 'profiles',
        loadComponent: () => import('./views/profile/profiles-list/profiles-list').then((m) => m.ProfilesList),
        data: { title: 'All Profiles' },
      },
      {
        path: 'profiles/list',
        loadComponent: () => import('./views/profile/profiles-list/profiles-list').then((m) => m.ProfilesList),
        data: { title: 'All Profiles' },
      },
      {
        path: 'profiles/pending',
        loadComponent: () => import('./views/profile/pending-list/pending-list').then((m) => m.PendingList),
        data: { title: 'Pending Profiles' },
      },
      {
        path: 'profiles/types',
        loadComponent: () => import('./views/profile/profile-types/profile-types').then((m) => m.ProfileTypes),
        data: { title: 'Profile Types' },
      },
      {
        path: 'profiles/:id',
        loadComponent: () => import('./views/profile/profile-detail/profile-detail').then((m) => m.ProfileDetail),
        data: { title: 'Profile Detail' },
      },
      {
        path: 'documents',
        loadComponent: () => import('./views/document/document-list/document-list').then((m) => m.DocumentList),
        data: { title: 'Documents' },
      },
      {
        path: 'documents/types',
        loadComponent: () => import('./views/document/document-types/document-types').then((m) => m.DocumentTypes),
        data: { title: 'Document Types' },
      },
      {
        path: 'documents/:id',
        loadComponent: () => import('./views/document/document-detail/document-detail').then((m) => m.DocumentDetail),
        data: { title: 'Document Details' },
      },
      {
        path: 'procedures',
        loadComponent: () => import('./views/procedure/procedure-list/procedure-list').then((m) => m.ProcedureList),
        data: { title: 'Procedures' },
      },
      {
        path: 'procedures/new',
        loadComponent: () => import('./views/procedure/procedure-form/procedure-form').then((m) => m.ProcedureForm),
        data: { title: 'New Procedure' },
      },
      {
        path: 'procedures/user-procedures',
        loadComponent: () => import('./views/procedure/user-procedures/user-procedures').then((m) => m.UserProcedures),
        data: { title: 'User Procedures' },
      },
      {
        path: 'procedures/locations',
        loadComponent: () => import('./views/procedure/locations/locations').then((m) => m.Locations),
        data: { title: 'Locations' },
      },
      {
        path: 'procedures/:id/edit',
        loadComponent: () => import('./views/procedure/procedure-form/procedure-form').then((m) => m.ProcedureForm),
        data: { title: 'Edit Procedure' },
      },
      {
        path: 'procedures/:id',
        loadComponent: () => import('./views/procedure/procedure-detail/procedure-detail').then((m) => m.ProcedureDetail),
        data: { title: 'Procedure Detail' },
      },
      {
        path: 'marketplace/dashboard',
        loadComponent: () => import('./views/marketplace/dashboard/marketplace-dashboard').then((m) => m.MarketplaceDashboard),
        data: { title: 'Marketplace' },
      },
      {
        path: 'marketplace/listings',
        loadComponent: () => import('./views/marketplace/listings/listings').then((m) => m.Listings),
        data: { title: 'Listings' },
      },
      {
        path: 'marketplace/listings/new',
        loadComponent: () => import('./views/marketplace/listing-form/listing-form').then((m) => m.ListingForm),
        data: { title: 'New Listing' },
      },
      {
        path: 'marketplace/listings/:id',
        loadComponent: () => import('./views/marketplace/listing-detail/listing-detail').then((m) => m.ListingDetail),
        data: { title: 'Listing Detail' },
      },
      {
        path: 'marketplace/listings/:id/edit',
        loadComponent: () => import('./views/marketplace/listing-form/listing-form').then((m) => m.ListingForm),
        data: { title: 'Edit Listing' },
      },
      {
        path: 'marketplace/pending',
        loadComponent: () => import('./views/marketplace/pending-listings').then((m) => m.PendingListings),
        data: { title: 'Pending Listings' },
      },
      {
        path: 'marketplace/categories',
        loadComponent: () => import('./views/marketplace/categories/categories').then((m) => m.Categories),
        data: { title: 'Categories' },
      },
      {
        path: 'marketplace/reviews',
        loadComponent: () => import('./views/marketplace/reviews/reviews').then((m) => m.Reviews),
        data: { title: 'Reviews' },
      },
      {
        path: 'marketplace/requests',
        loadComponent: () => import('./views/marketplace/service-requests/service-requests').then((m) => m.ServiceRequests),
        data: { title: 'Service Requests' },
      },
      {
        path: 'wallet',
        loadComponent: () => import('./views/wallet/wallet/wallet').then((m) => m.WalletComponent),
        data: { title: 'Wallet' },
      },
      {
        path: 'wallet/transactions',
        loadComponent: () => import('./views/wallet/transactions/transactions').then((m) => m.Transactions),
        data: { title: 'Transactions' },
      },
      {
        path: 'wallet/parameters',
        loadComponent: () => import('./views/wallet/parameters/parameters').then((m) => m.WalletParameters),
        data: { title: 'Wallet Parameters' },
      },
      {
        path: 'notifications',
        loadComponent: () => import('./views/notification/notification-list/notification-list').then((m) => m.NotificationList),
        data: { title: 'Notifications' },
      },
      {
        path: 'pages/empty',
        loadComponent: () => import('./views/pages/empty/empty').then((m) => m.Empty),
        data: { title: 'Empty Page' },
      },
      {
        path: 'layouts/scrollable',
        loadComponent: () => import('./views/layouts/scrollable/scrollable').then((m) => m.Scrollable),
        data: { title: 'Scrollable' },
      },
      {
        path: 'layouts/compact',
        loadComponent: () => import('./views/layouts/compact/compact').then((m) => m.Compact),
        data: { title: 'Compact' },
      },
      {
        path: 'layouts/boxed',
        loadComponent: () => import('./views/layouts/boxed/boxed').then((m) => m.Boxed),
        data: { title: 'Boxed' },
      },
      {
        path: 'layouts/horizontal',
        loadComponent: () => import('./views/layouts/horizontal/horizontal').then((m) => m.Horizontal),
        data: { title: 'Horizontal' },
      },
      {
        path: 'layouts/preloader',
        loadComponent: () => import('./views/layouts/preloader/preloader').then((m) => m.Preloader),
        data: { title: 'Preloader' },
      },
      {
        path: 'layouts/sidebar-dark',
        loadComponent: () => import('./views/layouts/sidebar-dark/sidebar-dark').then((m) => m.SidebarDark),
        data: { title: 'Dark Menu' },
      },
      {
        path: 'layouts/sidebar-gradient',
        loadComponent: () => import('./views/layouts/sidebar-gradient/sidebar-gradient').then((m) => m.SidebarGradient),
        data: { title: 'Gradient Menu' },
      },
      {
        path: 'layouts/sidebar-gray',
        loadComponent: () => import('./views/layouts/sidebar-gray/sidebar-gray').then((m) => m.SidebarGray),
        data: { title: 'Gray Menu' },
      },
      {
        path: 'layouts/sidebar-image',
        loadComponent: () => import('./views/layouts/sidebar-image/sidebar-image').then((m) => m.SidebarImage),
        data: { title: 'Image Menu' },
      },
      {
        path: 'layouts/sidebar-compact',
        loadComponent: () => import('./views/layouts/sidebar-compact/sidebar-compact').then((m) => m.SidebarCompact),
        data: { title: 'Compact Menu' },
      },
      {
        path: 'layouts/sidebar-on-hover',
        loadComponent: () => import('./views/layouts/sidebar-on-hover/sidebar-on-hover').then((m) => m.SidebarOnHover),
        data: { title: 'On Hover Menu' },
      },
      {
        path: 'layouts/sidebar-on-hover-active',
        loadComponent: () => import('./views/layouts/sidebar-on-hover-active/sidebar-on-hover-active').then((m) => m.SidebarOnHoverActive),
        data: { title: 'On Hover Active' },
      },
      {
        path: 'layouts/sidebar-offcanvas',
        loadComponent: () => import('./views/layouts/sidebar-offcanvas/sidebar-offcanvas').then((m) => m.SidebarOffcanvas),
        data: { title: 'Offcanvas Menu' },
      },
      {
        path: 'layouts/sidebar-no-icons',
        loadComponent: () => import('./views/layouts/sidebar-no-icons/sidebar-no-icons').then((m) => m.SidebarNoIcons),
        data: { title: 'No Icons with Lines' },
      },
      {
        path: 'layouts/sidebar-with-lines',
        loadComponent: () => import('./views/layouts/sidebar-with-lines/sidebar-with-lines').then((m) => m.SidebarWithLines),
        data: { title: 'Sidebar with Lines' },
      },
      {
        path: 'layouts/topbar-light',
        loadComponent: () => import('./views/layouts/topbar-light/topbar-light').then((m) => m.TopbarLight),
        data: { title: 'Light Topbar' },
      },
      {
        path: 'layouts/topbar-gray',
        loadComponent: () => import('./views/layouts/topbar-gray/topbar-gray').then((m) => m.TopbarGray),
        data: { title: 'Gray Topbar' },
      },
      {
        path: 'layouts/topbar-gradient',
        loadComponent: () => import('./views/layouts/topbar-gradient/topbar-gradient').then((m) => m.TopbarGradient),
        data: { title: 'Gradient Topbar' },
      },
      {
        path: 'icons/lucide',
        loadComponent: () => import('./views/icons/lucide/lucide').then((m) => m.Lucide),
        data: { title: 'Lucide' },
      },
    ],
  },
  {
    path: '',
    canActivate: [LayoutService],
    children: [
      {
        path: 'auth/sign-in',
        loadComponent: () => import('./views/auth/sign-in/sign-in').then((m) => m.SignIn),
        data: { title: 'Sign In' },
      },
      {
        path: 'auth/sign-up',
        loadComponent: () => import('./views/auth/sign-up/sign-up').then((m) => m.SignUp),
        data: { title: 'Sign Up' },
      },
      {
        path: 'auth/reset-pass',
        loadComponent: () => import('./views/auth/reset-pass/reset-pass').then((m) => m.ResetPass),
        data: { title: 'Reset Password' },
      },
      {
        path: 'auth/new-pass',
        loadComponent: () => import('./views/auth/new-pass/new-pass').then((m) => m.NewPass),
        data: { title: 'New Password' },
      },
      {
        path: 'auth/two-factor',
        loadComponent: () => import('./views/auth/two-factor/two-factor').then((m) => m.TwoFactor),
        data: { title: 'Two Factor' },
      },
      {
        path: 'auth/lock-screen',
        loadComponent: () => import('./views/auth/lock-screen/lock-screen').then((m) => m.LockScreen),
        data: { title: 'Lock Screen' },
      },
      {
        path: 'auth/success-mail',
        loadComponent: () => import('./views/auth/success-mail/success-mail').then((m) => m.SuccessMail),
        data: { title: 'Success Mail' },
      },
      {
        path: 'auth/login-pin',
        loadComponent: () => import('./views/auth/login-pin/login-pin').then((m) => m.LoginPin),
        data: { title: 'Login with PIN' },
      },
      {
        path: 'auth/delete-account',
        loadComponent: () => import('./views/auth/delete-account/delete-account').then((m) => m.DeleteAccount),
        data: { title: 'Delete Account' },
      },
      {
        path: 'auth/split/sign-in',
        loadComponent: () => import('./views/auth/split/sign-in/sign-in').then((m) => m.SignIn),
        data: { title: 'Sign In' },
      },
      {
        path: 'auth/split/sign-up',
        loadComponent: () => import('./views/auth/split/sign-up/sign-up').then((m) => m.SignUp),
        data: { title: 'Sign Up' },
      },
      {
        path: 'auth/split/reset-pass',
        loadComponent: () => import('./views/auth/split/reset-pass/reset-pass').then((m) => m.ResetPass),
        data: { title: 'Reset Password' },
      },
      {
        path: 'auth/split/new-pass',
        loadComponent: () => import('./views/auth/split/new-pass/new-pass').then((m) => m.NewPass),
        data: { title: 'New Password' },
      },
      {
        path: 'auth/split/two-factor',
        loadComponent: () => import('./views/auth/split/two-factor/two-factor').then((m) => m.TwoFactor),
        data: { title: 'Two Factor' },
      },
      {
        path: 'auth/split/lock-screen',
        loadComponent: () => import('./views/auth/split/lock-screen/lock-screen').then((m) => m.LockScreen),
        data: { title: 'Lock Screen' },
      },
      {
        path: 'auth/split/success-mail',
        loadComponent: () => import('./views/auth/split/success-mail/success-mail').then((m) => m.SuccessMail),
        data: { title: 'Success Mail' },
      },
      {
        path: 'auth/split/login-pin',
        loadComponent: () => import('./views/auth/split/login-pin/login-pin').then((m) => m.LoginPin),
        data: { title: 'Login with PIN' },
      },
      {
        path: 'auth/split/delete-account',
        loadComponent: () => import('./views/auth/split/delete-account/delete-account').then((m) => m.DeleteAccount),
        data: { title: 'Delete Account' },
      },
      {
        path: 'error/400',
        loadComponent: () => import('./views/error/error-400/error-400').then((m) => m.Error400),
        data: { title: '400 Bad Request' },
      },
      {
        path: 'error/401',
        loadComponent: () => import('./views/error/error-401/error-401').then((m) => m.Error401),
        data: { title: '401 Unauthorized' },
      },
      {
        path: 'error/403',
        loadComponent: () => import('./views/error/error-403/error-403').then((m) => m.Error403),
        data: { title: '403 Forbidden' },
      },
      {
        path: 'error/404',
        loadComponent: () => import('./views/error/error-404/error-404').then((m) => m.Error404),
        data: { title: '404 Not Found' },
      },
      {
        path: 'error/408',
        loadComponent: () => import('./views/error/error-408/error-408').then((m) => m.Error408),
        data: { title: '408 Request Timeout' },
      },
      {
        path: 'error/500',
        loadComponent: () => import('./views/error/error-500/error-500').then((m) => m.Error500),
        data: { title: '500 Internal Server' },
      },
      {
        path: 'error/maintenance',
        loadComponent: () => import('./views/error/maintenance/maintenance').then((m) => m.Maintenance),
        data: { title: 'Maintenance' },
      },
    ],
  },
]
