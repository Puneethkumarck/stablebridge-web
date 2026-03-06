export type MerchantStatus =
  | 'APPLIED'
  | 'KYB_IN_PROGRESS'
  | 'KYB_MANUAL_REVIEW'
  | 'KYB_REJECTED'
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'CLOSED';

export type KybStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'PASSED'
  | 'FAILED'
  | 'MANUAL_REVIEW';

export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH';

export type RateLimitTier = 'STARTER' | 'GROWTH' | 'ENTERPRISE' | 'UNLIMITED';

export interface Merchant {
  readonly merchantId: string;
  readonly legalName: string;
  readonly tradingName: string;
  readonly registrationNumber: string;
  readonly registrationCountry: string;
  readonly entityType: string;
  readonly websiteUrl: string | undefined;
  readonly primaryCurrency: string;
  readonly primaryContactEmail: string;
  readonly primaryContactName: string;
  readonly status: MerchantStatus;
  readonly kybStatus: KybStatus | undefined;
  readonly riskTier: RiskTier | undefined;
  readonly rateLimitTier: RateLimitTier | undefined;
  readonly allowedScopes: readonly string[] | undefined;
  readonly requestedCorridors: readonly string[] | undefined;
  readonly createdAt: string;
  readonly updatedAt: string | undefined;
  readonly activatedAt: string | undefined;
}

export interface MerchantSummary {
  readonly merchantId: string;
  readonly legalName: string;
  readonly tradingName: string;
  readonly registrationCountry: string;
  readonly entityType: string;
  readonly status: MerchantStatus;
  readonly kybStatus: KybStatus | undefined;
  readonly createdAt: string;
}

export interface KybVerification {
  readonly kybId: string;
  readonly status: string;
  readonly provider: string | undefined;
  readonly providerRef: string | undefined;
  readonly initiatedAt: string | undefined;
  readonly completedAt: string | undefined;
  readonly riskSignals: Record<string, unknown> | undefined;
}

export interface ApprovedCorridor {
  readonly corridorId: string;
  readonly merchantId: string;
  readonly sourceCountry: string;
  readonly targetCountry: string;
  readonly currencies: readonly string[];
  readonly maxAmountUsd: number;
  readonly approvedBy: string;
  readonly approvedAt: string;
  readonly expiresAt: string;
  readonly active: boolean;
}
