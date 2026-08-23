import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseResponse, PagedList } from '../models/shared/base-response.model';
import {
  DepositRequest,
  DepositResponse,
  MarketplacePaymentRequest,
  ProcedurePaymentRequest,
  TransactionDto,
  TransactionListQuery,
  TransferRequest,
  TransferResponse,
  UpdateWalletParameterRequest,
  WalletDto,
  WalletParameterDto,
} from '../models/wallet/wallet.model';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/wallet`;

  constructor(private http: HttpClient) {}

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
    return this.http.get<PagedList<TransactionDto>>(`${this.apiUrl}/transactions/profile/${profileId}`, { params });
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
}
