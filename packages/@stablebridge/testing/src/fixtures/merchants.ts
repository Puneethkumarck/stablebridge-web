import type { Merchant } from '@stablebridge/types';

export const mockMerchant: Merchant = {
  id: 'mrc_001',
  legalName: 'ACME Corporation Ltd',
  tradingName: 'ACME Corp',
  registrationNumber: 'DE123456789',
  countryCode: 'DE',
  status: 'ACTIVATED',
  primaryContactEmail: 'admin@acme-corp.com',
  primaryContactName: 'Jane Doe',
  createdAt: '2025-01-10T08:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
};

export const mockPendingMerchant: Merchant = {
  id: 'mrc_002',
  legalName: 'Beta Trading GmbH',
  tradingName: 'Beta Trading',
  registrationNumber: 'DE987654321',
  countryCode: 'DE',
  status: 'PENDING_REVIEW',
  primaryContactEmail: 'info@beta-trading.de',
  primaryContactName: 'Max Mueller',
  createdAt: '2025-02-01T09:00:00Z',
  updatedAt: '2025-02-01T09:00:00Z',
};
