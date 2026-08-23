export interface LoginRequest {
  email: string;
  password: string;
  ipAddress?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string[];
  firstName?: string;
  dateOfBirth: string; // ISO date string
  lastName?: string;
  phoneNumber?: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  ipAddress?: string;
}

export interface TwoFactorRequest {
  email: string;
  code: string;
}

export interface LoginPinRequest {
  email: string;
  pin: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface UserDto {
  id: string;
  email: string;
  role: string[];
  status: string;
  emailVerified: boolean;
  kycLevel: string;
  phoneNumber?: string;
  kycSubmittedAt?: string;
  kycApprovedAt?: string;
  firstName?: string;
  lastName?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface LoginResponse {
  userId: string;
  user: UserDto;
  role: string[];
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}