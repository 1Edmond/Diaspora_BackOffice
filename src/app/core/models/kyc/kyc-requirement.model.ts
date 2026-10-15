export interface CountryKycRequirementDto {
  id: string;
  profileTypeId: string;
  documentTypeId: string;
  documentTypeCode: string;
  purpose: string;
  isRequired: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCountryKycRequirementRequest {
  profileTypeId: string;
  documentTypeId: string;
  documentTypeCode: string;
  purpose: string;
  isRequired: boolean;
}

export interface UpdateCountryKycRequirementRequest {
  purpose: string;
  isRequired: boolean;
  isActive: boolean;
}
