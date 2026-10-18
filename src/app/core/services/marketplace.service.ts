import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseResponse, PagedList } from '../models/shared/base-response.model';
import {
  AdminListingListQuery,
  AdminServiceRequestQuery,
  CategoryDto,
  CreateCategoryRequest,
  CreateListingRequest,
  CreateListingResponse,
  CreateReviewRequest,
  CreateServiceRequest,
  CreateServiceRequestResponse,
  ListingListQuery,
  ProviderStatsDto,
  ReportDto,
  ReviewDto,
  ServiceListingDto,
  ServiceListingSummaryDto,
  ServiceRequestDto,
  UpdateCategoryRequest,
  UpdateCategoryPolicyRequest,
  UpdateListingRequest,
} from '../models/marketplace/marketplace.model';
import {
  DisputeDto,
  DisputeStatus,
  ResolveDisputeRequest,
} from '../models/marketplace/dispute.model';
import { MarketplaceParameter } from '../models/marketplace/parameter.model';
import {
  ProfileTypePaymentPolicy,
  UpdatePaymentPolicyRequest,
} from '../models/marketplace/payment-policy.model';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceService {
  private readonly listingApiUrl = `${environment.apiBaseUrl}/api/servicelisting`;
  private readonly categoryApiUrl = `${environment.apiBaseUrl}/api/category`;
  private readonly requestsApiUrl = `${environment.apiBaseUrl}/api/service-requests`;

  constructor(private http: HttpClient) {}

  getListings(query: ListingListQuery = {}): Observable<PagedList<ServiceListingSummaryDto>> {
    const params: any = {};
    if (query.page != null) params.page = query.page;
    if (query.pageSize != null) params.pageSize = query.pageSize;
    if (query.categoryId) params.categoryId = query.categoryId;
    if (query.search) params.search = query.search;
    if (query.paymentMode != null) params.paymentMode = query.paymentMode;
    if (query.minPrice != null) params.minPrice = query.minPrice;
    if (query.maxPrice != null) params.maxPrice = query.maxPrice;
    return this.http.get<PagedList<ServiceListingSummaryDto>>(this.listingApiUrl, { params });
  }

  getListing(id: string): Observable<ServiceListingDto> {
    return this.http.get<ServiceListingDto>(`${this.listingApiUrl}/${id}`);
  }

  getMyListings(page = 1, pageSize = 10): Observable<PagedList<ServiceListingSummaryDto>> {
    return this.http.get<PagedList<ServiceListingSummaryDto>>(`${this.listingApiUrl}/my`, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    });
  }

  getPendingListings(page = 1, pageSize = 10): Observable<PagedList<ServiceListingSummaryDto>> {
    return this.http.get<PagedList<ServiceListingSummaryDto>>(`${this.listingApiUrl}/pending`, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    });
  }

  createListing(data: CreateListingRequest): Observable<CreateListingResponse> {
    return this.http.post<CreateListingResponse>(this.listingApiUrl, data);
  }

  updateListing(id: string, data: UpdateListingRequest): Observable<void> {
    return this.http.put<void>(`${this.listingApiUrl}/${id}`, data);
  }

  deleteListing(id: string): Observable<void> {
    return this.http.delete<void>(`${this.listingApiUrl}/${id}`);
  }

  approveListing(id: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.listingApiUrl}/${id}/approve`, {});
  }

  rejectListing(id: string, reason: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.listingApiUrl}/${id}/reject`, JSON.stringify(reason), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  suspendListing(id: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.listingApiUrl}/${id}/suspend`, {});
  }

  getCategories(activeOnly = true): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(this.categoryApiUrl, {
      params: { activeOnly: activeOnly.toString() },
    });
  }

  getCategory(id: string): Observable<CategoryDto> {
    return this.http.get<CategoryDto>(`${this.categoryApiUrl}/${id}`);
  }

  createCategory(data: CreateCategoryRequest): Observable<CreateListingResponse> {
    return this.http.post<CreateListingResponse>(this.categoryApiUrl, data);
  }

  updateCategory(id: string, data: UpdateCategoryRequest): Observable<void> {
    return this.http.put<void>(`${this.categoryApiUrl}/${id}`, data);
  }

  toggleCategoryStatus(id: string, isActive: boolean): Observable<void> {
    return this.http.patch<void>(`${this.categoryApiUrl}/${id}/status`, isActive);
  }

  updateCategoryPolicy(id: string, data: UpdateCategoryPolicyRequest): Observable<void> {
    return this.http.put<void>(`${this.categoryApiUrl}/${id}/policy`, data);
  }

  getCategoryTranslations(id: string): Observable<{ [culture: string]: { [field: string]: string } }> {
    return this.http.get<{ [culture: string]: { [field: string]: string } }>(`${this.categoryApiUrl}/${id}/translations`);
  }

  updateCategoryTranslation(id: string, culture: string, fields: { [field: string]: string }): Observable<void> {
    return this.http.put<void>(`${this.categoryApiUrl}/${id}/translations/${culture}`, fields);
  }

  getReviews(listingId: string, page = 1, pageSize = 10): Observable<PagedList<ReviewDto>> {
    return this.http.get<PagedList<ReviewDto>>(`${environment.apiBaseUrl}/api/listings/${listingId}/reviews`, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    });
  }

  createReview(listingId: string, data: CreateReviewRequest): Observable<CreateListingResponse> {
    return this.http.post<CreateListingResponse>(`${environment.apiBaseUrl}/api/listings/${listingId}/reviews`, data);
  }

  deleteReview(listingId: string, reviewId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/listings/${listingId}/reviews/${reviewId}`);
  }

  getSentRequests(page = 1, pageSize = 10): Observable<PagedList<ServiceRequestDto>> {
    return this.http.get<PagedList<ServiceRequestDto>>(`${this.requestsApiUrl}/sent`, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    });
  }

  getReceivedRequests(page = 1, pageSize = 10): Observable<PagedList<ServiceRequestDto>> {
    return this.http.get<PagedList<ServiceRequestDto>>(`${this.requestsApiUrl}/received`, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    });
  }

  getServiceRequest(id: string): Observable<ServiceRequestDto> {
    return this.http.get<ServiceRequestDto>(`${this.requestsApiUrl}/${id}`);
  }

  createServiceRequest(data: CreateServiceRequest): Observable<CreateServiceRequestResponse> {
    return this.http.post<CreateServiceRequestResponse>(this.requestsApiUrl, data);
  }

  acceptServiceRequest(id: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.requestsApiUrl}/${id}/accept`, {});
  }

  declineServiceRequest(id: string, reason: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.requestsApiUrl}/${id}/decline`, JSON.stringify(reason), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  completeServiceRequest(id: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.requestsApiUrl}/${id}/complete`, {});
  }

  cancelServiceRequest(id: string, reason: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.requestsApiUrl}/${id}/cancel`, JSON.stringify(reason), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Admin methods
  getAllListingsAdmin(query: AdminListingListQuery = {}): Observable<PagedList<ServiceListingSummaryDto>> {
    const params: any = {};
    if (query.page != null) params.page = query.page;
    if (query.pageSize != null) params.pageSize = query.pageSize;
    if (query.categoryId) params.categoryId = query.categoryId;
    if (query.search) params.search = query.search;
    if (query.paymentMode != null) params.paymentMode = query.paymentMode;
    if (query.minPrice != null) params.minPrice = query.minPrice;
    if (query.maxPrice != null) params.maxPrice = query.maxPrice;
    if (query.city) params.city = query.city;
    if (query.country) params.country = query.country;
    if (query.sortBy != null) params.sortBy = query.sortBy;
    if (query.status != null) params.status = query.status;
    if (query.providerId) params.providerId = query.providerId;
    return this.http.get<PagedList<ServiceListingSummaryDto>>(`${this.listingApiUrl}/admin`, { params });
  }

  getAllServiceRequestsAdmin(query: AdminServiceRequestQuery = {}): Observable<PagedList<ServiceRequestDto>> {
    const params: any = {};
    if (query.page != null) params.page = query.page;
    if (query.pageSize != null) params.pageSize = query.pageSize;
    if (query.status != null) params.status = query.status;
    if (query.paymentStatus != null) params.paymentStatus = query.paymentStatus;
    if (query.providerId) params.providerId = query.providerId;
    if (query.requesterId) params.requesterId = query.requesterId;
    if (query.dateFrom) params.dateFrom = query.dateFrom;
    if (query.dateTo) params.dateTo = query.dateTo;
    if (query.search) params.search = query.search;
    return this.http.get<PagedList<ServiceRequestDto>>(`${this.requestsApiUrl}/admin`, { params });
  }

  getProviderStats(providerId: string): Observable<ProviderStatsDto> {
    return this.http.get<ProviderStatsDto>(`${this.listingApiUrl}/stats/provider/${providerId}`);
  }

  getPendingReports(page = 1, pageSize = 10): Observable<PagedList<ReportDto>> {
    return this.http.get<PagedList<ReportDto>>(`${environment.apiBaseUrl}/api/reports/pending`, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    });
  }

  resolveReport(id: string, newStatus: number, resolutionNotes: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${environment.apiBaseUrl}/api/reports/${id}/resolve`, { newStatus, resolutionNotes });
  }

  getDisputes(status?: DisputeStatus, pageNumber = 1, pageSize = 20): Observable<PagedList<DisputeDto>> {
    const params: any = { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() };
    if (status != null) params.status = status.toString();
    return this.http.get<PagedList<DisputeDto>>(`${environment.apiBaseUrl}/api/disputes`, { params });
  }

  getDispute(id: string): Observable<DisputeDto> {
    return this.http.get<DisputeDto>(`${environment.apiBaseUrl}/api/disputes/${id}`);
  }

  private readonly paymentPoliciesApiUrl = `${environment.apiBaseUrl}/api/marketplace/payment-policies`;

  getPaymentPolicies(): Observable<ProfileTypePaymentPolicy[]> {
    return this.http.get<ProfileTypePaymentPolicy[]>(this.paymentPoliciesApiUrl);
  }

  getPaymentPolicyByProfileType(profileTypeId: string): Observable<ProfileTypePaymentPolicy> {
    return this.http.get<ProfileTypePaymentPolicy>(`${this.paymentPoliciesApiUrl}/by-profile-type/${profileTypeId}`);
  }

  updatePaymentPolicy(profileTypeId: string, data: UpdatePaymentPolicyRequest): Observable<void> {
    return this.http.put<void>(`${this.paymentPoliciesApiUrl}/${profileTypeId}`, data);
  }

  resolveDispute(id: string, request: ResolveDisputeRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/api/disputes/${id}/resolve`, request);
  }

  // Reviews Moderation (Global Admin)
  getReviewsAdmin(query: { page?: number; pageSize?: number; rating?: number; search?: string } = {}): Observable<PagedList<ReviewDto>> {
    const params: any = {};
    if (query.page != null) params.page = query.page.toString();
    if (query.pageSize != null) params.pageSize = query.pageSize.toString();
    if (query.rating != null) params.rating = query.rating.toString();
    if (query.search) params.search = query.search;
    return this.http.get<PagedList<ReviewDto>>(`${environment.apiBaseUrl}/api/marketplace/reviews/admin`, { params });
  }

  deleteReviewAdmin(reviewId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/marketplace/reviews/${reviewId}`);
  }

  // Marketplace Parameters
  getParameters(): Observable<MarketplaceParameter[]> {
    return this.http.get<MarketplaceParameter[]>(`${environment.apiBaseUrl}/api/marketplace/parameters`);
  }

  updateParameter(key: string, value: string): Observable<void> {
    return this.http.put<void>(`${environment.apiBaseUrl}/api/marketplace/parameters/${key}`, { value });
  }
}
