import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseResponse, PagedList } from '../models/shared/base-response.model';
import {
  CategoryDto,
  CreateCategoryRequest,
  CreateListingRequest,
  CreateListingResponse,
  CreateReviewRequest,
  CreateServiceRequest,
  CreateServiceRequestResponse,
  ListingListQuery,
  ReviewDto,
  ServiceListingDto,
  ServiceListingSummaryDto,
  ServiceRequestDto,
  UpdateCategoryRequest,
  UpdateListingRequest,
} from '../models/marketplace/marketplace.model';

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
}
