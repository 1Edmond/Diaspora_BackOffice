export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  permissionCount: number;
}

export interface RolePermission {
  permissionKey: string;
  grantedAt: string;
}

export interface RoleDetail extends Role {
  permissions: RolePermission[];
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
}

export interface Permission {
  permissionKey: string;
  serviceName: string;
  resourceName: string;
  permission: string;
  description?: string;
}

export interface PermissionsResponse {
  totalCount: number;
  permissions: Permission[];
}

export interface AvailablePermission {
  permissionKey: string;
  permission: string;
  description?: string;
}

export interface AvailableResource {
  resourceName: string;
  resourceKey: string;
  permissions: AvailablePermission[];
}

export interface AvailableService {
  serviceName: string;
  resources: AvailableResource[];
}

export interface RoleCreatedResponse {
  id: string;
  name: string;
}

export interface AssignPermissionsResponse {
  message: string;
  assignedCount: number;
  requestedCount: number;
}

export interface RemovePermissionsResponse {
  message: string;
  removedCount: number;
}
