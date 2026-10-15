export enum DisputeStatus {
  Opened = 0,
  UnderReview = 1,
  ResolvedBuyerRefunded = 2,
  ResolvedSellerPaid = 3,
  ResolvedSplit = 4,
  Dismissed = 5,
}

export const DisputeStatusLabels: Record<DisputeStatus, string> = {
  [DisputeStatus.Opened]: 'Ouvert',
  [DisputeStatus.UnderReview]: 'En cours d\'examen',
  [DisputeStatus.ResolvedBuyerRefunded]: 'Remboursé (Acheteur)',
  [DisputeStatus.ResolvedSellerPaid]: 'Payé (Vendeur)',
  [DisputeStatus.ResolvedSplit]: 'Répartition partagée',
  [DisputeStatus.Dismissed]: 'Rejeté',
}

export const DisputeStatusBadgeVariants: Record<DisputeStatus, string> = {
  [DisputeStatus.Opened]: 'warning',
  [DisputeStatus.UnderReview]: 'info',
  [DisputeStatus.ResolvedBuyerRefunded]: 'success',
  [DisputeStatus.ResolvedSellerPaid]: 'primary',
  [DisputeStatus.ResolvedSplit]: 'secondary',
  [DisputeStatus.Dismissed]: 'danger',
}

export interface DisputeDto {
  id: string
  serviceRequestId: string
  initiatorId: string
  initiatorName?: string
  defendantId: string
  defendantName?: string
  reason: string
  description: string
  status: DisputeStatus
  evidenceUrls: string[]
  resolvedBy?: string
  resolvedAt?: string
  resolutionNotes?: string
  buyerRefundPercentage?: number
  sellerPayoutPercentage?: number
  serviceRequestAgreedPrice: number
  serviceRequestCurrency: string
  serviceRequestPaymentStatus: number
  createdAt: string
}

export interface ResolveDisputeRequest {
  finalStatus: DisputeStatus
  resolutionNotes: string
  buyerRefundPercentage?: number
  sellerPayoutPercentage?: number
}
