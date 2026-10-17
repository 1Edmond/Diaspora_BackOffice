import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseResponse, PagedList } from '../models/shared/base-response.model';
import { ProcedureProfileType, UserProcedureStatus } from '../models/shared/enums.model';
import {
  CompleteUserProcedureRequest,
  CreateLocationRequest,
  CreateProcedureRequest,
  CreateProcedureResponse,
  LocationDto,
  ProcedureDto,
  ProcedureProgressDto,
  SkipUserProcedureRequest,
  StartUserProcedureRequest,
  StartUserProcedureResponse,
  UpdateLocationRequest,
  UpdateProcedureRequest,
  UserProcedureDto,
} from '../models/procedure/procedure.model';

@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/procedure`;
  private readonly userProcApiUrl = `${environment.apiBaseUrl}/api/user-procedures`;
  private readonly locationApiUrl = `${environment.apiBaseUrl}/api/locations`;
  private readonly legacyLocationApiUrl = `${environment.apiBaseUrl}/api/location`;

  constructor(private http: HttpClient) {}

  getProcedure(id: string): Observable<ProcedureDto> {
    return this.http.get<ProcedureDto>(`${this.apiUrl}/${id}`);
  }

  getProcedures(profileType: ProcedureProfileType, profileTypeId: string, pageNumber = 1, pageSize = 10): Observable<PagedList<ProcedureDto>> {
    return this.http.get<PagedList<ProcedureDto>>(this.apiUrl, {
      params: {
        profileType: profileType.toString(),
        profileTypeId,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }

  createProcedure(data: CreateProcedureRequest): Observable<CreateProcedureResponse> {
    return this.http.post<CreateProcedureResponse>(this.apiUrl, data);
  }

  updateProcedure(id: string, data: UpdateProcedureRequest): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteProcedure(id: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.apiUrl}/${id}`);
  }

  getAllUserProceduresAdmin(status?: UserProcedureStatus, procedureId?: string, pageNumber = 1, pageSize = 20): Observable<PagedList<UserProcedureDto>> {
    const params: any = { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() };
    if (status !== undefined && status !== null) params.status = status.toString();
    if (procedureId) params.procedureId = procedureId;
    return this.http.get<PagedList<UserProcedureDto>>(`${this.userProcApiUrl}/admin/all`, { params });
  }

  getUserProcedures(profileId: string, pageNumber = 1, pageSize = 10): Observable<PagedList<UserProcedureDto>> {
    return this.http.get<PagedList<UserProcedureDto>>(`${this.userProcApiUrl}/profile/${profileId}`, {
      params: { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() },
    });
  }

  getProcedureProgress(profileId: string): Observable<ProcedureProgressDto> {
    return this.http.get<ProcedureProgressDto>(`${this.userProcApiUrl}/profile/${profileId}/progress`);
  }

  startProcedure(data: StartUserProcedureRequest): Observable<StartUserProcedureResponse> {
    return this.http.post<StartUserProcedureResponse>(`${this.userProcApiUrl}/start`, data);
  }

  completeProcedure(userProcedureId: string, data: CompleteUserProcedureRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.userProcApiUrl}/${userProcedureId}/complete`, data);
  }

  skipProcedure(userProcedureId: string, data: SkipUserProcedureRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.userProcApiUrl}/${userProcedureId}/skip`, data);
  }

  getLocations(params?: { countryCode?: string; city?: string; search?: string }): Observable<LocationDto[]> {
    const queryParams: any = {};
    if (params?.countryCode) queryParams.countryCode = params.countryCode;
    if (params?.city) queryParams.city = params.city;
    if (params?.search) queryParams.search = params.search;
    return this.http.get<LocationDto[]>(this.locationApiUrl, { params: queryParams }).pipe(
      catchError(() => this.http.get<LocationDto[]>(this.legacyLocationApiUrl, { params: queryParams }))
    );
  }

  getLocation(id: string): Observable<LocationDto> {
    return this.http.get<LocationDto>(`${this.locationApiUrl}/${id}`).pipe(
      catchError(() => this.http.get<LocationDto>(`${this.legacyLocationApiUrl}/${id}`))
    );
  }

  createLocation(request: CreateLocationRequest): Observable<any> {
    return this.http.post<any>(this.locationApiUrl, request).pipe(
      catchError(() => this.http.post<any>(this.legacyLocationApiUrl, request))
    );
  }

  updateLocation(id: string, request: UpdateLocationRequest): Observable<void> {
    return this.http.put<void>(`${this.locationApiUrl}/${id}`, request).pipe(
      catchError(() => this.http.put<void>(`${this.legacyLocationApiUrl}/${id}`, request))
    );
  }

  deleteLocation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.locationApiUrl}/${id}`).pipe(
      catchError(() => this.http.delete<void>(`${this.legacyLocationApiUrl}/${id}`))
    );
  }

  getProcedureTranslations(id: string): Observable<{ cultureCode: string; fields: { Title?: string; Description?: string }; createdAt?: string }[]> {
    return this.http.get<{ cultureCode: string; fields: { Title?: string; Description?: string }; createdAt?: string }[]>(`${this.apiUrl}/${id}/translations`);
  }

  setProcedureTranslation(id: string, cultureCode: string, fields: { Title: string; Description: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/translations`, {
      entityId: id,
      cultureCode,
      fields
    });
  }

  deleteProcedureTranslation(id: string, cultureCode: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/translations/${cultureCode}`);
  }
}
