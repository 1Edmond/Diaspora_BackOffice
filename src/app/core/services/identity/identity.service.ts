import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseResponse, DataResponse } from '../../models/shared/base-response.model';
import {
  ChangePasswordRequest,
  CreateUserRequest,
  KYCStatistics,
  RefreshToken,
  SuspendUserRequest,
  UpdateUserRequest,
  User,
  UserListQuery,
  UserListResponse,
} from '../../models/identity/user.model';
import {
  AssignPermissionsResponse,
  AvailableService,
  Permission,
  PermissionsResponse,
  RemovePermissionsResponse,
  Role,
  RoleCreatedResponse,
  RoleDetail,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '../../models/identity/role.model';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api`;

  constructor(private http: HttpClient) {}

  getUsers(query: UserListQuery = {}): Observable<UserListResponse> {
    const params: any = {};
    if (query.pageNumber != null) params.pageNumber = query.pageNumber;
    if (query.pageSize != null) params.pageSize = query.pageSize;
    if (query.searchTerm) params.searchTerm = query.searchTerm;
    if (query.status) params.status = query.status;
    if (query.emailVerified != null) params.emailVerified = query.emailVerified;
    if (query.includeDeleted) params.includeDeleted = query.includeDeleted;
    return this.http.get<UserListResponse>(`${this.apiUrl}/user`, { params });
  }

  getUser(id: string): Observable<User> {
    return this.http
      .get<DataResponse<User>>(`${this.apiUrl}/user/${id}`)
      .pipe(map((res) => res.data!));
  }

  getCurrentUser(): Observable<User> {
    return this.http
      .get<DataResponse<User>>(`${this.apiUrl}/user/me`)
      .pipe(map((res) => res.data!));
  }

  createUser(data: CreateUserRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/auth/register`, data);
  }

  updateUser(id: string, data: UpdateUserRequest): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(`${this.apiUrl}/user/${id}`, data);
  }

  suspendUser(id: string, data: SuspendUserRequest): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(`${this.apiUrl}/user/${id}/suspend`, data);
  }

  activateUser(id: string): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(`${this.apiUrl}/user/${id}/activate`, {});
  }

  deleteUser(id: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.apiUrl}/user/${id}`);
  }

  restoreUser(id: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/user/${id}/restore`, {});
  }

  getUsersByKYCLevel(level: string, pageNumber = 1, pageSize = 10): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiUrl}/user/kyc-level/${level}`, {
      params: { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() },
    });
  }

  getKYCStatistics(): Observable<KYCStatistics> {
    return this.http
      .get<DataResponse<KYCStatistics>>(`${this.apiUrl}/user/kyc-statistics`)
      .pipe(map((res) => res.data!));
  }

  getRefreshTokens(userId: string): Observable<RefreshToken[]> {
    return this.http
      .get<DataResponse<RefreshToken[]>>(`${this.apiUrl}/user/${userId}/refresh-tokens`)
      .pipe(map((res) => res.data!));
  }

  revokeAllTokens(userId: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/user/${userId}/revoke-all-tokens`, {});
  }

  changePassword(data: ChangePasswordRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/auth/change-password`, data);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  getRole(id: string): Observable<RoleDetail> {
    return this.http.get<RoleDetail>(`${this.apiUrl}/roles/${id}`);
  }

  createRole(data: CreateRoleRequest): Observable<RoleCreatedResponse> {
    return this.http.post<RoleCreatedResponse>(`${this.apiUrl}/roles`, data);
  }

  updateRole(id: string, data: UpdateRoleRequest): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(`${this.apiUrl}/roles/${id}`, data);
  }

  deleteRole(id: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.apiUrl}/roles/${id}`);
  }

  assignPermissionsToRole(roleId: string, permissionKeys: string[]): Observable<AssignPermissionsResponse> {
    return this.http.post<AssignPermissionsResponse>(`${this.apiUrl}/roles/${roleId}/permissions`, {
      permissionKeys,
    });
  }

  removePermissionsFromRole(roleId: string, permissionKeys: string[]): Observable<RemovePermissionsResponse> {
    return this.http.delete<RemovePermissionsResponse>(`${this.apiUrl}/roles/${roleId}/permissions`, {
      body: { permissionKeys },
    });
  }

  getAvailablePermissions(): Observable<AvailableService[]> {
    return this.http.get<AvailableService[]>(`${this.apiUrl}/roles/available-permissions`);
  }

  checkPermission(userId: string, path: string, method: string): Observable<{ hasPermission: boolean }> {
    return this.http.get<{ hasPermission: boolean }>(`${this.apiUrl}/authorization/check`, {
      params: { userId, path, method },
    });
  }

  getUserPermissions(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/authorization/user-permissions`, {
      params: { userId },
    });
  }

  getAllPermissions(): Observable<PermissionsResponse> {
    return this.http.get<PermissionsResponse>(`${this.apiUrl}/authorization/permissions`);
  }

  assignPermissionToRole(roleId: string, permissionKeys: string[]): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.apiUrl}/authorization/roles/${roleId}/permissions`, {
      permissionKeys,
    });
  }

  removePermissionFromRole(roleId: string, permissionKey: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.apiUrl}/authorization/roles/${roleId}/permissions/${permissionKey}`);
  }
}
