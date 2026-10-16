import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedList } from '../models/shared/base-response.model';
import {
  ApproveKycRequest,
  CreateKycVerificationRequest,
  KycListQuery,
  KycVerification,
  RejectKycRequest,
  RequestMoreInfoRequest,
} from '../models/kyc/kyc.model';
import {
  CountryKycRequirementDto,
  CreateCountryKycRequirementRequest,
  KycComplianceDto,
  UpdateCountryKycRequirementRequest,
} from '../models/kyc/kyc-requirement.model';

@Injectable({
  providedIn: 'root',
})
export class KycService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/kyc`;

  constructor(private http: HttpClient) {}

  createVerification(data: CreateKycVerificationRequest): Observable<KycVerification> {
    return this.http.post<KycVerification>(this.apiUrl, data);
  }

  getVerification(id: string): Observable<KycVerification> {
    return this.http.get<KycVerification>(`${this.apiUrl}/${id}`);
  }

  getMyVerification(): Observable<KycVerification> {
    return this.http.get<KycVerification>(`${this.apiUrl}/my-verification`);
  }

  getUserCompliance(userId: string, profileTypeId?: string): Observable<KycComplianceDto> {
    const params: any = {};
    if (profileTypeId) params.profileTypeId = profileTypeId;
    return this.http.get<KycComplianceDto>(`${this.apiUrl}/user/${userId}/compliance`, { params });
  }

  getVerifications(query: KycListQuery = {}): Observable<PagedList<KycVerification>> {
    const params: any = {};
    if (query.pageNumber != null) params.pageNumber = query.pageNumber;
    if (query.pageSize != null) params.pageSize = query.pageSize;
    if (query.status != null) params.status = query.status;
    if (query.searchTerm) params.searchTerm = query.searchTerm;
    return this.http.get<PagedList<KycVerification>>(this.apiUrl, { params });
  }

  getPendingVerifications(pageNumber = 1, pageSize = 10): Observable<PagedList<KycVerification>> {
    return this.http.get<PagedList<KycVerification>>(`${this.apiUrl}/pending`, {
      params: { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() },
    });
  }

  submitForReview(id: string): Observable<KycVerification> {
    return this.http.post<KycVerification>(`${this.apiUrl}/${id}/submit`, {});
  }

  startReview(id: string): Observable<KycVerification> {
    return this.http.post<KycVerification>(`${this.apiUrl}/${id}/start-review`, {});
  }

  approve(id: string, data: ApproveKycRequest): Observable<KycVerification> {
    return this.http.post<KycVerification>(`${this.apiUrl}/${id}/approve`, data);
  }

  reject(id: string, data: RejectKycRequest): Observable<KycVerification> {
    return this.http.post<KycVerification>(`${this.apiUrl}/${id}/reject`, data);
  }

  requestMoreInfo(id: string, data: RequestMoreInfoRequest): Observable<KycVerification> {
    return this.http.post<KycVerification>(`${this.apiUrl}/${id}/request-info`, data);
  }

  uploadDocument(verificationId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${verificationId}/documents`, formData);
  }

  removeDocument(verificationId: string, documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${verificationId}/documents/${documentId}`);
  }

  downloadDocument(verificationId: string, documentId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${verificationId}/documents/${documentId}/download`, {
      responseType: 'blob',
    });
  }

  // Requirements CRUD
  getRequirements(profileTypeId?: string): Observable<CountryKycRequirementDto[]> {
    const params: any = {};
    if (profileTypeId) params.profileTypeId = profileTypeId;
    return this.http.get<CountryKycRequirementDto[]>(`${this.apiUrl}/requirements`, { params });
  }

  createRequirement(data: CreateCountryKycRequirementRequest): Observable<CountryKycRequirementDto> {
    return this.http.post<CountryKycRequirementDto>(`${this.apiUrl}/requirements`, data);
  }

  updateRequirement(id: string, data: UpdateCountryKycRequirementRequest): Observable<CountryKycRequirementDto> {
    return this.http.put<CountryKycRequirementDto>(`${this.apiUrl}/requirements/${id}`, data);
  }

  deleteRequirement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/requirements/${id}`);
  }
}
