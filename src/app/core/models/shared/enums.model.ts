export enum KYCLevel {
  None = 1,
  Basic = 2,
  Intermediate = 3,
  Advanced = 4,
}

export enum KYCStatus {
  Draft = 1,
  Pending = 2,
  UnderReview = 3,
  MoreInfoRequired = 4,
  Approved = 5,
  Rejected = 6,
  Expired = 7,
  RequiresUpdate = 8,
}

export enum UserStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Deleted = 4,
}

export enum FeeType {
  Percentage = 0,
  Fixed = 1,
}

export enum ProcedureProfileType {
  Internal = 0,
  External = 1,
}

export const ProcedureProfileTypeLabels: Record<ProcedureProfileType, string> = {
  [ProcedureProfileType.Internal]: 'Internal',
  [ProcedureProfileType.External]: 'External',
}

export enum UserProcedureStatus {
  NotStarted = 0,
  InProgress = 1,
  Completed = 2,
  Skipped = 3,
}

export const UserProcedureStatusLabels: Record<UserProcedureStatus, string> = {
  [UserProcedureStatus.NotStarted]: 'Not Started',
  [UserProcedureStatus.InProgress]: 'In Progress',
  [UserProcedureStatus.Completed]: 'Completed',
  [UserProcedureStatus.Skipped]: 'Skipped',
}

export const UserProcedureStatusBadgeVariants: Record<UserProcedureStatus, string> = {
  [UserProcedureStatus.NotStarted]: 'warning',
  [UserProcedureStatus.InProgress]: 'info',
  [UserProcedureStatus.Completed]: 'success',
  [UserProcedureStatus.Skipped]: 'secondary',
}

export enum SensitiveDataType {
  General = 0,
  MedicalData = 1,
  IdentityDocument = 2,
  ContactInfo = 3,
  FinancialData = 4,
  BiometricData = 5,
}

export enum TransactionType {
  Deposit = 0,
  TransferOut = 1,
  TransferIn = 2,
  TransferFee = 3,
  ProcedurePayment = 4,
  MarketplacePayment = 5,
  MarketplaceReceipt = 6,
  Refund = 7,
}

export enum TransactionDirection {
  Credit = 0,
  Debit = 1,
}

export enum TransactionStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
}

export enum ListingStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Suspended = 3,
}

export enum PaymentMode {
  ContactOnly = 0,
  WalletPayment = 1,
  Both = 2,
}

export enum PaymentStatus {
  NotApplicable = 0,
  Pending = 1,
  Completed = 2,
  Refunded = 3,
  Failed = 4,
}

export enum ServiceRequestStatus {
  Pending = 0,
  Accepted = 1,
  Declined = 2,
  Completed = 3,
  Cancelled = 4,
}

export const DefaultRoles = {
  Admin: '11111111-1111-1111-1111-111111111111',
  User: '22222222-2222-2222-2222-222222222222',
  Moderator: '33333333-3333-3333-3333-333333333333',
} as const

export const KYCStatusLabels: Record<KYCStatus, string> = {
  [KYCStatus.Draft]: 'Draft',
  [KYCStatus.Pending]: 'Pending',
  [KYCStatus.UnderReview]: 'Under Review',
  [KYCStatus.MoreInfoRequired]: 'More Info Required',
  [KYCStatus.Approved]: 'Approved',
  [KYCStatus.Rejected]: 'Rejected',
  [KYCStatus.Expired]: 'Expired',
  [KYCStatus.RequiresUpdate]: 'Requires Update',
}

export const KYCStatusBadgeVariants: Record<KYCStatus, string> = {
  [KYCStatus.Draft]: 'secondary',
  [KYCStatus.Pending]: 'warning',
  [KYCStatus.UnderReview]: 'info',
  [KYCStatus.MoreInfoRequired]: 'primary',
  [KYCStatus.Approved]: 'success',
  [KYCStatus.Rejected]: 'danger',
  [KYCStatus.Expired]: 'dark',
  [KYCStatus.RequiresUpdate]: 'warning',
}

export const UserStatusBadgeVariants: Record<UserStatus, string> = {
  [UserStatus.Active]: 'success',
  [UserStatus.Inactive]: 'secondary',
  [UserStatus.Suspended]: 'danger',
  [UserStatus.Deleted]: 'dark',
}

export enum DocumentStatus {
  Pending = 0,
  Active = 1,
  Expired = 2,
  Rejected = 3,
}

export enum ProfileStatus {
  PendingVerification = 0,
  Verified = 1,
  Suspended = 2,
  Activate = 3,
}

export enum ProfileKind {
  Boursier = 0,
  Contractuel = 1,
  Citoyen = 2,
}

export const DocumentStatusLabels: Record<DocumentStatus, string> = {
  [DocumentStatus.Pending]: 'Pending',
  [DocumentStatus.Active]: 'Active',
  [DocumentStatus.Expired]: 'Expired',
  [DocumentStatus.Rejected]: 'Rejected',
}

export const DocumentStatusBadgeVariants: Record<DocumentStatus, string> = {
  [DocumentStatus.Pending]: 'warning',
  [DocumentStatus.Active]: 'success',
  [DocumentStatus.Expired]: 'dark',
  [DocumentStatus.Rejected]: 'danger',
}

export const ProfileStatusLabels: Record<ProfileStatus, string> = {
  [ProfileStatus.PendingVerification]: 'Pending Verification',
  [ProfileStatus.Verified]: 'Verified',
  [ProfileStatus.Suspended]: 'Suspended',
  [ProfileStatus.Activate]: 'Active',
}

export const ProfileStatusBadgeVariants: Record<ProfileStatus, string> = {
  [ProfileStatus.PendingVerification]: 'warning',
  [ProfileStatus.Verified]: 'success',
  [ProfileStatus.Suspended]: 'danger',
  [ProfileStatus.Activate]: 'info',
}

export const ProfileKindLabels: Record<ProfileKind, string> = {
  [ProfileKind.Boursier]: 'Boursier',
  [ProfileKind.Contractuel]: 'Contractuel',
  [ProfileKind.Citoyen]: 'Citoyen',
}

export const ListingStatusLabels: Record<ListingStatus, string> = {
  [ListingStatus.Pending]: 'Pending',
  [ListingStatus.Approved]: 'Approved',
  [ListingStatus.Rejected]: 'Rejected',
  [ListingStatus.Suspended]: 'Suspended',
}

export const ListingStatusBadgeVariants: Record<ListingStatus, string> = {
  [ListingStatus.Pending]: 'warning',
  [ListingStatus.Approved]: 'success',
  [ListingStatus.Rejected]: 'danger',
  [ListingStatus.Suspended]: 'secondary',
}

export const PaymentModeLabels: Record<PaymentMode, string> = {
  [PaymentMode.ContactOnly]: 'Contact Only',
  [PaymentMode.WalletPayment]: 'Wallet Payment',
  [PaymentMode.Both]: 'Both',
}

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.NotApplicable]: 'Not Applicable',
  [PaymentStatus.Pending]: 'Pending',
  [PaymentStatus.Completed]: 'Completed',
  [PaymentStatus.Refunded]: 'Refunded',
  [PaymentStatus.Failed]: 'Failed',
}

export const PaymentStatusBadgeVariants: Record<PaymentStatus, string> = {
  [PaymentStatus.NotApplicable]: 'secondary',
  [PaymentStatus.Pending]: 'warning',
  [PaymentStatus.Completed]: 'success',
  [PaymentStatus.Refunded]: 'info',
  [PaymentStatus.Failed]: 'danger',
}

export const ServiceRequestStatusLabels: Record<ServiceRequestStatus, string> = {
  [ServiceRequestStatus.Pending]: 'Pending',
  [ServiceRequestStatus.Accepted]: 'Accepted',
  [ServiceRequestStatus.Declined]: 'Declined',
  [ServiceRequestStatus.Completed]: 'Completed',
  [ServiceRequestStatus.Cancelled]: 'Cancelled',
}

export const ServiceRequestStatusBadgeVariants: Record<ServiceRequestStatus, string> = {
  [ServiceRequestStatus.Pending]: 'warning',
  [ServiceRequestStatus.Accepted]: 'info',
  [ServiceRequestStatus.Declined]: 'danger',
  [ServiceRequestStatus.Completed]: 'success',
  [ServiceRequestStatus.Cancelled]: 'secondary',
}

export const TransactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.Deposit]: 'Deposit',
  [TransactionType.TransferOut]: 'Transfer Out',
  [TransactionType.TransferIn]: 'Transfer In',
  [TransactionType.TransferFee]: 'Transfer Fee',
  [TransactionType.ProcedurePayment]: 'Procedure Payment',
  [TransactionType.MarketplacePayment]: 'Marketplace Payment',
  [TransactionType.MarketplaceReceipt]: 'Marketplace Receipt',
  [TransactionType.Refund]: 'Refund',
}

export const TransactionDirectionLabels: Record<TransactionDirection, string> = {
  [TransactionDirection.Credit]: 'Credit',
  [TransactionDirection.Debit]: 'Debit',
}

export const TransactionDirectionBadgeVariants: Record<TransactionDirection, string> = {
  [TransactionDirection.Credit]: 'success',
  [TransactionDirection.Debit]: 'danger',
}

export const TransactionStatusLabels: Record<TransactionStatus, string> = {
  [TransactionStatus.Pending]: 'Pending',
  [TransactionStatus.Completed]: 'Completed',
  [TransactionStatus.Failed]: 'Failed',
}

export const TransactionStatusBadgeVariants: Record<TransactionStatus, string> = {
  [TransactionStatus.Pending]: 'warning',
  [TransactionStatus.Completed]: 'success',
  [TransactionStatus.Failed]: 'danger',
}
