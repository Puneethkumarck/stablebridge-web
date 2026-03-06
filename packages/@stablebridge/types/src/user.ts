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

export interface MerchantUser {
  readonly id: string;
  readonly merchantId: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: Role;
  readonly status: UserStatus;
  readonly permissions: readonly Permission[];
  readonly active: boolean;
  readonly lastLoginAt: string | undefined;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly merchantId: string;
  readonly role: Role;
  readonly permissions: readonly Permission[];
}
