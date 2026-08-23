export interface PhoneNumber {
  value: string
  countryCode: string
}

export interface User {
  id: string;
  email: string;
  role: string[];
  status: string;
  emailVerified: boolean;
  kycLevel: string;
  phoneNumber?: PhoneNumber;
  kycSubmittedAt?: string;
  kycApprovedAt?: string;
  firstName?: string;
  lastName?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface UserListQuery {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: string;
  emailVerified?: boolean;
  includeDeleted?: boolean;
}

export interface UserListResponse {
  items: User[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface KYCStatistics {
  totalUsers: number;
  usersWithNoKYC: number;
  usersWithBasicKYC: number;
  usersWithIntermediateKYC: number;
  usersWithAdvancedKYC: number;
  kycSubmittedToday: number;
  kycApprovedToday: number;
  verificationRate: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: string[];
  firstName?: string;
  dateOfBirth: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SuspendUserRequest {
  reason: string;
}

export interface RefreshToken {
  id: string;
  token: string;
  expires: string;
  createdByIp: string;
  revokedAt?: string;
  revokedByIp?: string;
  replacedByToken?: string;
  isExpired: boolean;
  isRevoked: boolean;
  isActive: boolean;
  createdAt: string;
}
