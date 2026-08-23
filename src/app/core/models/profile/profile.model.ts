import { ProfileStatus, ProfileKind } from '../shared/enums.model'

export interface ProfileDto {
  id: string
  userId: string
  profileTypeId: string
  profileTypeName?: string
  phoneNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  status: ProfileStatus
  verifiedAt?: string
  verifiedByAdminId?: string
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
  isActive: boolean
}

export interface CreateProfileTypeRequest {
  countryName: string
  countryCode: string
  phoneIndicatif: string
  currency: string
}
