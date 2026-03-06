export type PaymentStatus =
  | 'INITIATED'
  | 'COMPLIANCE_CHECK'
  | 'ON_RAMP_PENDING'
  | 'ON_RAMP_COMPLETE'
  | 'BLOCKCHAIN_PENDING'
  | 'BLOCKCHAIN_CONFIRMED'
  | 'OFF_RAMP_PENDING'
  | 'OFF_RAMP_COMPLETE'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface Payment {
  readonly id: string;
  readonly merchantId: string;
  readonly idempotencyKey: string;
  readonly sourceCurrency: string;
  readonly targetCurrency: string;
  readonly sourceAmount: string;
  readonly targetAmount: string;
  readonly fxRate: string;
  readonly status: PaymentStatus;
  readonly beneficiaryName: string;
  readonly beneficiaryAccount: string;
  readonly beneficiaryCountry: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PaymentSummary {
  readonly id: string;
  readonly sourceCurrency: string;
  readonly targetCurrency: string;
  readonly sourceAmount: string;
  readonly status: PaymentStatus;
  readonly beneficiaryName: string;
  readonly createdAt: string;
}
