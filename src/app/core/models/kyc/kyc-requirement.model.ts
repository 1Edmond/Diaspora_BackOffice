export interface CountryKycRequirementDto {
  id: string;
  profileTypeId: string;
  documentTypeId: string;
  documentTypeCode: string;
  purpose: string;
  isRequired: boolean;
  isActive: boolean;
  targetLevel: number;
  requiredDistinctDocumentsCount: number;
  createdAt: string;
}

export type CountryKycRequirement = CountryKycRequirementDto;

export interface CreateCountryKycRequirementRequest {
  profileTypeId: string;
  documentTypeId: string;
  documentTypeCode: string;
  purpose: string;
  isRequired: boolean;
  targetLevel: number;
  requiredDistinctDocumentsCount: number;
}

export interface UpdateCountryKycRequirementRequest {
  purpose: string;
  isRequired: boolean;
  isActive: boolean;
  targetLevel: number;
  requiredDistinctDocumentsCount: number;
}

export interface KycComplianceDto {
  userId: string;
  profileTypeId: string;
  currentKycStatus?: string;
  approvedVerificationLevel: number;
  isCompliantForActivation: boolean;
  requiredDistinctDocumentsCount: number;
  submittedDistinctDocumentsCount: number;
  missingMandatoryDocuments: string[];
}
