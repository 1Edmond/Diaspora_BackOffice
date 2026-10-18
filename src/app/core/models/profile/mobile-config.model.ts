export interface ProfileTypeMobileConfigDto {
  id?: string;
  profileTypeId?: string | null;
  countryCode?: string | null;
  activeModules: Record<string, boolean>;
  minAppVersion: string;
  forceUpdate: boolean;
  isMaintenanceMode: boolean;
  maintenanceMessage?: string | null;
  defaultLocale: string;
  supportedLocales?: string[] | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
  isCustomOverride?: boolean;
}

export interface UpsertMobileConfigRequest {
  activeModules?: Record<string, boolean>;
  minAppVersion?: string;
  forceUpdate: boolean;
  isMaintenanceMode: boolean;
  maintenanceMessage?: string | null;
  defaultLocale?: string;
  supportedLocales?: string[];
}

export const KNOWN_MOBILE_MODULES: { key: string; label: string; icon: string; description: string }[] = [
  { key: 'wallet', label: 'Portefeuille & Transactions', icon: 'credit-card', description: 'Gestion des soldes, transferts P2P et paiements séquestres' },
  { key: 'documents', label: 'Coffre-fort Documents', icon: 'file-text', description: 'Stockage sécurisé et téléchargement des documents officiels' },
  { key: 'marketplace', label: 'Marketplace & Colis', icon: 'shopping-bag', description: 'Transport de colis, réservations de fret et transactions' },
  { key: 'procedures', label: 'Démarches Consulaires', icon: 'clipboard-list', description: 'Guichet administratif et suivi des formalités' },
  { key: 'chat', label: 'Messagerie & Chat', icon: 'message-square', description: 'Messagerie instantanée directe et salons thématiques' },
  { key: 'freelance', label: 'Missions Freelance', icon: 'briefcase', description: 'Offres de prestations, candidatures et contrats' },
  { key: 'community', label: 'Communauté & Entraide', icon: 'users', description: 'Réseau d’entraide citoyenne de la diaspora' },
  { key: 'committee', label: 'Comité Consulaire', icon: 'award', description: 'Conseils et comités représentatifs' },
  { key: 'services', label: 'Demandes de Services', icon: 'layers', description: 'Prestations de services et intermédiation' },
  { key: 'settings', label: 'Paramètres & Sécurité', icon: 'settings', description: 'Configuration du compte, sécurité et préférences' },
  { key: 'profile', label: 'Profils Citoyens', icon: 'user', description: 'Consultation et bascule entre profils' }
];
