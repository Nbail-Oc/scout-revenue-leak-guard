import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { FileStore } from '../src/storage/fileStore.js';
import { ClientService } from '../src/services/clientService.js';
import { IngestionService } from '../src/services/ingestionService.js';
import { ContractParserService } from '../src/services/contractParserService.js';
import { AgenticReconciliationService } from '../src/services/agenticReconciliationService.js';

describe('AgenticReconciliationService (Seam: Agentic Reasoning & CoT Engine)', () => {
  let testStore: FileStore;
  let clientService: ClientService;
  let ingestionService: IngestionService;
  let parserService: ContractParserService;
  let agenticService: AgenticReconciliationService;
  const clientId = 'yojit_agentic_test';

  beforeEach(async () => {
    const testDir = path.join(os.tmpdir(), `scout-agentic-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    testStore = new FileStore(testDir);
    clientService = new ClientService(testStore);
    ingestionService = new IngestionService(testStore);
    parserService = new ContractParserService(testStore);
    agenticService = new AgenticReconciliationService(testStore);

    // Setup Client
    await clientService.createClient({
      id: clientId,
      name: 'Yojit FZE',
      industry: 'Logistics SaaS',
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

    // Ingest Billing CSV
    await ingestionService.ingestBillingCsv(
      clientId,
      `customer_id,current_price,active_discount_pct,billed_seats,billed_modules,last_synced_at\nyojit,42000,20,100,"Basic",2026-08-28`
    );

    // Ingest Entitlements CSV
    await ingestionService.ingestEntitlementsCsv(
      clientId,
      `customer_id,granted_seats,granted_modules,granted_at\nyojit,100,"Basic,Analytics",2025-10-01`
    );

    // Ingest Usage CSV
    await ingestionService.ingestUsageCsv(
      clientId,
      `customer_id,period,active_seats,features_used\nyojit,2026-08,150,"Basic,Analytics"`
    );
  });

  it('generates multi-step Chain-of-Thought for each detected revenue leak', async () => {
    const result = await agenticService.reconcileWithAgent(clientId, '2026-08-28');

    assert.equal(result.flags.length, 3);
    for (const flag of result.flags) {
      assert.ok(flag.agenticReasoning, `Flag ${flag.id} should have agentic reasoning`);
      assert.ok(flag.agenticReasoning.chainOfThought.length >= 3, 'CoT must have at least 3 logical steps');
      assert.ok(flag.agenticReasoning.confidenceScore >= 90, 'Confidence score should be high for clear proof');
      assert.ok(flag.agenticReasoning.driftDiagnosis.length > 20, 'Should have detailed drift diagnosis');
      assert.ok(flag.agenticReasoning.recommendedAction.length > 10, 'Should suggest actionable resolution');
    }
  });

  it('synthesizes contract clauses and identifies root causes in CoT', async () => {
    const result = await agenticService.reconcileWithAgent(clientId, '2026-08-28');

    const discountFlag = result.flags.find((f) => f.type === 'stale_discount');
    assert.ok(discountFlag);
    assert.match(discountFlag.agenticReasoning!.contractAnalysis, /Section 3\.2|20% intro discount/i);
    assert.match(discountFlag.agenticReasoning!.driftDiagnosis, /expiry|drift|billing/i);

    const overageFlag = result.flags.find((f) => f.type === 'usage_overage');
    assert.ok(overageFlag);
    assert.match(overageFlag.agenticReasoning!.driftDiagnosis, /50 excess seats|telemetry/i);

    const moduleFlag = result.flags.find((f) => f.type === 'unbilled_module');
    assert.ok(moduleFlag);
    assert.match(moduleFlag.agenticReasoning!.contractAnalysis, /Analytics/i);
  });

  it('produces comprehensive agentic summary across all 4 data sources', async () => {
    const result = await agenticService.reconcileWithAgent(clientId, '2026-08-28');

    assert.equal(result.agenticSummary.totalEvaluatedSources, 4);
    assert.ok(result.agenticSummary.synthesizedClausesCount >= 3);
    assert.ok(result.agenticSummary.averageConfidenceScore >= 90);
    assert.match(result.agenticSummary.overallRiskAssessment, /Critical ARR leakage|high risk/i);
  });
});
