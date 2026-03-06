import type { AuthUser, MerchantUser } from '@stablebridge/types';

export const mockAdminUser: AuthUser = {
  id: 'usr_admin_001',
  email: 'admin@acme-corp.com',
  merchantId: 'mrc_001',
  role: 'ADMIN',
  permissions: [
    'payments:read',
    'payments:write',
    'merchants:read',
    'merchants:write',
    'users:read',
    'users:write',
    'settings:read',
    'settings:write',
  ],
};

export const mockViewerUser: AuthUser = {
  id: 'usr_viewer_001',
  email: 'viewer@acme-corp.com',
  merchantId: 'mrc_001',
  role: 'VIEWER',
  permissions: ['payments:read', 'merchants:read'],
};

export const mockMerchantUser: MerchantUser = {
  id: 'usr_admin_001',
  merchantId: 'mrc_001',
  email: 'admin@acme-corp.com',
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'ADMIN',
  status: 'ACTIVE',
  permissions: [
    'payments:read',
    'payments:write',
    'merchants:read',
    'merchants:write',
    'users:read',
    'users:write',
    'settings:read',
    'settings:write',
  ],
  active: true,
  lastLoginAt: '2025-06-01T09:30:00Z',
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
};
