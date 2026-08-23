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

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/profiles`;
  private readonly typeApiUrl = `${environment.apiBaseUrl}/api/profile-types`;

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
}
