import { ProcedureProfileType, UserProcedureStatus } from '../shared/enums.model'

export interface DayScheduleDto {
  day: number
  isClosed: boolean
  openTime?: string
  closeTime?: string
}

export interface LocationDto {
  id: string
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  latitude: number
  longitude: number
  phoneNumber?: string
  website?: string
  schedule: DayScheduleDto[]
}

export interface ProcedureDto {
  id: string
  title: string
  description: string
  costAmount: number
  costCurrency: string
  profileType: ProcedureProfileType
  profileTypeId: string
  estimatedDurationDays: number
  isActive: boolean
  locations: LocationDto[]
  dependencyIds: string[]
  requiredDocumentTypeIds: string[]
  outputDocumentType: string[]
  createdAt: string
}

export interface UserProcedureDto {
  id: string
  profileId: string
  procedureId: string
  procedureTitle: string
  costAmount?: number
  costCurrency?: string
  status: UserProcedureStatus
  completedByUserId?: string
  completedByRole?: string
  completedAt?: string
  notes?: string
  createdAt: string
}

export interface ProcedureProgressDto {
  profileId: string
  total: number
  completed: number
  inProgress: number
  notStarted: number
  skipped: number
  completionPercentage: number
}

export interface DayScheduleRequest {
  day: number
  isClosed: boolean
  openTime?: string
  closeTime?: string
}

export interface InlineLocationRequest {
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  latitude: number
  longitude: number
  phoneNumber?: string
  website?: string
  schedule: DayScheduleRequest[]
}

export interface CreateProcedureRequest {
  title: string
  description: string
  costAmount: number
  costCurrency: string
  profileType: ProcedureProfileType
  profileTypeId: string
  estimatedDurationDays: number
  locationIds: string[]
  inlineLocations: InlineLocationRequest[]
  dependencyIds: string[]
  requiredDocumentTypeIds: string[]
}

export interface UpdateProcedureRequest {
  title: string
  description: string
  costAmount: number
  costCurrency: string
  estimatedDurationDays: number
  locationIds: string[]
  inlineLocations: InlineLocationRequest[]
  dependencyIds: string[]
  requiredDocumentTypeIds: string[]
}

export interface CreateLocationRequest {
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  latitude: number
  longitude: number
  phoneNumber?: string
  website?: string
  schedule: DayScheduleRequest[]
}

export interface StartUserProcedureRequest {
  profileId: string
  procedureId: string
}

export interface CompleteUserProcedureRequest {
  profileId: string
  notes?: string
}

export interface SkipUserProcedureRequest {
  notes?: string
}

export interface CreateProcedureResponse {
  procedureId: string
}

export interface StartUserProcedureResponse {
  userProcedureId: string
}
