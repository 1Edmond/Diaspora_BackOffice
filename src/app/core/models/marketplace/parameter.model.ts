export interface MarketplaceParameter {
  key: string;
  value: string;
  description?: string;
  updatedAt?: string;
}

export interface UpdateMarketplaceParameterRequest {
  value: string;
}
