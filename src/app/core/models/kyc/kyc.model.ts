import { KYCStatus } from '../shared/enums.model'

export interface KycVerification {
  id: string
  userId: string
  userEmail?: string
  userFirstName?: string
  userLastName?: string
  status: KYCStatus
  level: string
  documents: KycDocument[]
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
  additionalInfoRequest?: string
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface KycDocument {
  id: string
  verificationId: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedAt: string
  documentType?: string
}

export interface CreateKycVerificationRequest {
  level: string
}

export interface KycListQuery {
  pageNumber?: number
  pageSize?: number
  status?: KYCStatus
  searchTerm?: string
}

export interface ApproveKycRequest {
  notes?: string
}

export interface RejectKycRequest {
  reason: string
  notes?: string
}

export interface RequestMoreInfoRequest {
  message: string
}
