import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseResponse, PagedList } from '../models/shared/base-response.model';
import {
  CreatePaymentPolicyRequest,
  DepositRequest,
  DepositResponse,
  MarketplacePaymentRequest,
  PaymentPolicyDto,
  PlatformRevenueDto,
  ProcedurePaymentRequest,
  TransactionDto,
  TransactionListQuery,
  TransferRequest,
  TransferResponse,
  UpdateWalletParameterRequest,
  UpdateWalletPaymentPolicyRequest,
  WalletDto,
  WalletParameterDto,
} from '../models/wallet/wallet.model';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/wallet`;

  constructor(private http: HttpClient) {}

  getWalletsAdmin(
    currency?: string,
    isActive?: boolean,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<PagedList<WalletDto>> {
    const params: any = { pageNumber, pageSize };
    if (currency) params.currency = currency;
    if (isActive !== undefined && isActive !== null) params.isActive = isActive;
    return this.http.get<PagedList<WalletDto>>(`${this.apiUrl}/admin`, { params });
  }

  getPlatformRevenue(): Observable<PlatformRevenueDto> {
    return this.http.get<PlatformRevenueDto>(`${this.apiUrl}/platform-revenue`);
  }

  getWallet(profileId: string): Observable<WalletDto> {
    return this.http.get<WalletDto>(`${this.apiUrl}/profile/${profileId}`);
  }

  deposit(profileId: string, data: DepositRequest): Observable<DepositResponse> {
    return this.http.post<DepositResponse>(`${this.apiUrl}/profile/${profileId}/deposit`, data);
  }

  getTransactions(profileId: string, query: TransactionListQuery = {}): Observable<PagedList<TransactionDto>> {
    const params: any = {};
    if (query.pageNumber != null) params.pageNumber = query.pageNumber;
    if (query.pageSize != null) params.pageSize = query.pageSize;
    if (query.type != null) params.type = query.type;
    if (query.status != null) params.status = query.status;
    if (query.search) params.search = query.search;
    return this.http.get<PagedList<TransactionDto>>(`${this.apiUrl}/transactions/profile/${profileId}`, { params });
  }

  getAllTransactions(query: TransactionListQuery = {}): Observable<PagedList<TransactionDto>> {
    const params: any = {};
    if (query.pageNumber != null) params.pageNumber = query.pageNumber;
    if (query.pageSize != null) params.pageSize = query.pageSize;
    if (query.type != null) params.type = query.type;
    if (query.status != null) params.status = query.status;
    if (query.currency) params.currency = query.currency;
    if (query.walletId) params.walletId = query.walletId;
    if (query.fromDate) params.fromDate = query.fromDate;
    if (query.toDate) params.toDate = query.toDate;
    if (query.search) params.search = query.search;
    return this.http.get<PagedList<TransactionDto>>(`${this.apiUrl}/transactions`, { params });
  }

  transfer(data: TransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.apiUrl}/transactions/transfer`, data);
  }

  procedurePayment(data: ProcedurePaymentRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/transactions/procedure-payment`, data);
  }

  marketplacePayment(data: MarketplacePaymentRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/transactions/marketplace-payment`, data);
  }

  getParameters(): Observable<WalletParameterDto[]> {
    return this.http.get<WalletParameterDto[]>(`${this.apiUrl}/parameters`);
  }

  updateParameter(key: string, data: UpdateWalletParameterRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/parameters/${key}`, data);
  }

  // Payment Policies (CRUD)
  getPaymentPolicies(): Observable<PaymentPolicyDto[]> {
    return this.http.get<PaymentPolicyDto[]>(`${this.apiUrl}/payment-policies`);
  }

  getPaymentPolicyByProfileType(profileTypeId: string): Observable<PaymentPolicyDto> {
    return this.http.get<PaymentPolicyDto>(`${this.apiUrl}/payment-policies/by-profile-type/${profileTypeId}`);
  }

  createPaymentPolicy(request: CreatePaymentPolicyRequest): Observable<PaymentPolicyDto> {
    return this.http.post<PaymentPolicyDto>(`${this.apiUrl}/payment-policies`, request);
  }

  updatePaymentPolicy(id: string, request: UpdateWalletPaymentPolicyRequest): Observable<PaymentPolicyDto> {
    return this.http.put<PaymentPolicyDto>(`${this.apiUrl}/payment-policies/${id}`, request);
  }

  deletePaymentPolicy(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/payment-policies/${id}`);
  }
}
