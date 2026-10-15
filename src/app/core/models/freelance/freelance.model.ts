export enum JobPostingStatus {
  Draft = 0,
  Published = 1,
  RegistrationClosed = 2,
  InProgress = 3,
  Completed = 4,
  Cancelled = 5,
}

export enum PaymentType {
  Fixed = 0,
  Hourly = 1,
  Daily = 2,
}

export enum PaymentTiming {
  OnCompletion = 0,
  Milestones = 1,
  Advance = 2,
}

export enum CheckInMethod {
  Manual = 0,
  Geofence = 1,
  QrCode = 2,
  Otp = 3,
}

export enum JobApplicationStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Cancelled = 3,
  Completed = 4,
}

export enum CheckInStatus {
  Pending = 0,
  CheckedIn = 1,
  CheckedOut = 2,
  Verified = 3,
  Disputed = 4,
}

export interface JobCategoryDto {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface JobPostingSummaryDto {
  id: string;
  employerId: string;
  employerName: string;
  categoryId: string;
  categoryName: string;
  title: string;
  capacity: number;
  acceptedCount: number;
  amount: number;
  currency: string;
  paymentType: PaymentType;
  paymentTiming: PaymentTiming;
  eventStartAt: string;
  eventEndAt: string;
  city?: string;
  country?: string;
  isRemote: boolean;
  status: JobPostingStatus;
  createdAt: string;
}

export interface JobPostingDto extends JobPostingSummaryDto {
  description: string;
  templateId?: string;
  checkInMethod: CheckInMethod;
  geofenceRadiusMeters?: number;
  requiresKycVerification: boolean;
  latitude?: number;
  longitude?: number;
  requiredSkills: string[];
  requiredDocuments: string[];
  registrationDeadline?: string;
}

export interface JobApplicationDto {
  id: string;
  jobPostingId: string;
  jobPostingTitle: string;
  workerId: string;
  workerName: string;
  employerId: string;
  employerName: string;
  message?: string;
  status: JobApplicationStatus;
  decidedAt?: string;
  decidedBy?: string;
  rejectionReason?: string;
  chatThreadId?: string;
  escrowTransactionId?: string;
  createdAt: string;
}

export interface JobCheckInDto {
  id: string;
  jobApplicationId: string;
  jobPostingTitle: string;
  workerId: string;
  workerName: string;
  method: CheckInMethod;
  status: CheckInStatus;
  checkedInAt?: string;
  checkedOutAt?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
