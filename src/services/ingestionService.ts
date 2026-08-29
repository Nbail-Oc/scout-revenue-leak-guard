import crypto from 'node:crypto';
import path from 'node:path';
import {
  BillingRecord,
  EntitlementRecord,
  UsageRecord,
  ContractMetadata,
  ClientDataStatus,
  IngestResult,
} from '../types.js';
import { FileStore, defaultStore } from '../storage/fileStore.js';

export class IngestionService {
  private store: FileStore;

  constructor(store: FileStore = defaultStore) {
    this.store = store;
  }

  /**
   * Helper: Parse CSV string handling quoted strings with commas.
   */
  private parseCsvLines(csvContent: string): string[][] {
    const lines = csvContent
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines.map((line) => {
      const row: string[] = [];
      let inQuotes = false;
      let current = '';

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      row.push(current.trim());
      return row;
    });
  }

  private parseListField(value: string): string[] {
    if (!value) return [];
    const clean = value.replace(/^"|"$/g, '').trim();
    return clean.split(',').map((s) => s.trim()).filter(Boolean);
  }

  async ingestBillingCsv(clientId: string, csvContent: string): Promise<IngestResult<BillingRecord>> {
    const rows = this.parseCsvLines(csvContent);
    if (rows.length < 2) {
      return { success: false, records: [], errors: ['CSV contains no data rows'] };
    }

    const headers = rows[0].map((h) => h.toLowerCase());
    const requiredCols = ['customer_id', 'current_price', 'active_discount_pct', 'billed_seats', 'billed_modules', 'last_synced_at'];
    for (const col of requiredCols) {
      if (!headers.includes(col)) {
        return { success: false, records: [], errors: [`Missing required column: ${col}`] };
      }
    }

    const records: BillingRecord[] = [];
    const errors: string[] = [];

    const getVal = (row: string[], col: string) => row[headers.indexOf(col)] || '';

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const customerId = getVal(row, 'customer_id');
      const currentPrice = Number(getVal(row, 'current_price'));
      const activeDiscountPct = Number(getVal(row, 'active_discount_pct'));
      const billedSeats = Number(getVal(row, 'billed_seats'));
      const billedModules = this.parseListField(getVal(row, 'billed_modules'));
      const lastSyncedAt = getVal(row, 'last_synced_at');

      if (isNaN(currentPrice)) errors.push(`Row ${i}: Invalid number for current_price`);
      if (isNaN(activeDiscountPct)) errors.push(`Row ${i}: Invalid number for active_discount_pct`);
      if (isNaN(billedSeats)) errors.push(`Row ${i}: Invalid number for billed_seats`);

      if (errors.length === 0) {
        records.push({
          customerId,
          currentPrice,
          activeDiscountPct,
          billedSeats,
          billedModules,
          lastSyncedAt,
        });
      }
    }

    if (errors.length > 0) {
      return { success: false, records: [], errors };
    }

    await this.store.writeCollection(`billing_${clientId}`, records);
    return { success: true, records, errors: [] };
  }

  async ingestEntitlementsCsv(clientId: string, csvContent: string): Promise<IngestResult<EntitlementRecord>> {
    const rows = this.parseCsvLines(csvContent);
    if (rows.length < 2) {
      return { success: false, records: [], errors: ['CSV contains no data rows'] };
    }

    const headers = rows[0].map((h) => h.toLowerCase());
    const requiredCols = ['customer_id', 'granted_seats', 'granted_modules', 'granted_at'];
    for (const col of requiredCols) {
      if (!headers.includes(col)) {
        return { success: false, records: [], errors: [`Missing required column: ${col}`] };
      }
    }

    const records: EntitlementRecord[] = [];
    const errors: string[] = [];
    const getVal = (row: string[], col: string) => row[headers.indexOf(col)] || '';

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const customerId = getVal(row, 'customer_id');
      const grantedSeats = Number(getVal(row, 'granted_seats'));
      const grantedModules = this.parseListField(getVal(row, 'granted_modules'));
      const grantedAt = getVal(row, 'granted_at');

      if (isNaN(grantedSeats)) errors.push(`Row ${i}: Invalid number for granted_seats`);

      if (errors.length === 0) {
        records.push({
          customerId,
          grantedSeats,
          grantedModules,
          grantedAt,
        });
      }
    }

    if (errors.length > 0) {
      return { success: false, records: [], errors };
    }

    await this.store.writeCollection(`entitlements_${clientId}`, records);
    return { success: true, records, errors: [] };
  }

  async ingestUsageCsv(clientId: string, csvContent: string): Promise<IngestResult<UsageRecord>> {
    const rows = this.parseCsvLines(csvContent);
    if (rows.length < 2) {
      return { success: false, records: [], errors: ['CSV contains no data rows'] };
    }

    const headers = rows[0].map((h) => h.toLowerCase());
    const requiredCols = ['customer_id', 'period', 'active_seats', 'features_used'];
    for (const col of requiredCols) {
      if (!headers.includes(col)) {
        return { success: false, records: [], errors: [`Missing required column: ${col}`] };
      }
    }

    const records: UsageRecord[] = [];
    const errors: string[] = [];
    const getVal = (row: string[], col: string) => row[headers.indexOf(col)] || '';

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const customerId = getVal(row, 'customer_id');
      const period = getVal(row, 'period');
      const activeSeats = Number(getVal(row, 'active_seats'));
      const featuresUsed = this.parseListField(getVal(row, 'features_used'));

      if (isNaN(activeSeats)) errors.push(`Row ${i}: Invalid number for active_seats`);

      if (errors.length === 0) {
        records.push({
          customerId,
          period,
          activeSeats,
          featuresUsed,
        });
      }
    }

    if (errors.length > 0) {
      return { success: false, records: [], errors };
    }

    await this.store.writeCollection(`usage_${clientId}`, records);
    return { success: true, records, errors: [] };
  }

  async uploadContract(clientId: string, filename: string, content: string | Buffer): Promise<ContractMetadata> {
    const ext = path.extname(filename).toLowerCase();
    let fileType: 'markdown' | 'pdf' | 'text' = 'text';
    if (ext === '.md' || ext === '.markdown') fileType = 'markdown';
    else if (ext === '.pdf') fileType = 'pdf';

    const savedFilePath = await this.store.saveRawFile(`contracts/${clientId}`, filename, content);
    const contracts = await this.store.readCollection<ContractMetadata>(`contracts_${clientId}`);

    const metadata: ContractMetadata = {
      id: `contract_${crypto.randomBytes(6).toString('hex')}`,
      clientId,
      filename,
      fileType,
      uploadedAt: new Date().toISOString(),
      filePath: savedFilePath,
      rawContent: typeof content === 'string' ? content : undefined,
    };

    contracts.push(metadata);
    await this.store.writeCollection(`contracts_${clientId}`, contracts);
    return metadata;
  }

  async getClientDataStatus(clientId: string): Promise<ClientDataStatus> {
    const contracts = await this.store.readCollection<ContractMetadata>(`contracts_${clientId}`);
    const billing = await this.store.readCollection<BillingRecord>(`billing_${clientId}`);
    const entitlements = await this.store.readCollection<EntitlementRecord>(`entitlements_${clientId}`);
    const usage = await this.store.readCollection<UsageRecord>(`usage_${clientId}`);

    const contractsStatus = {
      hasData: contracts.length > 0,
      recordCount: contracts.length,
      lastUpdated: contracts[contracts.length - 1]?.uploadedAt,
      details: `${contracts.length} contract(s) uploaded`,
    };

    const billingStatus = {
      hasData: billing.length > 0,
      recordCount: billing.length,
      lastUpdated: billing[billing.length - 1]?.lastSyncedAt,
      details: `${billing.length} billing record(s)`,
    };

    const entitlementsStatus = {
      hasData: entitlements.length > 0,
      recordCount: entitlements.length,
      lastUpdated: entitlements[entitlements.length - 1]?.grantedAt,
      details: `${entitlements.length} entitlement record(s)`,
    };

    const usageStatus = {
      hasData: usage.length > 0,
      recordCount: usage.length,
      lastUpdated: usage[usage.length - 1]?.period,
      details: `${usage.length} usage record(s)`,
    };

    const isReadyForReconciliation =
      contractsStatus.hasData && billingStatus.hasData && entitlementsStatus.hasData && usageStatus.hasData;

    return {
      clientId,
      contracts: contractsStatus,
      billing: billingStatus,
      entitlements: entitlementsStatus,
      usage: usageStatus,
      isReadyForReconciliation,
    };
  }
}
