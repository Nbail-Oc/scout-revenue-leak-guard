import { ClientService } from './services/clientService.js';
import { IngestionService } from './services/ingestionService.js';
import { defaultStore } from './storage/fileStore.js';

export async function seedDemoData() {
  const clientService = new ClientService(defaultStore);
  const ingestionService = new IngestionService(defaultStore);

  console.log('Seeding Demo Data from IDEA.md...');

  // 1. Create Yojit Client
  const client = await clientService.createClient({
    id: 'yojit_dubai',
    name: 'Yojit FZE',
    description: 'Dubai-based logistics SaaS company',
    industry: 'SaaS',
    contactEmail: 'billing@yojit.com',
    contactName: 'Ahmed Al-Mansoori',
    timezone: 'Asia/Dubai',
    currency: 'USD',
  });
  console.log(`✓ Created Client: ${client.name} (${client.id})`);

  // 2. Upload Contract
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
- Additional Seats: $50/seat/month
`;
  const contract = await ingestionService.uploadContract(client.id, 'yojit_agreement.md', contractContent);
  console.log(`✓ Uploaded Contract: ${contract.filename}`);

  // 2b. Parse Contract with RocketRide AI Parser
  const contractParserService = new (await import('./services/contractParserService.js')).ContractParserService(defaultStore);
  const parsedTerms = await contractParserService.parseAndSaveContract(client.id, contract.id);
  console.log(`✓ AI Parsed Contract: $${parsedTerms.annualFee}/yr, ${parsedTerms.discountPct}% discount (expires ${parsedTerms.discountExpiry}), ${parsedTerms.seatsIncluded} seats`);

  // 3. Ingest Billing CSV
  const billingCsv = `customer_id,current_price,active_discount_pct,billed_seats,billed_modules,last_synced_at
yojit_dubai,42000,20,100,"Basic",2026-08-28`;
  await ingestionService.ingestBillingCsv(client.id, billingCsv);
  console.log('✓ Ingested Billing CSV');

  // 4. Ingest Entitlement CSV
  const entitlementCsv = `customer_id,granted_seats,granted_modules,granted_at
yojit_dubai,100,"Basic,Analytics",2025-10-01`;
  await ingestionService.ingestEntitlementsCsv(client.id, entitlementCsv);
  console.log('✓ Ingested Entitlements CSV');

  // 5. Ingest Usage CSV
  const usageCsv = `customer_id,period,active_seats,features_used
yojit_dubai,2026-08,150,"Basic,Analytics"`;
  await ingestionService.ingestUsageCsv(client.id, usageCsv);
  console.log('✓ Ingested Usage CSV');

  // 6. Verify Status
  const status = await ingestionService.getClientDataStatus(client.id);
  console.log(`✓ All 4 Sources Ingested. Ready for Reconciliation: ${status.isReadyForReconciliation}`);

  // 7. Run Agentic Reconciliation Engine (RocketRide CoT)
  const { AgenticReconciliationService } = await import('./services/agenticReconciliationService.js');
  const agenticService = new AgenticReconciliationService(defaultStore);
  const reconResult = await agenticService.reconcileWithAgent(client.id, '2026-08-28');
  console.log(`✓ Agentic Reconciliation Complete: Generated ${reconResult.flags.length} Revenue Leak Flags!`);
  console.log(`✓ Overall Risk Assessment: ${reconResult.agenticSummary.overallRiskAssessment}`);
  for (const flag of reconResult.flags) {
    console.log(`\n  🚨 [${flag.type.toUpperCase()}] ${flag.title} (${flag.agenticReasoning?.confidenceScore}% Confidence)`);
    console.log(`     Monthly Leak: $${flag.monthlyImpact.toFixed(2)} | Cumulative: $${flag.cumulativeImpact.toFixed(2)}`);
    console.log(`     Contract Analysis: ${flag.agenticReasoning?.contractAnalysis}`);
    console.log(`     Drift Diagnosis: ${flag.agenticReasoning?.driftDiagnosis}`);
    console.log(`     Chain of Thought Steps:`);
    flag.agenticReasoning?.chainOfThought.forEach((step, idx) => {
      console.log(`       ${idx + 1}. ${step}`);
    });
    console.log(`     👉 Action: ${flag.agenticReasoning?.recommendedAction}`);
  }
  return reconResult;
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDemoData()
    .then(() => console.log('Seeding completed successfully!'))
    .catch((err) => console.error('Seeding failed:', err));
}
