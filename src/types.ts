/**
 * Core Domain Types for Revenue Leakage Guard (Scout)
 */

export interface Client {
  id: string;
  name: string;
  description?: string;
  industry: string;
  contactEmail: string;
  contactName?: string;
  timezone: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export type ClientInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};

export interface BillingRecord {
  customerId: string;
  currentPrice: number;
  activeDiscountPct: number;
  billedSeats: number;
  billedModules: string[];
  lastSyncedAt: string;
}

export interface EntitlementRecord {
  customerId: string;
  grantedSeats: number;
  grantedModules: string[];
  grantedAt: string;
}

export interface UsageRecord {
  customerId: string;
  period: string; // e.g. "2026-08"
  activeSeats: number;
  featuresUsed: string[];
}

export interface ParsedContractTerms {
  clientName: string;
  effectiveDate: string;
  annualFee: number;
  discountPct: number;
  discountExpiry?: string;
  seatsIncluded: number;
  modules: string[];
  modulePrices: Record<string, number>;
  overageSeatPrice: number;
  rawClauses: {
    pricingClause?: string;
    discountClause?: string;
    entitlementsClause?: string;
    overageClause?: string;
  };
}

export interface ContractMetadata {
  id: string;
  clientId: string;
  filename: string;
  fileType: 'markdown' | 'pdf' | 'text';
  uploadedAt: string;
  filePath: string;
  rawContent?: string;
  parsedTerms?: ParsedContractTerms;
  parsedAt?: string;
}

export interface DataSourceStatus {
  hasData: boolean;
  lastUpdated?: string;
  recordCount: number;
  details?: string;
}

export interface ClientDataStatus {
  clientId: string;
  contracts: DataSourceStatus;
  billing: DataSourceStatus;
  entitlements: DataSourceStatus;
  usage: DataSourceStatus;
  isReadyForReconciliation: boolean; // true when all 4 sources have data
}

export interface IngestResult<T> {
  success: boolean;
  records: T[];
  errors: string[];
}

export type FlagType = 'stale_discount' | 'usage_overage' | 'unbilled_module' | 'stale_contract_version';
export type FlagStatus = 'open' | 'approved' | 'rejected' | 'exception';

export interface AgenticReasoning {
  chainOfThought: string[];
  contractAnalysis: string;
  driftDiagnosis: string;
  confidenceScore: number;
  nuanceFlags: string[];
  recommendedAction: string;
}

export interface RevenueLeakFlag {
  id: string;
  clientId: string;
  type: FlagType;
  title: string;
  status: FlagStatus;
  monthlyImpact: number;
  cumulativeImpact: number;
  monthsCompounding: number;
  createdAt: string;
  evidence: {
    contractClause?: string;
    billingRecord?: Partial<BillingRecord>;
    entitlementRecord?: Partial<EntitlementRecord>;
    usageRecord?: Partial<UsageRecord>;
    deltaCalculation: string;
  };
  agenticReasoning?: AgenticReasoning;
}

export interface ReconciliationResult {
  clientId: string;
  reconciledAt: string;
  flags: RevenueLeakFlag[];
  totalMonthlyAtRisk: number;
  totalCumulativeAtRisk: number;
}

export interface AgenticReconciliationResult extends ReconciliationResult {
  agenticSummary: {
    totalEvaluatedSources: number;
    synthesizedClausesCount: number;
    overallRiskAssessment: string;
    averageConfidenceScore: number;
  };
}

export interface PortfolioSummary {
  totalRevenueAtRisk: number;
  totalMonthlyLeak: number;
  openFlagsCount: number;
  clientsMonitoredCount: number;
  leakageByType: Record<FlagType, number>;
}

