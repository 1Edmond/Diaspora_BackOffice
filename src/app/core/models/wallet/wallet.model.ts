import { TransactionDirection, TransactionStatus, TransactionType } from '../shared/enums.model'

export interface WalletDto {
  id: string
  externalProfileId: string
  userId: string
  currency: string
  balance: number
  heldBalance?: number
  isActive: boolean
  createdAt: string
}

export interface TransactionDto {
  id: string
  walletId: string
  type: TransactionType
  direction: TransactionDirection
  amount: number
  fee: number
  balanceAfter: number
  currency: string
  description: string
  referenceId?: string
  referenceType?: string
  status: TransactionStatus
  createdAt: string
}

export interface WalletParameterDto {
  key: string
  value: string
  description?: string
}

export interface DepositRequest {
  amount: number
  description: string
}

export interface DepositResponse {
  id: string
  walletId: string
  amount: number
  fee: number
  balanceAfter: number
  currency: string
}

export interface TransferRequest {
  senderExternalProfileId: string
  receiverExternalProfileId: string
  amount: number
  description: string
}

export interface TransferResponse {
  transactionId: string
  amountSent: number
  fee: number
  senderNewBalance: number
}

export interface ProcedurePaymentRequest {
  externalProfileId: string
  procedureId: string
  amount: number
  description: string
}

export interface MarketplacePaymentRequest {
  buyerExternalProfileId: string
  sellerExternalProfileId: string
  serviceId: string
  amount: number
  description: string
}

export interface TransactionListQuery {
  walletId?: string
  pageNumber?: number
  pageSize?: number
  type?: TransactionType
  status?: TransactionStatus
  currency?: string
  fromDate?: string
  toDate?: string
}

export interface UpdateWalletParameterRequest {
  value: string
}

export interface PlatformRevenueCurrencySummary {
  currency: string
  platformBalance: number
  totalEscrowHeld: number
}

export interface PlatformRevenueDto {
  currencies: PlatformRevenueCurrencySummary[]
  platformWallets: WalletDto[]
}

