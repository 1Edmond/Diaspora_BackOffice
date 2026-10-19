export enum PaymentSettlementType {
  WalletEscrow = 0,
  DirectHandover = 1,
}

export enum DirectCashTiming {
  AtPickup = 0,
  AtDelivery = 1,
  FreeChoice = 2,
}

export enum AllowedSettlementPolicy {
  WalletEscrowOnly = 0,
  DirectHandoverOnly = 1,
  Both = 2,
}

export const AllowedSettlementPolicyLabels: Record<AllowedSettlementPolicy, string> = {
  [AllowedSettlementPolicy.WalletEscrowOnly]: 'Séquestre Wallet uniquement',
  [AllowedSettlementPolicy.DirectHandoverOnly]: 'Règlement direct (espèces) uniquement',
  [AllowedSettlementPolicy.Both]: 'Les deux (Séquestre & Espèces)',
};

export const AllowedSettlementPolicyBadgeVariants: Record<AllowedSettlementPolicy, string> = {
  [AllowedSettlementPolicy.WalletEscrowOnly]: 'info',
  [AllowedSettlementPolicy.DirectHandoverOnly]: 'warning',
  [AllowedSettlementPolicy.Both]: 'primary',
};

export const DirectCashTimingLabels: Record<DirectCashTiming, string> = {
  [DirectCashTiming.AtPickup]: 'À la prise en charge (remise)',
  [DirectCashTiming.AtDelivery]: 'À la livraison finale',
  [DirectCashTiming.FreeChoice]: 'Au libre choix des parties',
};

export interface ProfileTypePaymentPolicy {
  id: string;
  profileTypeId: string;
  countryCode: string;
  countryName?: string;
  flag?: string;
  allowedPolicy: AllowedSettlementPolicy;
  defaultCashTiming: DirectCashTiming;
  directBookingFeeEnabled: boolean;
  directBookingFeeFixedAmount: number;
  directBookingFeeRate: number;
  currency: string;
  isActive: boolean;
}

export interface UpdatePaymentPolicyRequest {
  countryCode?: string;
  allowedPolicy: AllowedSettlementPolicy;
  defaultCashTiming: DirectCashTiming;
  directBookingFeeEnabled: boolean;
  directBookingFeeFixedAmount: number;
  directBookingFeeRate: number;
  currency: string;
  isActive: boolean;
}

export interface CreatePaymentPolicyRequest {
  profileTypeId: string;
  countryCode?: string;
  allowedPolicy: AllowedSettlementPolicy;
  defaultCashTiming: DirectCashTiming;
  directBookingFeeEnabled: boolean;
  directBookingFeeFixedAmount: number;
  directBookingFeeRate: number;
  currency: string;
  isActive: boolean;
}
