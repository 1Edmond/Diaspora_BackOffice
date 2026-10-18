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
  HoldFundsUpfront = 0,
  PayOnCompletion = 1,
}

export enum CheckInMethod {
  None = 0,
  QRCode = 1,
  GeoLocation = 2,
  Manual = 3,
}

export enum JobApplicationStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Withdrawn = 3,
  Completed = 4,
  NoShow = 5,
}

export enum CheckInStatus {
  Pending = 0,
  CheckedIn = 1,
  CheckedOut = 2,
  NoShow = 3,
}

export interface JobCategoryDto {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
  parentCategoryId?: string;
  parentCategoryName?: string;
  isActive: boolean;
  displayOrder: number;
  jobCount?: number;
  translations?: { [culture: string]: { [field: string]: string } };
}

export interface CreateJobCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
  parentCategoryId?: string;
  displayOrder: number;
  translations?: { [culture: string]: { [field: string]: string } };
}

export interface UpdateJobCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
  parentCategoryId?: string;
  displayOrder: number;
  isActive?: boolean;
  translations?: { [culture: string]: { [field: string]: string } };
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

export interface JobReviewDto {
  id: string;
  jobApplicationId: string;
  raterId: string;
  raterName: string;
  subjectId: string;
  subjectName: string;
  raterRole: number; // 0: Employer, 1: Worker
  rating: number;
  punctuality?: number;
  quality?: number;
  communication?: number;
  comment?: string;
  createdAt: string;
}

export interface JobTemplateDto {
  id: string;
  employerId: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  capacity: number;
  amount: number;
  currency: string;
  paymentType: PaymentType;
  paymentTiming: PaymentTiming;
  checkInMethod: CheckInMethod;
  geofenceRadiusMeters?: number;
  requiresKycVerification: boolean;
  latitude?: number;
  longitude?: number;
  requiredSkills: string[];
  requiredDocuments: string[];
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
