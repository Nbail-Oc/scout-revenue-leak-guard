import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { FileStore } from '../src/storage/fileStore.js';
import { ClientService } from '../src/services/clientService.js';
import { IngestionService } from '../src/services/ingestionService.js';
import { ContractParserService } from '../src/services/contractParserService.js';
import { ReconciliationService } from '../src/services/reconciliationService.js';

describe('ReconciliationService (Seam: Deterministic Reconciliation Engine)', () => {
  let testStore: FileStore;
  let clientService: ClientService;
  let ingestionService: IngestionService;
  let parserService: ContractParserService;
  let reconService: ReconciliationService;
  const clientId = 'yojit_test';

  beforeEach(async () => {
    const testDir = path.join(os.tmpdir(), `scout-recon-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    testStore = new FileStore(testDir);
    clientService = new ClientService(testStore);
    ingestionService = new IngestionService(testStore);
    parserService = new ContractParserService(testStore);
    reconService = new ReconciliationService(testStore);

    // Setup Client
    await clientService.createClient({
      id: clientId,
      name: 'Yojit FZE',
      industry: 'SaaS',
      contactEmail: 'billing@yojit.com',
      timezone: 'Asia/Dubai',
      currency: 'USD',
    });

    // Upload & Parse Contract
    const contractContent = `# Service Agreement
## Client: Yojit FZE
## Effective Date: 2025-08-01
## Pricing
- Annual Fee: $50,000
- Discount: 20% for first 6 months
- Discount Expiry: 2026-01-15
## Entitlements
- Seats: 100
- Modules: Basic, Analytics ($10,000/year)
## Overages
- Additional Seats: $50/seat/month`;

    const contract = await ingestionService.uploadContract(clientId, 'agreement.md', contractContent);
    await parserService.parseAndSaveContract(clientId, contract.id);

    // Ingest Billing CSV (20% discount active, 100 seats, Basic only)
    await ingestionService.ingestBillingCsv(
      clientId,
      `customer_id,current_price,active_discount_pct,billed_seats,billed_modules,last_synced_at\nyojit,42000,20,100,"Basic",2026-08-28`
    );

    // Ingest Entitlements CSV (Basic, Analytics granted)
    await ingestionService.ingestEntitlementsCsv(
      clientId,
      `customer_id,granted_seats,granted_modules,granted_at\nyojit,100,"Basic,Analytics",2025-10-01`
    );

    // Ingest Usage CSV (150 active seats, Basic + Analytics used)
    await ingestionService.ingestUsageCsv(
      clientId,
      `customer_id,period,active_seats,features_used\nyojit,2026-08,150,"Basic,Analytics"`
    );
  });

  it('detects Rule 1: Stale Discount when discount is active past expiry date', async () => {
    // Reconcile as of 2026-04-15 (3 months past 2026-01-15 expiry)
    const result = await reconService.reconcileClient(clientId, '2026-04-15');
    const discountFlag = result.flags.find((f) => f.type === 'stale_discount');

    assert.ok(discountFlag, 'Should produce a stale discount flag');
    assert.equal(discountFlag.status, 'open');
    assert.equal(Math.round(discountFlag.monthlyImpact), 833); // (20% * $50,000)/12
    assert.equal(discountFlag.monthsCompounding, 3);
    assert.equal(Math.round(discountFlag.cumulativeImpact), 2500); // 3 * 833.33
    assert.ok(discountFlag.evidence.contractClause, 'Should include contract clause');
  });

  it('detects Rule 2: Usage Overage when active seats exceed included quota', async () => {
    const result = await reconService.reconcileClient(clientId, '2026-08-28');
    const overageFlag = result.flags.find((f) => f.type === 'usage_overage');

    assert.ok(overageFlag, 'Should produce usage overage flag');
    assert.equal(overageFlag.monthlyImpact, 2500); // 50 excess seats * $50
    assert.ok(overageFlag.cumulativeImpact >= 2500);
    assert.match(overageFlag.evidence.deltaCalculation, /50 excess seats/);
  });

  it('detects Rule 3: Unbilled Module when contracted/entitled module is not billed', async () => {
    const result = await reconService.reconcileClient(clientId, '2026-08-28');
    const moduleFlag = result.flags.find((f) => f.type === 'unbilled_module');

    assert.ok(moduleFlag, 'Should produce unbilled module flag');
    assert.equal(Math.round(moduleFlag.monthlyImpact), 833); // $10,000 / 12
    assert.match(moduleFlag.title, /Analytics/);
  });

  it('runs full multi-rule reconciliation on Yojit dataset and outputs 3 distinct flags', async () => {
    const result = await reconService.reconcileClient(clientId, '2026-08-28');
    assert.equal(result.flags.length, 3);

    const types = result.flags.map((f) => f.type);
    assert.ok(types.includes('stale_discount'));
    assert.ok(types.includes('usage_overage'));
    assert.ok(types.includes('unbilled_module'));

    assert.ok(result.totalMonthlyAtRisk > 4000);
    assert.ok(result.totalCumulativeAtRisk > 10000);

    const savedFlags = await reconService.getFlags(clientId);
    assert.equal(savedFlags.length, 3);
  });

  it('calculates portfolio risk summary across all clients', async () => {
    await reconService.reconcileClient(clientId, '2026-08-28');
    const summary = await reconService.getPortfolioSummary();

    assert.equal(summary.clientsMonitoredCount, 1);
    assert.equal(summary.openFlagsCount, 3);
    assert.ok(summary.totalRevenueAtRisk > 10000);
    assert.ok(summary.leakageByType.stale_discount > 0);
    assert.ok(summary.leakageByType.usage_overage > 0);
    assert.ok(summary.leakageByType.unbilled_module > 0);
  });
});
