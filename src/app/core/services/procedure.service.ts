import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseResponse, PagedList } from '../models/shared/base-response.model';
import { ProcedureProfileType } from '../models/shared/enums.model';
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
  UpdateProcedureRequest,
  UserProcedureDto,
} from '../models/procedure/procedure.model';

@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/procedure`;
  private readonly userProcApiUrl = `${environment.apiBaseUrl}/api/user-procedures`;
  private readonly locationApiUrl = `${environment.apiBaseUrl}/api/location`;

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

  getLocations(): Observable<LocationDto[]> {
    return this.http.get<LocationDto[]>(this.locationApiUrl);
  }

  createLocation(data: CreateLocationRequest): Observable<LocationDto> {
    return this.http.post<LocationDto>(this.locationApiUrl, data);
  }
}
