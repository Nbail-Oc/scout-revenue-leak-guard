import { ParsedContractTerms, ContractMetadata } from '../types.js';
import { FileStore, defaultStore } from '../storage/fileStore.js';

export class ContractParserService {
  private store: FileStore;

  constructor(store: FileStore = defaultStore) {
    this.store = store;
  }

  /**
   * Parses raw contract text/markdown into structured commercial terms.
   */
  async parseContractText(contractText: string): Promise<ParsedContractTerms> {
    const text = contractText;

    // 1. Client Name
    const clientMatch = text.match(/(?:Client|Company|Customer):\s*([^\r\n]+)/i);
    const clientName = clientMatch ? clientMatch[1].replace(/^#+\s*/, '').trim() : 'Unknown Client';

    // 2. Effective Date (YYYY-MM-DD)
    const dateMatch = text.match(/(?:Effective\s*Date|Start\s*Date|Signed):\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i);
    const effectiveDate = dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0];

    // 3. Annual Fee ($ amount)
    const feeMatch = text.match(/(?:Annual\s*Fee|Price|Contract\s*Value|Total\s*Fee):\s*\$?([0-9,]+(?:\.[0-9]{2})?)/i);
    const annualFee = feeMatch ? Number(feeMatch[1].replace(/,/g, '')) : 0;

    // 4. Discount Percentage & Expiry
    const discountMatch = text.match(/(?:Discount):\s*([0-9]+)%/i);
    const discountPct = discountMatch ? Number(discountMatch[1]) : 0;

    const discountExpiryMatch = text.match(/(?:Discount\s*Expiry|Expires|Discount\s*End):\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i);
    const discountExpiry = discountExpiryMatch ? discountExpiryMatch[1].trim() : undefined;

    // 5. Seats Included
    const seatsMatch = text.match(/(?:Seats|User\s*Seats|Included\s*Seats):\s*([0-9,]+)/i);
    const seatsIncluded = seatsMatch ? Number(seatsMatch[1].replace(/,/g, '')) : 0;

    // 6. Modules & Module Prices
    const modules: string[] = [];
    const modulePrices: Record<string, number> = {};

    const modulesSectionMatch = text.match(/(?:Modules|Entitlements|Features):\s*([^\r\n]+(?:\r?\n-[^\r\n]+)*)/i);
    if (modulesSectionMatch) {
      const sectionText = modulesSectionMatch[1];
      
      // Split by commas/newlines that are OUTSIDE parentheses
      const rawModuleItems: string[] = [];
      let current = '';
      let depth = 0;
      for (let i = 0; i < sectionText.length; i++) {
        const char = sectionText[i];
        if (char === '(') depth++;
        else if (char === ')') depth--;

        if ((char === ',' || char === '\n') && depth === 0) {
          if (current.trim()) rawModuleItems.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      if (current.trim()) rawModuleItems.push(current.trim());

      for (const rawItem of rawModuleItems) {
        const item = rawItem.replace(/^[-\*\s]+/, '').trim();
        if (!item || item.startsWith('#')) continue;

        const priceMatch = item.match(/^(.*?)\s*\(\$?([0-9,]+)(?:\/(?:year|yr|month|mo))?\)/i);
        if (priceMatch) {
          const modName = priceMatch[1].trim();
          const price = Number(priceMatch[2].replace(/,/g, ''));
          if (modName) {
            modules.push(modName);
            modulePrices[modName] = price;
          }
        } else {
          const modName = item.trim();
          if (modName) {
            modules.push(modName);
            modulePrices[modName] = 0;
          }
        }
      }
    }

    // 7. Overage Rate
    const overageMatch = text.match(/(?:Additional\s*Seats|Overage|Excess\s*Seats):\s*\$?([0-9,]+)(?:\/(?:seat|user))?/i);
    const overageSeatPrice = overageMatch ? Number(overageMatch[1].replace(/,/g, '')) : 0;

    // 8. Raw Clauses Excerpts
    const discountClauseMatch = text.match(/([^\n]*discount[^\n]*)/i);
    const pricingClauseMatch = text.match(/([^\n]*annual\s*fee[^\n]*)/i);
    const entitlementsClauseMatch = text.match(/([^\n]*seats[^\n]*)/i);
    const overageClauseMatch = text.match(/([^\n]*overage[^\n]*)/i);

    return {
      clientName,
      effectiveDate,
      annualFee,
      discountPct,
      discountExpiry,
      seatsIncluded,
      modules,
      modulePrices,
      overageSeatPrice,
      rawClauses: {
        pricingClause: pricingClauseMatch ? pricingClauseMatch[1].trim() : undefined,
        discountClause: discountClauseMatch ? discountClauseMatch[1].trim() : undefined,
        entitlementsClause: entitlementsClauseMatch ? entitlementsClauseMatch[1].trim() : undefined,
        overageClause: overageClauseMatch ? overageClauseMatch[1].trim() : undefined,
      },
    };
  }

  async parseAndSaveContract(clientId: string, contractId: string): Promise<ParsedContractTerms> {
    const contracts = await this.store.readCollection<ContractMetadata>(`contracts_${clientId}`);
    const contract = contracts.find((c) => c.id === contractId);

    if (!contract) {
      throw new Error(`Contract not found for id: ${contractId}`);
    }

    let content = contract.rawContent;
    if (!content && contract.filePath) {
      // Read file content if rawContent was not populated directly
      try {
        content = await this.store.readRawFile(`contracts/${clientId}`, contract.filename);
      } catch {
        content = '';
      }
    }

    const parsedTerms = await this.parseContractText(content || '');
    contract.parsedTerms = parsedTerms;
    contract.parsedAt = new Date().toISOString();

    await this.store.writeCollection(`contracts_${clientId}`, contracts);
    return parsedTerms;
  }

  async getParsedTerms(clientId: string, contractId: string): Promise<ParsedContractTerms | null> {
    const contracts = await this.store.readCollection<ContractMetadata>(`contracts_${clientId}`);
    const contract = contracts.find((c) => c.id === contractId);
    return contract?.parsedTerms ?? null;
  }
}
