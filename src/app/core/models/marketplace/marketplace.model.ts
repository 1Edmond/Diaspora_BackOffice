import {
  ListingStatus,
  PaymentMode,
  PaymentStatus,
  ReportStatus,
  ReportTargetType,
  ServiceRequestStatus,
  VerificationLevel,
} from '../shared/enums.model'

export {
  ListingStatus,
  PaymentMode,
  PaymentStatus,
  ReportStatus,
  ReportTargetType,
  ServiceRequestStatus,
  VerificationLevel,
}
export { ListingStatusLabels, ListingStatusBadgeVariants } from '../shared/enums.model'
export { PaymentModeLabels } from '../shared/enums.model'
export { PaymentStatusLabels, PaymentStatusBadgeVariants } from '../shared/enums.model'
export { ServiceRequestStatusLabels, ServiceRequestStatusBadgeVariants } from '../shared/enums.model'
export { ReportStatusLabels, ReportStatusBadgeVariants } from '../shared/enums.model'
export { ReportTargetTypeLabels } from '../shared/enums.model'
export { VerificationLevelLabels, VerificationLevelBadgeVariants } from '../shared/enums.model'

export interface CategoryPolicyDto {
  minPublishLevel: VerificationLevel
  minBookLevel: VerificationLevel
  maxWeightKg?: number
  maxValueAmount?: number
  requiresEscrow: boolean
  requiresPreModeration: boolean
  defaultCommissionRate: number
}

export interface ServiceListingSummaryDto {
  id: string
  providerId: string
  providerName: string
  categoryName: string
  title: string
  paymentMode: PaymentMode
  price?: number
  currency?: string
  averageRating: number
  reviewCount: number
  thumbnailUrl?: string
  createdAt: string
  status: ListingStatus
  city?: string
  country?: string
  departureCountryCode?: string
  departureCity?: string
  arrivalCountryCode?: string
  arrivalCity?: string
  departureDate?: string
  arrivalDate?: string
  pickupDeadline?: string
  capacityKg?: number
  remainingKg?: number
  pricePerKg?: number
  transportMode?: string
  flightOrTransportNumber?: string
}

export interface ServiceListingDto {
  id: string
  providerId: string
  providerName: string
  categoryId: string
  categoryName: string
  title: string
  description: string
  contactInfo?: string
  paymentMode: PaymentMode
  price?: number
  currency?: string
  status: ListingStatus
  isActive: boolean
  imageUrls: string[]
  averageRating: number
  reviewCount: number
  viewCount: number
  createdAt: string
  departureCountryCode?: string
  departureCity?: string
  arrivalCountryCode?: string
  arrivalCity?: string
  departureDate?: string
  arrivalDate?: string
  pickupDeadline?: string
  capacityKg?: number
  remainingKg?: number
  pricePerKg?: number
  transportMode?: string
  flightOrTransportNumber?: string
  prohibitedItemsDescription?: string
  meetingPoints?: string
}

export interface CategoryDto {
  id: string
  name: string
  slug: string
  description?: string
  iconUrl?: string
  isActive: boolean
  displayOrder: number
  listingCount: number
  policy?: CategoryPolicyDto
}

export interface ReviewDto {
  id: string
  listingId: string
  reviewerId: string
  reviewerName: string
  rating: number
  comment: string
  isVerified: boolean
  createdAt: string
}

export interface ReportDto {
  id: string
  targetType: ReportTargetType
  targetId: string
  reporterId: string
  reporterName: string
  reason: string
  status: ReportStatus
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  resolutionNotes?: string
}

export interface ServiceRequestDto {
  id: string
  listingId: string
  listingTitle: string
  requesterId: string
  requesterName: string
  providerId: string
  providerName: string
  message: string
  status: ServiceRequestStatus
  agreedPrice?: number
  agreedCurrency?: string
  paymentStatus: PaymentStatus
  walletTransactionId?: string
  createdAt: string
  acceptedAt?: string
  completedAt?: string
  weightKg?: number
  packageDescription?: string
  packageContentCategory?: string
  declaredValue?: number
  handoverConfirmedAt?: string
  deliveryConfirmedAt?: string
  handoverProofUrl?: string
  deliveryProofUrl?: string
  settlementType?: number
  cashTiming?: number
  platformDirectFeeAmount?: number
  isDirectCashSettled?: boolean
}

export type ServiceRequest = ServiceRequestDto

// Admin DTOs
export interface AdminListingListQuery {
  page?: number
  pageSize?: number
  categoryId?: string
  search?: string
  paymentMode?: PaymentMode
  minPrice?: number
  maxPrice?: number
  city?: string
  country?: string
  sortBy?: number
  status?: ListingStatus
  providerId?: string
}

export interface AdminServiceRequestQuery {
  page?: number
  pageSize?: number
  status?: ServiceRequestStatus
  paymentStatus?: PaymentStatus
  providerId?: string
  requesterId?: string
  dateFrom?: string
  dateTo?: string
}

export interface ProviderStatsDto {
  totalListings: number
  activeListings: number
  totalRequests: number
  acceptedRequests: number
  completedRequests: number
  acceptanceRate: number
  avgResponseHours: number | null
  totalRevenue: number
  averageRating: number
  reviewCount: number
  favoritesCount: number
}

export interface CreateListingRequest {
  title: string
  description: string
  contactInfo?: string
  categoryId: string
  paymentMode: PaymentMode
  price?: number
  currency?: string
}

export interface UpdateListingRequest {
  title: string
  description: string
  contactInfo?: string
  categoryId: string
  paymentMode: PaymentMode
  price?: number
  currency?: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  iconUrl?: string
  displayOrder: number
  translations?: { [culture: string]: { [field: string]: string } }
}

export interface UpdateCategoryRequest {
  name: string
  description?: string
  iconUrl?: string
  displayOrder: number
  translations?: { [culture: string]: { [field: string]: string } }
}

export interface UpdateCategoryPolicyRequest {
  minPublishLevel: VerificationLevel
  minBookLevel: VerificationLevel
  maxWeightKg?: number
  maxValueAmount?: number
  requiresEscrow: boolean
  requiresPreModeration: boolean
  defaultCommissionRate: number
}

export interface CreateReviewRequest {
  rating: number
  comment: string
}

export interface CreateServiceRequest {
  listingId: string
  message: string
  agreedPrice?: number
  agreedCurrency?: string
}

export interface ListingListQuery {
  page?: number
  pageSize?: number
  categoryId?: string
  search?: string
  paymentMode?: PaymentMode
  minPrice?: number
  maxPrice?: number
}

export interface CreateListingResponse {
  id: string
}

export interface CreateServiceRequestResponse {
  id: string
}
