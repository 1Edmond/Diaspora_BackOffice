import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedList } from '../models/shared/base-response.model';
import {
  ChangeProfileKindRequest,
  CreateProfileRequest,
  CreateProfileTypeRequest,
  ProfileDto,
  ProfileTypeDto,
  UserProfilesDto,
} from '../models/profile/profile.model';
import { BaseResponse } from '../models/shared/base-response.model';
import { DocumentDto } from '../models/document/document.model';
import { KycVerification } from '../models/kyc/kyc.model';
import { ServiceListingSummaryDto } from '../models/marketplace/marketplace.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/profiles`;
  private readonly typeApiUrl = `${environment.apiBaseUrl}/api/profile-types`;
  private readonly documentApiUrl = `${environment.apiBaseUrl}/api/documents`;
  private readonly kycApiUrl = `${environment.apiBaseUrl}/api/kyc`;
  private readonly marketplaceApiUrl = `${environment.apiBaseUrl}/api/servicelisting`;

  constructor(private http: HttpClient) {}

  getMyProfiles(): Observable<UserProfilesDto> {
    return this.http.get<UserProfilesDto>(`${this.apiUrl}/me`);
  }

  getProfiles(query: { pageNumber?: number; pageSize?: number; searchTerm?: string; status?: number; profileTypeId?: string } = {}): Observable<PagedList<ProfileDto>> {
    const params: any = {};
    if (query.pageNumber != null) params.pageNumber = query.pageNumber.toString();
    if (query.pageSize != null) params.pageSize = query.pageSize.toString();
    if (query.searchTerm) params.searchTerm = query.searchTerm;
    if (query.status != null) params.status = query.status.toString();
    if (query.profileTypeId) params.profileTypeId = query.profileTypeId;
    return this.http.get<PagedList<ProfileDto>>(this.apiUrl, { params });
  }

  getProfile(id: string): Observable<ProfileDto> {
    return this.http.get<ProfileDto>(`${this.apiUrl}/${id}`);
  }

  createProfile(data: CreateProfileRequest): Observable<{ profileId: string }> {
    return this.http.post<{ profileId: string }>(this.apiUrl, data);
  }

  changeProfileKind(profileId: string, data: ChangeProfileKindRequest): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(`${this.apiUrl}/${profileId}/kind`, data);
  }

  getPendingProfiles(pageNumber = 1, pageSize = 10): Observable<PagedList<ProfileDto>> {
    return this.http.get<PagedList<ProfileDto>>(`${this.apiUrl}/pending`, {
      params: { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() },
    });
  }

  verifyProfile(profileId: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/${profileId}/verify`, {});
  }

  activateProfile(profileId: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/${profileId}/activate`, {});
  }

  suspendProfile(profileId: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/${profileId}/suspend`, {});
  }

  reactivateProfile(profileId: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/${profileId}/reactivate`, {});
  }

  getProfileTypes(): Observable<ProfileTypeDto[]> {
    return this.http.get<ProfileTypeDto[]>(this.typeApiUrl);
  }

  createProfileType(data: CreateProfileTypeRequest): Observable<ProfileTypeDto> {
    return this.http.post<ProfileTypeDto>(this.typeApiUrl, data);
  }

  updateProfileType(id: string, data: CreateProfileTypeRequest): Observable<ProfileTypeDto> {
    return this.http.put<ProfileTypeDto>(`${this.typeApiUrl}/${id}`, data);
  }

  deactivateProfileType(id: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.typeApiUrl}/${id}/deactivate`, {});
  }

  activateProfileType(id: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.typeApiUrl}/${id}/activate`, {});
  }

  republishDirectory(): Observable<{ totalProcessed: number; message: string }> {
    return this.http.post<{ totalProcessed: number; message: string }>(`${this.apiUrl}/admin/republish-directory`, {});
  }

  // Document management
  getDocumentsByProfile(profileId: string, pageNumber = 1, pageSize = 20): Observable<PagedList<DocumentDto>> {
    return this.http.get<PagedList<DocumentDto>>(`${this.documentApiUrl}/profile/${profileId}`, {
      params: { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() },
    });
  }

  getDocument(documentId: string): Observable<DocumentDto> {
    return this.http.get<DocumentDto>(`${this.documentApiUrl}/${documentId}`);
  }

  validateDocument(documentId: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.documentApiUrl}/${documentId}/validate`, {});
  }

  rejectDocument(documentId: string, reason: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.documentApiUrl}/${documentId}/reject`, { reason });
  }

  deleteDocument(documentId: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.documentApiUrl}/${documentId}`);
  }

  downloadDocument(documentId: string): Observable<Blob> {
    return this.http.get(`${this.documentApiUrl}/${documentId}/download`, { responseType: 'blob' });
  }

  setVerificationLevel(profileId: string, level: number): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/${profileId}/verification-level`, { level });
  }

  // KYC management
  getKycVerificationByUser(userId: string): Observable<KycVerification> {
    return this.http.get<KycVerification>(`${this.kycApiUrl}/user/${userId}`);
  }

  getKycVerification(id: string): Observable<KycVerification> {
    return this.http.get<KycVerification>(`${this.kycApiUrl}/${id}`);
  }

  getKycVerifications(query: { pageNumber?: number; pageSize?: number; status?: number; searchTerm?: string } = {}): Observable<PagedList<KycVerification>> {
    const params: any = {};
    if (query.pageNumber != null) params.pageNumber = query.pageNumber.toString();
    if (query.pageSize != null) params.pageSize = query.pageSize.toString();
    if (query.status != null) params.status = query.status.toString();
    if (query.searchTerm) params.searchTerm = query.searchTerm;
    return this.http.get<PagedList<KycVerification>>(this.kycApiUrl, { params });
  }

  getPendingKycVerifications(pageNumber = 1, pageSize = 20): Observable<PagedList<KycVerification>> {
    return this.http.get<PagedList<KycVerification>>(`${this.kycApiUrl}/pending`, {
      params: { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() },
    });
  }

  approveKycVerification(id: string, level = 'Intermediate', notes?: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.kycApiUrl}/${id}/approve`, { level, notes });
  }

  rejectKycVerification(id: string, reason: string, notes?: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.kycApiUrl}/${id}/reject`, { reason, notes });
  }

  requestMoreInfoKyc(id: string, message: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.kycApiUrl}/${id}/request-info`, { message });
  }

  startKycReview(id: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.kycApiUrl}/${id}/start-review`, {});
  }

  downloadKycDocument(verificationId: string, documentId: string): Observable<Blob> {
    return this.http.get(`${this.kycApiUrl}/${verificationId}/documents/${documentId}/download`, { responseType: 'blob' });
  }

  // Marketplace/Services
  getListingsByProvider(providerId: string, pageNumber = 1, pageSize = 20): Observable<PagedList<ServiceListingSummaryDto>> {
    return this.http.get<PagedList<ServiceListingSummaryDto>>(`${this.marketplaceApiUrl}`, {
      params: { pageNumber: pageNumber.toString(), pageSize: pageSize.toString(), providerId },
    });
  }
}
