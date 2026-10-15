import {
  ProfileStatus,
  ProfileKind,
  ProfileStatusLabels,
  ProfileStatusBadgeVariants,
  ProfileKindLabels,
  VerificationLevel,
  VerificationLevelLabels,
  VerificationLevelBadgeVariants,
} from '../shared/enums.model'

export {
  ProfileStatus,
  ProfileKind,
  ProfileStatusLabels,
  ProfileStatusBadgeVariants,
  ProfileKindLabels,
  VerificationLevel,
  VerificationLevelLabels,
  VerificationLevelBadgeVariants,
}

export interface ProfileDto {
  id: string
  userId: string
  profileTypeId: string
  profileTypeName?: string
  countryCode?: string
  flag?: string
  phoneNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  status: ProfileStatus
  verifiedAt?: string
  verifiedByAdminId?: string
  verificationLevel?: VerificationLevel
  createdAt: string
}

export interface UserProfilesDto {
  profiles: ProfileDto[]
}

export interface CreateProfileRequest {
  profileTypeId: string
  phoneNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  kind: ProfileKind
}

export interface ChangeProfileKindRequest {
  newKind: ProfileKind
}

export interface ProfileTypeDto {
  id: string
  countryName: string
  countryCode: string
  phoneIndicatif: string
  currency: string
  flag?: string
  isActive: boolean
}

export interface CreateProfileTypeRequest {
  countryName: string
  countryCode: string
  phoneIndicatif: string
  currency: string
  flag?: string
}
