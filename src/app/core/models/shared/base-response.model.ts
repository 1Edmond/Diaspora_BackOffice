export interface BaseResponse {
  success: boolean
  message?: string
  errors?: string[]
}

export interface DataResponse<T> extends BaseResponse {
  data?: T
}

export interface ErrorResponse {
  message: string
  error?: string
  timestamp: string
}

export interface PagedList<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

export interface PagedQuery {
  pageNumber?: number
  pageSize?: number
}

export interface AddressDto {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface AuditableDto {
  createdAt: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}

export interface EntityDto extends AuditableDto {
  id: string
}
