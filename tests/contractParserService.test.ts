import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { FileStore } from '../src/storage/fileStore.js';
import { IngestionService } from '../src/services/ingestionService.js';
import { ContractParserService } from '../src/services/contractParserService.js';

describe('ContractParserService (Seam: AI Contract Parsing Pipeline)', () => {
  let testStore: FileStore;
  let ingestionService: IngestionService;
  let parserService: ContractParserService;
  const clientId = 'client_yojit_test';

  beforeEach(async () => {
    const testDir = path.join(os.tmpdir(), `scout-parser-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    testStore = new FileStore(testDir);
    ingestionService = new IngestionService(testStore);
    parserService = new ContractParserService(testStore);
  });

  describe('Contract Text Parsing', () => {
    it('extracts all structured terms from standard Yojit contract Markdown', async () => {
      const contractMarkdown = `# Service Agreement

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

      const terms = await parserService.parseContractText(contractMarkdown);

      assert.equal(terms.clientName, 'Yojit FZE');
      assert.equal(terms.effectiveDate, '2025-08-01');
      assert.equal(terms.annualFee, 50000);
      assert.equal(terms.discountPct, 20);
      assert.equal(terms.discountExpiry, '2026-01-15');
      assert.equal(terms.seatsIncluded, 100);
      assert.deepEqual(terms.modules, ['Basic', 'Analytics']);
      assert.equal(terms.modulePrices['Basic'], 0);
      assert.equal(terms.modulePrices['Analytics'], 10000);
      assert.equal(terms.overageSeatPrice, 50);
      assert.ok(terms.rawClauses.discountClause, 'Should capture discount clause excerpt');
    });

    it('handles contracts with no discount specified', async () => {
      const noDiscountContract = `# Master Services Agreement
Client: Acme Corp
Effective Date: 2026-01-01
Annual Fee: $120,000
Seats: 250
Modules: Enterprise Suite ($20,000/year), Audit Log ($5,000/year)
Overage: $75/seat/month
`;

      const terms = await parserService.parseContractText(noDiscountContract);

      assert.equal(terms.clientName, 'Acme Corp');
      assert.equal(terms.annualFee, 120000);
      assert.equal(terms.discountPct, 0);
      assert.equal(terms.discountExpiry, undefined);
      assert.equal(terms.seatsIncluded, 250);
      assert.equal(terms.modulePrices['Enterprise Suite'], 20000);
      assert.equal(terms.modulePrices['Audit Log'], 5000);
      assert.equal(terms.overageSeatPrice, 75);
    });
  });

  describe('Contract Storage & Enrichment', () => {
    it('parses uploaded contract and persists terms to contract metadata', async () => {
      const contractMarkdown = `# Service Agreement
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

      const uploaded = await ingestionService.uploadContract(clientId, 'agreement.md', contractMarkdown);
      assert.equal(uploaded.parsedTerms, undefined);

      const parsed = await parserService.parseAndSaveContract(clientId, uploaded.id);
      assert.equal(parsed.annualFee, 50000);
      assert.equal(parsed.discountPct, 20);

      const fetchedTerms = await parserService.getParsedTerms(clientId, uploaded.id);
      assert.deepEqual(fetchedTerms, parsed);
    });

    it('throws error when attempting to parse non-existent contract', async () => {
      await assert.rejects(
        async () => {
          await parserService.parseAndSaveContract(clientId, 'non-existent-contract-id');
        },
        { message: /Contract not found/ }
      );
    });
  });
});
