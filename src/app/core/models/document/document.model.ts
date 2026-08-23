import { DocumentStatus } from '../shared/enums.model'

export interface DocumentDto {
  id: string
  profileId: string
  documentTypeId: string
  documentTypeName: string
  documentTypeCode: string
  status: DocumentStatus
  fileName: string
  fileSize: number
  mimeType: string
  filePath: string
  expiresAt?: string
  issuedAt?: string
  issuedBy?: string
  rejectionReason?: string
  validatedAt?: string
  createdAt: string
}

export interface DocumentTypeDto {
  id: string
  name: string
  code: string
  description?: string
  isRenewable: boolean
  renewalAlertDays: number
  isRequired: boolean
  isActive: boolean
}

export interface DocumentListQuery {
  pageNumber?: number
  pageSize?: number
}

export interface ValidateDocumentRequest {
  notes?: string
}

export interface RejectDocumentRequest {
  reason: string
}

export interface CreateDocumentTypeRequest {
  profileTypeId: string
  name: string
  code: string
  description?: string
  isRenewable: boolean
  renewalAlertDays: number
  isRequired: boolean
}

export interface UploadDocumentResponse {
  documentId: string
  fileName: string
}
