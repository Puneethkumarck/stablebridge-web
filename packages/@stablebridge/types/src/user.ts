export type Role = 'OWNER' | 'ADMIN' | 'OPERATOR' | 'VIEWER';

export type Permission =
  | 'payments:read'
  | 'payments:write'
  | 'merchants:read'
  | 'merchants:write'
  | 'users:read'
  | 'users:write'
  | 'settings:read'
  | 'settings:write';

export interface MerchantUser {
  readonly id: string;
  readonly merchantId: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: Role;
  readonly permissions: readonly Permission[];
  readonly active: boolean;
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
