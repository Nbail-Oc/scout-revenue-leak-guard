import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { FileStore } from '../src/storage/fileStore.js';
import { IngestionService } from '../src/services/ingestionService.js';

describe('IngestionService (Seam: Multi-Source Data Ingestion)', () => {
  let testStore: FileStore;
  let service: IngestionService;
  const clientId = 'client_yojit_123';

  beforeEach(async () => {
    const testDir = path.join(os.tmpdir(), `scout-ingest-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    testStore = new FileStore(testDir);
    service = new IngestionService(testStore);
  });

  describe('Billing CSV Ingestion', () => {
    it('successfully parses and stores valid billing CSV', async () => {
      const csv = `customer_id,current_price,active_discount_pct,billed_seats,billed_modules,last_synced_at
yojit_dubai,42000,20,100,"Basic",2026-08-28`;

      const result = await service.ingestBillingCsv(clientId, csv);
      assert.equal(result.success, true);
      assert.equal(result.records.length, 1);
      assert.equal(result.records[0].customerId, 'yojit_dubai');
      assert.equal(result.records[0].currentPrice, 42000);
      assert.equal(result.records[0].activeDiscountPct, 20);
      assert.equal(result.records[0].billedSeats, 100);
      assert.deepEqual(result.records[0].billedModules, ['Basic']);
      assert.equal(result.records[0].lastSyncedAt, '2026-08-28');
    });

    it('rejects billing CSV with missing required columns', async () => {
      const invalidCsv = `customer_id,current_price
yojit_dubai,42000`;

      const result = await service.ingestBillingCsv(clientId, invalidCsv);
      assert.equal(result.success, false);
      assert.ok(result.errors.length > 0);
      assert.match(result.errors[0], /Missing required column/);
    });
  });

  describe('Entitlements CSV Ingestion', () => {
    it('successfully parses and stores valid entitlements CSV with multiple modules', async () => {
      const csv = `customer_id,granted_seats,granted_modules,granted_at
yojit_dubai,100,"Basic,Analytics",2025-10-01`;

      const result = await service.ingestEntitlementsCsv(clientId, csv);
      assert.equal(result.success, true);
      assert.equal(result.records.length, 1);
      assert.equal(result.records[0].customerId, 'yojit_dubai');
      assert.equal(result.records[0].grantedSeats, 100);
      assert.deepEqual(result.records[0].grantedModules, ['Basic', 'Analytics']);
      assert.equal(result.records[0].grantedAt, '2025-10-01');
    });

    it('rejects entitlements CSV with invalid seat number', async () => {
      const invalidCsv = `customer_id,granted_seats,granted_modules,granted_at
yojit_dubai,not_a_number,"Basic",2025-10-01`;

      const result = await service.ingestEntitlementsCsv(clientId, invalidCsv);
      assert.equal(result.success, false);
      assert.match(result.errors[0], /Invalid number for granted_seats/);
    });
  });

  describe('Usage CSV Ingestion', () => {
    it('successfully parses and stores valid usage CSV', async () => {
      const csv = `customer_id,period,active_seats,features_used
yojit_dubai,2026-08,150,"Basic,Analytics"`;

      const result = await service.ingestUsageCsv(clientId, csv);
      assert.equal(result.success, true);
      assert.equal(result.records.length, 1);
      assert.equal(result.records[0].customerId, 'yojit_dubai');
      assert.equal(result.records[0].period, '2026-08');
      assert.equal(result.records[0].activeSeats, 150);
      assert.deepEqual(result.records[0].featuresUsed, ['Basic', 'Analytics']);
    });
  });

  describe('Contract Storage & Client Data Status Summary', () => {
    it('stores uploaded contract and computes readiness correctly (0/4 -> 4/4)', async () => {
      // 0/4 sources
      let status = await service.getClientDataStatus(clientId);
      assert.equal(status.isReadyForReconciliation, false);
      assert.equal(status.contracts.hasData, false);
      assert.equal(status.billing.hasData, false);
      assert.equal(status.entitlements.hasData, false);
      assert.equal(status.usage.hasData, false);

      // Upload Contract
      const contractContent = `# Service Agreement\n## Client: Yojit FZE\n## Annual Fee: $50,000`;
      const contractMeta = await service.uploadContract(clientId, 'yojit_contract.md', contractContent);
      assert.equal(contractMeta.clientId, clientId);
      assert.equal(contractMeta.fileType, 'markdown');

      // Upload remaining 3 sources
      await service.ingestBillingCsv(
        clientId,
        `customer_id,current_price,active_discount_pct,billed_seats,billed_modules,last_synced_at\nyojit,42000,20,100,"Basic",2026-08-28`
      );
      await service.ingestEntitlementsCsv(
        clientId,
        `customer_id,granted_seats,granted_modules,granted_at\nyojit,100,"Basic,Analytics",2025-10-01`
      );
      await service.ingestUsageCsv(
        clientId,
        `customer_id,period,active_seats,features_used\nyojit,2026-08,150,"Basic,Analytics"`
      );

      // 4/4 sources ready
      status = await service.getClientDataStatus(clientId);
      assert.equal(status.isReadyForReconciliation, true);
      assert.equal(status.contracts.hasData, true);
      assert.equal(status.billing.hasData, true);
      assert.equal(status.entitlements.hasData, true);
      assert.equal(status.usage.hasData, true);
    });
  });
});
