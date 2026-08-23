import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedList } from '../models/shared/base-response.model';
import {
  CreateDocumentTypeRequest,
  DocumentDto,
  DocumentListQuery,
  DocumentTypeDto,
  RejectDocumentRequest,
  UploadDocumentResponse,
  ValidateDocumentRequest,
} from '../models/document/document.model';
import { BaseResponse } from '../models/shared/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/documents`;
  private readonly docTypeApiUrl = `${environment.apiBaseUrl}/api/document-types`;

  constructor(private http: HttpClient) {}

  uploadDocument(profileId: string, documentTypeId: string, file: File): Observable<UploadDocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('profileId', profileId);
    formData.append('documentTypeId', documentTypeId);
    return this.http.post<UploadDocumentResponse>(`${this.apiUrl}/upload`, formData);
  }

  getDocument(id: string): Observable<DocumentDto> {
    return this.http.get<DocumentDto>(`${this.apiUrl}/${id}`);
  }

  getProfileDocuments(profileId: string, query: DocumentListQuery = {}): Observable<PagedList<DocumentDto>> {
    const params: any = {};
    if (query.pageNumber != null) params.pageNumber = query.pageNumber;
    if (query.pageSize != null) params.pageSize = query.pageSize;
    return this.http.get<PagedList<DocumentDto>>(`${this.apiUrl}/profile/${profileId}`, { params });
  }

  getExpiringDocuments(daysAhead = 30, pageNumber = 1, pageSize = 20): Observable<PagedList<DocumentDto>> {
    return this.http.get<PagedList<DocumentDto>>(`${this.apiUrl}/expiring`, {
      params: { daysAhead: daysAhead.toString(), pageNumber: pageNumber.toString(), pageSize: pageSize.toString() },
    });
  }

  validateDocument(id: string, data: ValidateDocumentRequest = {}): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/${id}/validate`, data);
  }

  rejectDocument(id: string, data: RejectDocumentRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/${id}/reject`, data);
  }

  deleteDocument(id: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.apiUrl}/${id}`);
  }

  downloadDocument(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  getDocumentTypes(): Observable<DocumentTypeDto[]> {
    return this.http.get<DocumentTypeDto[]>(this.docTypeApiUrl);
  }

  createDocumentType(data: CreateDocumentTypeRequest): Observable<DocumentTypeDto> {
    return this.http.post<DocumentTypeDto>(this.docTypeApiUrl, data);
  }

  deactivateDocumentType(id: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.docTypeApiUrl}/${id}/deactivate`, {});
  }
}
