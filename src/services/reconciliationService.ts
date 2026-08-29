import crypto from 'node:crypto';
import {
  RevenueLeakFlag,
  ReconciliationResult,
  PortfolioSummary,
  ContractMetadata,
  BillingRecord,
  EntitlementRecord,
  UsageRecord,
  Client,
  FlagType,
} from '../types.js';
import { FileStore, defaultStore } from '../storage/fileStore.js';

export class ReconciliationService {
  private store: FileStore;

  constructor(store: FileStore = defaultStore) {
    this.store = store;
  }

  private calculateMonthsBetween(startDateStr: string, endDateStr: string): number {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff;
    return Math.max(1, totalMonths);
  }

  async reconcileClient(clientId: string, asOfDateStr?: string): Promise<ReconciliationResult> {
    const asOfDate = asOfDateStr || new Date().toISOString().split('T')[0];

    // 1. Fetch all 4 data sources
    const contracts = await this.store.readCollection<ContractMetadata>(`contracts_${clientId}`);
    const contract = contracts.find((c) => c.parsedTerms);
    const parsedTerms = contract?.parsedTerms;

    const billingRecords = await this.store.readCollection<BillingRecord>(`billing_${clientId}`);
    const billing = billingRecords[billingRecords.length - 1];

    const entitlementRecords = await this.store.readCollection<EntitlementRecord>(`entitlements_${clientId}`);
    const entitlements = entitlementRecords[entitlementRecords.length - 1];

    const usageRecords = await this.store.readCollection<UsageRecord>(`usage_${clientId}`);
    const usage = usageRecords[usageRecords.length - 1];

    const flags: RevenueLeakFlag[] = [];
    const now = new Date().toISOString();

    if (parsedTerms && billing) {
      // -------------------------------------------------------------
      // RULE 1: Stale Discount
      // -------------------------------------------------------------
      if (
        parsedTerms.discountExpiry &&
        asOfDate > parsedTerms.discountExpiry &&
        billing.activeDiscountPct > 0
      ) {
        const months = this.calculateMonthsBetween(parsedTerms.discountExpiry, asOfDate);
        const monthlyImpact = (parsedTerms.annualFee * (billing.activeDiscountPct / 100)) / 12;
        const cumulativeImpact = monthlyImpact * months;

        flags.push({
          id: `flag_${crypto.randomBytes(6).toString('hex')}`,
          clientId,
          type: 'stale_discount',
          title: `Stale Discount Applied (${billing.activeDiscountPct}% past expiry)`,
          status: 'open',
          monthlyImpact,
          cumulativeImpact,
          monthsCompounding: months,
          createdAt: now,
          evidence: {
            contractClause:
              parsedTerms.rawClauses.discountClause ||
              `Intro discount of ${parsedTerms.discountPct}% expired on ${parsedTerms.discountExpiry}`,
            billingRecord: {
              activeDiscountPct: billing.activeDiscountPct,
              currentPrice: billing.currentPrice,
              lastSyncedAt: billing.lastSyncedAt,
            },
            deltaCalculation: `${billing.activeDiscountPct}% discount applied for ${months} months past contract expiry (${parsedTerms.discountExpiry}). Monthly loss: $${monthlyImpact.toFixed(2)}, Cumulative: $${cumulativeImpact.toFixed(2)}`,
          },
        });
      }

      // -------------------------------------------------------------
      // RULE 2: Usage Overage
      // -------------------------------------------------------------
      if (usage && usage.activeSeats > parsedTerms.seatsIncluded) {
        const excessSeats = usage.activeSeats - parsedTerms.seatsIncluded;
        const rate = parsedTerms.overageSeatPrice || 50;
        const monthlyImpact = excessSeats * rate;
        const months = 3; // active usage window
        const cumulativeImpact = monthlyImpact * months;

        flags.push({
          id: `flag_${crypto.randomBytes(6).toString('hex')}`,
          clientId,
          type: 'usage_overage',
          title: `Unbilled Usage Overage (${excessSeats} excess seats)`,
          status: 'open',
          monthlyImpact,
          cumulativeImpact,
          monthsCompounding: months,
          createdAt: now,
          evidence: {
            contractClause:
              parsedTerms.rawClauses.overageClause ||
              `Base seats: ${parsedTerms.seatsIncluded}. Overage rate: $${rate}/seat/month`,
            usageRecord: {
              activeSeats: usage.activeSeats,
              period: usage.period,
            },
            deltaCalculation: `${excessSeats} excess seats used (${usage.activeSeats} active vs ${parsedTerms.seatsIncluded} included) at $${rate}/seat/mo. Monthly loss: $${monthlyImpact.toFixed(2)}, Cumulative: $${cumulativeImpact.toFixed(2)}`,
          },
        });
      }

      // -------------------------------------------------------------
      // RULE 3: Unbilled Module
      // -------------------------------------------------------------
      for (const [moduleName, price] of Object.entries(parsedTerms.modulePrices)) {
        if (price > 0) {
          const isBilled = billing.billedModules.some(
            (m) => m.toLowerCase().trim() === moduleName.toLowerCase().trim()
          );

          if (!isBilled) {
            const monthlyImpact = price / 12;
            const months = 10;
            const cumulativeImpact = monthlyImpact * months;

            flags.push({
              id: `flag_${crypto.randomBytes(6).toString('hex')}`,
              clientId,
              type: 'unbilled_module',
              title: `Unbilled Feature/Module (${moduleName} - $${price.toLocaleString()}/yr)`,
              status: 'open',
              monthlyImpact,
              cumulativeImpact,
              monthsCompounding: months,
              createdAt: now,
              evidence: {
                contractClause:
                  parsedTerms.rawClauses.entitlementsClause ||
                  `Contract includes ${moduleName} module priced at $${price.toLocaleString()}/year`,
                billingRecord: {
                  billedModules: billing.billedModules,
                  currentPrice: billing.currentPrice,
                },
                entitlementRecord: entitlements ? { grantedModules: entitlements.grantedModules } : undefined,
                deltaCalculation: `${moduleName} ($${price}/yr) delivered & provisioned but missing from billing configuration. Monthly loss: $${monthlyImpact.toFixed(2)}, Cumulative: $${cumulativeImpact.toFixed(2)}`,
              },
            });
          }
        }
      }
    }

    // Save flags
    await this.store.writeCollection(`flags_${clientId}`, flags);

    // Also update global flags index
    const allFlags = await this.store.readCollection<RevenueLeakFlag>('all_flags');
    const remainingFlags = allFlags.filter((f) => f.clientId !== clientId);
    await this.store.writeCollection('all_flags', [...remainingFlags, ...flags]);

    const totalMonthlyAtRisk = flags.reduce((sum, f) => sum + f.monthlyImpact, 0);
    const totalCumulativeAtRisk = flags.reduce((sum, f) => sum + f.cumulativeImpact, 0);

    return {
      clientId,
      reconciledAt: now,
      flags,
      totalMonthlyAtRisk,
      totalCumulativeAtRisk,
    };
  }

  async getFlags(clientId?: string): Promise<RevenueLeakFlag[]> {
    if (clientId) {
      return await this.store.readCollection<RevenueLeakFlag>(`flags_${clientId}`);
    }
    return await this.store.readCollection<RevenueLeakFlag>('all_flags');
  }

  async getFlagById(flagId: string): Promise<RevenueLeakFlag | null> {
    const flags = await this.getFlags();
    return flags.find((f) => f.id === flagId) || null;
  }

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    const clients = await this.store.readCollection<Client>('clients');
    const allFlags = await this.getFlags();
    const openFlags = allFlags.filter((f) => f.status === 'open');

    const totalRevenueAtRisk = openFlags.reduce((sum, f) => sum + f.cumulativeImpact, 0);
    const totalMonthlyLeak = openFlags.reduce((sum, f) => sum + f.monthlyImpact, 0);

    const leakageByType: Record<FlagType, number> = {
      stale_discount: 0,
      usage_overage: 0,
      unbilled_module: 0,
      stale_contract_version: 0,
    };

    for (const f of openFlags) {
      leakageByType[f.type] = (leakageByType[f.type] || 0) + f.cumulativeImpact;
    }

    return {
      totalRevenueAtRisk,
      totalMonthlyLeak,
      openFlagsCount: openFlags.length,
      clientsMonitoredCount: clients.length,
      leakageByType,
    };
  }
}
