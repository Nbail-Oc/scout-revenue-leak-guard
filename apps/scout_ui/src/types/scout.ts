// =============================================================================
// Scout Revenue Leak Guard — Core Domain Types
// =============================================================================

import type { ParsedContractTerms } from '../components/ContractParserView';

export type NavigationTab =
  | 'portfolio'
  | 'client_dashboard'
  | 'contracts'
  | 'approval_queue'
  | 'rules_studio'
  | 'audit_log'
  | 'settings';

export interface AgenticReasoning {
  stage1RuleInput: {
    ruleId: string;
    detectedDelta: string;
    rawAmount: number;
  };
  chainOfThought: string[];
  contractAnalysis: string;
  driftDiagnosis: string;
  confidenceScore: number;
  nuanceFlags: string[];
  recommendedAction: string;
}

export interface RevenueLeakFlag {
  id: string;
  type: 'stale_discount' | 'usage_overage' | 'unbilled_module';
  title: string;
  status: 'open' | 'approved' | 'rejected' | 'exception';
  monthlyImpact: number;
  cumulativeImpact: number;
  monthsCompounding: number;
  evidence: {
    clause: string;
    source: string;
    delta: string;
  };
  agenticReasoning?: AgenticReasoning;
}

export interface ClientItem {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  billingSystem: string;
  currency: string;
  annualContractValue: number;
  contractRaw?: string;
  parsedTerms?: ParsedContractTerms;
  billingData?: {
    chargedAnnual: number;
    activeDiscountPct: number;
    billedSeats: number;
    billedModules: string[];
    lastSynced: string;
  };
  entitlementsData?: {
    grantedSeats: number;
    grantedModules: string[];
    grantedAt: string;
  };
  usageData?: {
    activeDailySeats: number;
    featuresUsed: string[];
    period: string;
  };
  flags: RevenueLeakFlag[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  clientName: string;
  amount: number;
  status: 'verified' | 'approved' | 'override' | 'synced';
  hash: string;
}
