import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  JobCategoryDto,
  JobCheckInDto,
  JobPostingDto,
  JobPostingSummaryDto,
  JobApplicationDto,
  PagedResult
} from '../models/freelance/freelance.model';

@Injectable({
  providedIn: 'root',
})
export class FreelanceService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/freelance`;

  constructor(private http: HttpClient) {}

  // --- Catégories de mission ---
  getCategories(activeOnly: boolean = false): Observable<JobCategoryDto[]> {
    return this.http.get<JobCategoryDto[]>(`${this.baseUrl}/job-categories`, {
      params: new HttpParams().set('activeOnly', activeOnly.toString()),
    });
  }

  // --- Offres de mission (Job Postings) ---
  getJobPostings(filters: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    search?: string;
    status?: number;
    activeOnly?: boolean;
    city?: string;
    country?: string;
    isRemote?: boolean;
  } = {}): Observable<PagedResult<JobPostingSummaryDto>> {
    let params = new HttpParams();
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.status !== undefined && filters.status !== null) {
      params = params.set('status', filters.status.toString());
    }
    if (filters.activeOnly !== undefined) {
      params = params.set('activeOnly', filters.activeOnly.toString());
    }
    if (filters.city) params = params.set('city', filters.city);
    if (filters.country) params = params.set('country', filters.country);
    if (filters.isRemote !== undefined) params = params.set('isRemote', filters.isRemote.toString());

    return this.http.get<PagedResult<JobPostingSummaryDto>>(`${this.baseUrl}/job-postings`, { params });
  }

  getJobPostingById(id: string): Observable<JobPostingDto> {
    return this.http.get<JobPostingDto>(`${this.baseUrl}/job-postings/${id}`);
  }

  publishJobPosting(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/job-postings/${id}/publish`, {});
  }

  cancelJobPosting(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/job-postings/${id}/cancel`, {});
  }

  closeRegistration(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/job-postings/${id}/close-registration`, {});
  }

  deleteJobPosting(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/job-postings/${id}`);
  }

  // --- Candidatures / Contrats & Suivi ---
  getReceivedApplications(page: number = 1, pageSize: number = 20): Observable<PagedResult<JobApplicationDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<JobApplicationDto>>(`${this.baseUrl}/job-applications/received`, { params });
  }

  getCheckIns(page: number = 1, pageSize: number = 20): Observable<PagedResult<JobCheckInDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResult<JobCheckInDto>>(`${this.baseUrl}/job-check-ins`, { params });
  }
}
