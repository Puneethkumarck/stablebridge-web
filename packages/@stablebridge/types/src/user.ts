export type Role = 'ADMIN' | 'PAYMENTS_OPERATOR' | 'VIEWER' | 'DEVELOPER';

export type Permission =
  | 'payments:read'
  | 'payments:write'
  | 'payments:cancel'
  | 'merchants:read'
  | 'merchants:write'
  | 'users:read'
  | 'users:write'
  | 'settings:read'
  | 'settings:write'
  | 'roles:read'
  | 'roles:manage'
  | 'team:read'
  | 'team:manage';

export type UserStatus = 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export interface RoleSummary {
  readonly roleId: string;
  readonly roleName: string;
}

export interface MerchantUser {
  readonly userId: string;
  readonly merchantId: string;
  readonly email: string;
  readonly fullName: string;
  readonly role: RoleSummary;
  readonly status: string;
  readonly mfaEnabled: boolean;
  readonly lastLoginAt: string | undefined;
  readonly activatedAt: string | undefined;
  readonly suspendedAt: string | undefined;
  readonly createdAt: string;
}

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly merchantId: string;
  readonly role: Role;
  readonly permissions: readonly Permission[];
}
