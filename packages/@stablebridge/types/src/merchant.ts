export type MerchantStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'KYB_IN_PROGRESS'
  | 'KYB_APPROVED'
  | 'KYB_REJECTED'
  | 'ACTIVATED'
  | 'SUSPENDED'
  | 'DEACTIVATED';

export interface Merchant {
  readonly id: string;
  readonly legalName: string;
  readonly tradingName: string;
  readonly registrationNumber: string;
  readonly countryCode: string;
  readonly status: MerchantStatus;
  readonly primaryContactEmail: string;
  readonly primaryContactName: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MerchantSummary {
  readonly id: string;
  readonly legalName: string;
  readonly tradingName: string;
  readonly countryCode: string;
  readonly status: MerchantStatus;
}
