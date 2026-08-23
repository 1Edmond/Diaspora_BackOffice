import { ListingStatus, PaymentMode, PaymentStatus, ServiceRequestStatus } from '../shared/enums.model'

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
}

export interface UpdateCategoryRequest {
  name: string
  description?: string
  iconUrl?: string
  displayOrder: number
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
