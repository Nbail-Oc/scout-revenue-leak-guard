// =============================================================================
// App.tsx — Scout Revenue Leak Guard · Executive Enterprise Application
// Modular Architecture: Root State Orchestrator & View Switcher
// =============================================================================

import React, { useState } from 'react';
import './index.css';
import type { ShellAppProps } from 'shell';
import { AppLayout } from 'shell';
import { Agentation } from 'agentation';
import {
  Analytics01Icon,
  Brain02Icon,
  Building01Icon,
  File01Icon,
  MailSend01Icon,
  SecurityCheckIcon,
  Settings01Icon,
  Alert02Icon,
  CheckmarkBadge01Icon,
  ArrowLeft01Icon,
  RefreshIcon,
  FlashIcon,
  ViewIcon,
  Upload01Icon,
  CodeIcon,
  CloudIcon,
  SparklesIcon,
} from 'hugeicons-react';

import { DataIngestionModal, type IngestionSourceType } from './components/DataIngestionModal';
import { ContractParserView, type ParsedContractTerms } from './components/ContractParserView';
import { TrueUpInvoiceModal, defaultYojitInvoiceItems } from './components/TrueUpInvoiceModal';
import { WebhookSimulatorModal, type WebhookEventPayload } from './components/WebhookSimulatorModal';
import { AuditPackageExporter } from './components/AuditPackageExporter';
import { RuleStudioView } from './components/RuleStudioView';
import { ERPWritebackModal } from './components/ERPWritebackModal';
import { RevOpsCopilotDrawer } from './components/RevOpsCopilotDrawer';
import { LandingPageView } from './components/LandingPageView';
import { SignUpView } from './components/SignUpView';

import { PortfolioDashboardView } from './components/PortfolioDashboardView';
import { ClientDashboardView } from './components/ClientDashboardView';
import { ApprovalQueueView } from './components/ApprovalQueueView';
import { AuditLogView } from './components/AuditLogView';
import { SettingsView } from './components/SettingsView';

import type { NavigationTab, ClientItem, RevenueLeakFlag, AuditLogEntry } from './types/scout';
import { liveLlmService } from './services/liveLlmService';
import { emailDispatchService } from './services/emailDispatchService';

const defaultYojitFlags: RevenueLeakFlag[] = [
  {
    id: 'flag_01',
    type: 'stale_discount',
    title: 'Stale Introductory Discount Applied (20% past expiry)',
    status: 'open',
    monthlyImpact: 833.33,
    cumulativeImpact: 5833.33,
    monthsCompounding: 7,
    evidence: {
      clause: 'Section 3.2: Customer receives 20% discount for first 6 months, expiring 2026-01-15.',
      source: 'Stripe/Billing subscription applies 20% recurring discount override as of August 2026.',
      delta: '20% promotional discount applied 7 months past legal expiration date (2026-01-15).',
    },
    agenticReasoning: {
      stage1RuleInput: {
        ruleId: 'RULE-01-STALE-DISCOUNT',
        detectedDelta: 'Active billing discount rate (20%) exceeds contract validity date (2026-01-15).',
        rawAmount: 5833.33,
      },
      confidenceScore: 98,
      contractAnalysis:
        'Section 3.2 specifies: "Customer receives 20% discount for first 6 months, expiring 2026-01-15". The discount was strictly introductory for onboarding and has legally expired.',
      driftDiagnosis:
        'Billing coupon failed to auto-expire on 2026-01-15. Recurring invoices continued at discounted rate without automated RevOps notification.',
      chainOfThought: [
        'Stage 1 Ingestion: Received Rule-01 ground-truth finding ($5,833.33 unbilled discount delta across 7 elapsed months).',
        'Wave 1 (Legal Interpretation): Evaluated pricing schedule. Verified 20% discount had strict 6-month validity ending 2026-01-15.',
        'Wave 2 (Billing Cross-Check): Queried active billing profile. Stripe subscription still applies 20% discount override in August 2026.',
        'Wave 3 (Drift Causality): RevOps entered promotion as persistent line-item rather than fixed duration rule.',
        'Wave 4 (Valuation & Formulation): 7 months elapsed since cutoff = $5,833.33 cumulative unbilled ARR ($833.33/mo).',
      ],
      nuanceFlags: [
        'No contract amendment or executive override found extending discount.',
        'Under-billing is contractually unambiguous and recoverable via true-up invoice.',
      ],
      recommendedAction: 'Draft customer true-up invoice for $5,833.33 and adjust billing to full $50,000/yr rate immediately.',
    },
  },
  {
    id: 'flag_02',
    type: 'usage_overage',
    title: 'Unbilled Usage Overage (50 excess user seats)',
    status: 'open',
    monthlyImpact: 2500.0,
    cumulativeImpact: 7500.0,
    monthsCompounding: 3,
    evidence: {
      clause: 'Section 4.3: Additional user seats beyond 100 billed at $50/seat/month.',
      source: 'Telemetry logs report 150 daily active user accounts vs 100 base seats contracted.',
      delta: '50 excess seats active across past 3 billing cycles @ $50/seat/month.',
    },
    agenticReasoning: {
      stage1RuleInput: {
        ruleId: 'RULE-02-USAGE-OVERAGE',
        detectedDelta: 'Active telemetry seats (150) exceed contracted baseline license (100) by 50 units.',
        rawAmount: 7500.0,
      },
      confidenceScore: 96,
      contractAnalysis: 'Section 4.3 stipulates overage rate of $50/seat/month for all seats exceeding the 100 included baseline.',
      driftDiagnosis: 'Product engineering allowed seat provisioning beyond the 100 license cap without triggering automated billing webhook.',
      chainOfThought: [
        'Stage 1 Ingestion: Received Rule-02 ground-truth finding (50 excess user seats over 3 compounding months).',
        'Wave 1 (License Baseline): Verified contract included seats (100 base user seats).',
        'Wave 2 (Telemetry Ingestion): Ingested product usage logs showing 150 active daily user accounts in August 2026.',
        'Wave 3 (Overage Contract Rule): Calculated 50 unbilled excess seats beyond license quota @ $50/seat/mo.',
        'Wave 4 (Valuation & Formulation): 50 seats × $50/mo × 3 compounding months = $7,500.00 recoverable revenue.',
      ],
      nuanceFlags: [
        'High customer engagement and seat growth indicates strong renewal health.',
        'Recommend pairing true-up invoice with annual expansion tier proposal.',
      ],
      recommendedAction: 'Issue metered overage invoice for $7,500.00 and adjust recurring seat count to 150.',
    },
  },
  {
    id: 'flag_03',
    type: 'unbilled_module',
    title: 'Unbilled Feature Module (Analytics Add-on — $10,000/yr)',
    status: 'open',
    monthlyImpact: 833.33,
    cumulativeImpact: 8333.33,
    monthsCompounding: 10,
    evidence: {
      clause: 'Section 4.1: Entitled to Analytics add-on module ($10,000/year).',
      source: 'Entitlements database shows Analytics provisioned 2025-10-01; Billing only charges Basic tier ($42,000/yr).',
      delta: 'Analytics module active for 10 months without billing subscription line item.',
    },
    agenticReasoning: {
      stage1RuleInput: {
        ruleId: 'RULE-03-UNBILLED-MODULE',
        detectedDelta: 'Entitlement flag [Analytics] enabled since 2025-10-01 is absent from active billing subscription.',
        rawAmount: 8333.33,
      },
      confidenceScore: 95,
      contractAnalysis: 'Contract explicitly designates Analytics module as a paid add-on ($10,000/year) rather than free bundled tier.',
      driftDiagnosis: 'Entitlements database enabled the Analytics feature flag in October 2025, but the billing subscription was never updated with the $10k line item.',
      chainOfThought: [
        'Stage 1 Ingestion: Received Rule-03 ground-truth finding (10 months unbilled Analytics feature module @ $10,000/yr).',
        'Wave 1 (Contract & Entitlement Check): Contract specifies Analytics add-on @ $10,000/yr. Entitlements show feature enabled 2025-10-01.',
        'Wave 2 (Billing Configuration Audit): Active billing subscription only bills for Basic tier line item ($42,000/yr).',
        'Wave 3 (Drift Causality): Provisioning was activated via customer success ticket without linking back to billing subscription items.',
        'Wave 4 (Valuation & Formulation): Feature delivered and used for 10 months with zero billing charge = $8,333.33 unbilled revenue leak.',
      ],
      nuanceFlags: [
        'Customer has actively accessed analytics telemetry with zero billing complaints.',
        'High recovery success probability with explicit contractual clause proof.',
      ],
      recommendedAction: 'Add Analytics subscription add-on ($10,000/yr) to billing and issue pro-rated true-up invoice for $8,333.33.',
    },
  },
];

const defaultYojitContract = `# Service Agreement

## Client: Yojit FZE
## Effective Date: 2025-08-01

## Pricing & Commercial Schedule
- Section 3.1: Annual subscription fee of $50,000 billed in advance annually.
- Section 3.2: Customer receives 20% introductory onboarding discount for first 6 months, strictly expiring 2026-01-15.

## Entitlements & Licensing
- Section 4.1: Base entitlement includes 100 user seats and Basic Platform module.
- Section 4.2: Analytics module designated as optional add-on at $10,000/year.

## Overage Terms
- Section 4.3: Additional user seats beyond 100 included baseline billed at $50/seat/month.
`;

const defaultYojitParsed: ParsedContractTerms = {
  clientName: 'Yojit FZE',
  effectiveDate: '2025-08-01',
  annualFee: 50000,
  discountPct: 20,
  discountExpiry: '2026-01-15',
  seatsIncluded: 100,
  modules: ['Basic', 'Analytics'],
  modulePrices: { Basic: 0, Analytics: 10000 },
  overageSeatPrice: 50,
  rawClauses: {
    pricingClause: 'Section 3.1: Annual subscription fee of $50,000 billed in advance annually.',
    discountClause: 'Section 3.2: Customer receives 20% discount for first 6 months, expiring 2026-01-15.',
    entitlementsClause: 'Section 4.1: Entitled to 100 base user seats and Basic + Analytics modules ($10k/yr).',
    overageClause: 'Section 4.3: Additional user seats beyond 100 billed at $50/seat/month.',
  },
};

const initialClients: ClientItem[] = [
  {
    id: 'yojit_dubai',
    name: 'Yojit FZE',
    industry: 'Logistics SaaS',
    contactName: 'Ahmed Al-Mansoori',
    contactEmail: 'billing@yojit.com',
    billingSystem: 'Stripe Billing API',
    currency: 'USD ($)',
    annualContractValue: 50000,
    contractRaw: defaultYojitContract,
    parsedTerms: defaultYojitParsed,
    billingData: {
      chargedAnnual: 42000,
      activeDiscountPct: 20,
      billedSeats: 100,
      billedModules: ['Basic'],
      lastSynced: '2026-08-28',
    },
    entitlementsData: {
      grantedSeats: 100,
      grantedModules: ['Basic', 'Analytics'],
      grantedAt: '2025-10-01',
    },
    usageData: {
      activeDailySeats: 150,
      featuresUsed: ['Basic', 'Analytics'],
      period: '2026-08',
    },
    flags: defaultYojitFlags,
  },
  {
    id: 'acme_corp',
    name: 'Acme Cloud Inc',
    industry: 'Fintech Infrastructure',
    contactName: 'Sarah Jenkins',
    contactEmail: 'finance@acme.io',
    billingSystem: 'NetSuite SuiteBilling',
    currency: 'USD ($)',
    annualContractValue: 120000,
    contractRaw: `# Service Agreement\n## Client: Acme Cloud Inc\n## Annual Fee: $120,000\n## Seats: 250 included\n## Discount: None`,
    parsedTerms: {
      clientName: 'Acme Cloud Inc',
      effectiveDate: '2026-01-01',
      annualFee: 120000,
      discountPct: 0,
      seatsIncluded: 250,
      modules: ['Enterprise', 'Security_Suite'],
      modulePrices: { Enterprise: 0, Security_Suite: 0 },
      overageSeatPrice: 40,
      rawClauses: {
        pricingClause: 'Annual subscription fee of $120,000 billed annually.',
        entitlementsClause: '250 Enterprise seats with Security Suite included.',
      },
    },
    billingData: {
      chargedAnnual: 120000,
      activeDiscountPct: 0,
      billedSeats: 250,
      billedModules: ['Enterprise', 'Security_Suite'],
      lastSynced: '2026-08-28',
    },
    entitlementsData: {
      grantedSeats: 250,
      grantedModules: ['Enterprise', 'Security_Suite'],
      grantedAt: '2026-01-01',
    },
    usageData: {
      activeDailySeats: 240,
      featuresUsed: ['Enterprise', 'Security_Suite'],
      period: '2026-08',
    },
    flags: [],
  },
];

const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'audit_01',
    timestamp: '2026-08-28 21:30:15',
    actor: 'Scout Hybrid Pipeline (Stage 1 Rules -> Stage 2 Agentic CoT)',
    action: 'Stage 1 Rule-Based Scan identified 3 deltas ($21,666.66). Stage 2 Agentic CoT synthesized root-cause drift and drafted true-up notices.',
    clientName: 'Yojit FZE',
    amount: 21666.66,
    status: 'verified',
    hash: '0x7f8a9b2c3d4e',
  },
  {
    id: 'audit_02',
    timestamp: '2026-08-28 20:15:00',
    actor: 'Scout Hybrid Pipeline (Stage 1 Rules -> Stage 2 Agentic CoT)',
    action: 'Parsed Service Agreement PDF for Acme Cloud Inc. Extracted 250 seats baseline. All 4 sources matched with 0 discrepancies.',
    clientName: 'Acme Cloud Inc',
    amount: 120000.0,
    status: 'synced',
    hash: '0x1a2b3c4d5e6f',
  },
];

export const App: React.FC<ShellAppProps> = ({ isConnected }) => {
  const [viewMode, setViewMode] = useState<'landing' | 'signup' | 'dashboard'>('landing');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; company: string }>({
    name: 'Nabil Thange',
    email: 'nabil.thange@scoutguard.io',
    company: 'Apex Global Enterprises',
  });
  const [activeTab, setActiveTab] = useState<NavigationTab>('portfolio');
  const [clients, setClients] = useState<ClientItem[]>(initialClients);
  const [selectedClientId, setSelectedClientId] = useState<string>('yojit_dubai');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [activeIngestionModal, setActiveIngestionModal] = useState<IngestionSourceType | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showAuditExportModal, setShowAuditExportModal] = useState(false);
  const [showERPWritebackModal, setShowERPWritebackModal] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);

  // Live LLM / Gemini API States
  const [geminiKeyInput, setGeminiKeyInput] = useState(liveLlmService.getApiKey() || '');
  const [apiKeyConfigured, setApiKeyConfigured] = useState(liveLlmService.isLive());
  const [activeLlmModel, setActiveLlmModel] = useState(liveLlmService.getModel());
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestResult, setKeyTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveApiKey = () => {
    liveLlmService.setApiKey(geminiKeyInput.trim() || null);
    setApiKeyConfigured(liveLlmService.isLive());
    setKeyTestResult({
      success: true,
      message: liveLlmService.isLive()
        ? 'Gemini API Key saved and active!'
        : 'API Key cleared. Using deterministic fallback engine.',
    });
    setTimeout(() => setKeyTestResult(null), 4000);
  };

  const handleTestApiKey = async () => {
    setIsTestingKey(true);
    setKeyTestResult(null);
    const result = await liveLlmService.testConnection(geminiKeyInput.trim());
    setIsTestingKey(false);
    if (result.success) {
      setKeyTestResult({
        success: true,
        message: `Connection successful! Connected to Google Gemini (${result.modelName}).`,
      });
    } else {
      setKeyTestResult({
        success: false,
        message: `Connection failed: ${result.error}`,
      });
    }
  };

  // New Client Form States
  const [newClientName, setNewClientName] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newBillingSystem, setNewBillingSystem] = useState('Stripe Billing API');
  const [newCurrency, setNewCurrency] = useState('USD ($)');

  const [isReconciling, setIsReconciling] = useState(false);
  const [reconProgressStage, setReconProgressStage] = useState<'idle' | 'stage1_rules' | 'stage2_agent' | 'done'>('idle');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [queueSuccessMsg, setQueueSuccessMsg] = useState<string | null>(null);

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const totalPortfolioAtRisk = clients.reduce(
    (acc, client) =>
      acc + client.flags.filter((f) => f.status === 'open').reduce((sum, f) => sum + f.cumulativeImpact, 0),
    0
  );

  const totalMonthlyVelocity = clients.reduce(
    (acc, client) =>
      acc + client.flags.filter((f) => f.status === 'open').reduce((sum, f) => sum + f.monthlyImpact, 0),
    0
  );

  const totalOpenFlags = clients.reduce(
    (acc, client) => acc + client.flags.filter((f) => f.status === 'open').length,
    0
  );

  // Automated Dual-Stage Reconciliation Trigger
  const triggerAutomatedReconciliation = (clientToReconcile: ClientItem) => {
    setIsReconciling(true);
    setReconProgressStage('stage1_rules');

    setTimeout(() => {
      setReconProgressStage('stage2_agent');

      setTimeout(() => {
        setIsReconciling(false);
        setReconProgressStage('done');

        const newEntry: AuditLogEntry = {
          id: `audit_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          actor: 'Scout Automated Dual-Stage Pipeline',
          action: `Automated reconciliation completed for ${clientToReconcile.name}. Stage 1 rule discrepancies fed into Stage 2 CoT Reasoner.`,
          clientName: clientToReconcile.name,
          amount: clientToReconcile.flags.reduce((s, f) => s + f.cumulativeImpact, 0),
          status: 'verified',
          hash: `0x${Math.random().toString(16).slice(2, 14)}`,
        };
        setAuditLogs((prev) => [newEntry, ...prev]);

        setTimeout(() => setReconProgressStage('idle'), 3000);
      }, 750);
    }, 650);
  };

  // Handle incoming live webhook events
  const handleDispatchWebhook = (eventPayload: WebhookEventPayload) => {
    const targetClient = { ...selectedClient };

    if (eventPayload.source === 'telemetry') {
      targetClient.usageData = {
        activeDailySeats: 175,
        featuresUsed: ['Basic', 'Analytics'],
        period: '2026-08 (Live Webhook)',
      };
    } else if (eventPayload.source === 'stripe') {
      targetClient.billingData = {
        chargedAnnual: 42000,
        activeDiscountPct: 20,
        billedSeats: 100,
        billedModules: ['Basic'],
        lastSynced: new Date().toISOString().split('T')[0],
      };
    } else if (eventPayload.source === 'entitlements') {
      targetClient.entitlementsData = {
        grantedSeats: 100,
        grantedModules: ['Basic', 'Analytics', 'Security_Suite'],
        grantedAt: new Date().toISOString().split('T')[0],
      };
    }

    setClients(clients.map((c) => (c.id === targetClient.id ? targetClient : c)));

    const auditEntry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: `Live Webhook [${eventPayload.source.toUpperCase()}]`,
      action: `Received event [${eventPayload.eventType}]. Automated Dual-Stage Reconciler triggered in background.`,
      clientName: targetClient.name,
      amount: targetClient.flags.reduce((s, f) => s + f.cumulativeImpact, 0),
      status: 'synced',
      hash: `0x${Math.random().toString(16).slice(2, 14)}`,
    };
    setAuditLogs([auditEntry, ...auditLogs]);

    triggerAutomatedReconciliation(targetClient);
  };

  // Handle ERP writeback success
  const handleERPWritebackSuccess = (auditEntry: AuditLogEntry) => {
    setAuditLogs([auditEntry, ...auditLogs]);
    setQueueSuccessMsg('Two-way ERP writeback executed: Stripe, NetSuite, and Salesforce synchronized successfully.');
    setShowERPWritebackModal(false);
    setTimeout(() => setQueueSuccessMsg(null), 5000);
  };

  // Handle successful data ingestion from modal
  const handleIngestSuccess = (result: {
    sourceType: IngestionSourceType;
    rawText: string;
    parsedCount: number;
  }) => {
    const { sourceType, rawText } = result;
    const updatedClient = { ...selectedClient };

    if (sourceType === 'contract') {
      updatedClient.contractRaw = rawText;
      const feeMatch = rawText.match(/\$(\d+[\d,]*)/);
      const discountMatch = rawText.match(/(\d+)%\s*discount/i);
      const seatsMatch = rawText.match(/(\d+)\s*seats?/i);

      const annualFee = feeMatch ? Number(feeMatch[1].replace(/,/g, '')) : updatedClient.parsedTerms?.annualFee || 50000;
      updatedClient.annualContractValue = annualFee;

      updatedClient.parsedTerms = {
        clientName: updatedClient.name,
        effectiveDate: '2025-08-01',
        annualFee,
        discountPct: discountMatch ? Number(discountMatch[1]) : 20,
        discountExpiry: '2026-01-15',
        seatsIncluded: seatsMatch ? Number(seatsMatch[1]) : 100,
        modules: ['Basic', 'Analytics'],
        modulePrices: { Basic: 0, Analytics: 10000 },
        overageSeatPrice: 50,
        rawClauses: {
          pricingClause: 'Extracted pricing clause from updated agreement.',
        },
      };
    } else if (sourceType === 'billing') {
      updatedClient.billingData = {
        chargedAnnual: 42000,
        activeDiscountPct: 20,
        billedSeats: 100,
        billedModules: ['Basic'],
        lastSynced: new Date().toISOString().split('T')[0],
      };
    } else if (sourceType === 'entitlements') {
      updatedClient.entitlementsData = {
        grantedSeats: 100,
        grantedModules: ['Basic', 'Analytics'],
        grantedAt: '2025-10-01',
      };
    } else if (sourceType === 'usage') {
      updatedClient.usageData = {
        activeDailySeats: 150,
        featuresUsed: ['Basic', 'Analytics'],
        period: '2026-08',
      };
    }

    if (
      updatedClient.contractRaw &&
      updatedClient.billingData &&
      updatedClient.entitlementsData &&
      updatedClient.usageData &&
      updatedClient.flags.length === 0
    ) {
      updatedClient.flags = defaultYojitFlags;
    }

    setClients(clients.map((c) => (c.id === selectedClient.id ? updatedClient : c)));

    const auditEntry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: 'Data Ingestion Connector',
      action: `Ingested ${sourceType.toUpperCase()} source for ${selectedClient.name}. Automated AI reconciliation triggered.`,
      clientName: selectedClient.name,
      amount: updatedClient.flags.reduce((s, f) => s + f.cumulativeImpact, 0),
      status: 'synced',
      hash: `0x${Math.random().toString(16).slice(2, 14)}`,
    };
    setAuditLogs([auditEntry, ...auditLogs]);

    triggerAutomatedReconciliation(updatedClient);
  };

  // Load all sample sources
  const handleLoadAllSamplesForClient = () => {
    const updatedClient: ClientItem = {
      ...selectedClient,
      annualContractValue: 50000,
      contractRaw: defaultYojitContract,
      parsedTerms: defaultYojitParsed,
      billingData: {
        chargedAnnual: 42000,
        activeDiscountPct: 20,
        billedSeats: 100,
        billedModules: ['Basic'],
        lastSynced: new Date().toISOString().split('T')[0],
      },
      entitlementsData: {
        grantedSeats: 100,
        grantedModules: ['Basic', 'Analytics'],
        grantedAt: '2025-10-01',
      },
      usageData: {
        activeDailySeats: 150,
        featuresUsed: ['Basic', 'Analytics'],
        period: '2026-08',
      },
      flags: defaultYojitFlags,
    };

    setClients(clients.map((c) => (c.id === selectedClient.id ? updatedClient : c)));

    const auditEntry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: 'Sample Data Loader',
      action: `Loaded complete 4-source dataset for ${selectedClient.name}. AI reconciliation triggered.`,
      clientName: selectedClient.name,
      amount: 21666.66,
      status: 'synced',
      hash: `0x${Math.random().toString(16).slice(2, 14)}`,
    };
    setAuditLogs([auditEntry, ...auditLogs]);

    triggerAutomatedReconciliation(updatedClient);
  };

  // Update contract from parser view
  const handleUpdateContractFromParser = (clientId: string, rawText: string) => {
    const target = clients.find((c) => c.id === clientId);
    if (!target) return;

    const feeMatch = rawText.match(/\$(\d+[\d,]*)/);
    const discountMatch = rawText.match(/(\d+)%\s*discount/i);
    const seatsMatch = rawText.match(/(\d+)\s*seats?/i);

    const annualFee = feeMatch ? Number(feeMatch[1].replace(/,/g, '')) : target.parsedTerms?.annualFee || 50000;

    const updated: ClientItem = {
      ...target,
      contractRaw: rawText,
      annualContractValue: annualFee,
      parsedTerms: {
        clientName: target.name,
        effectiveDate: '2025-08-01',
        annualFee,
        discountPct: discountMatch ? Number(discountMatch[1]) : 20,
        discountExpiry: '2026-01-15',
        seatsIncluded: seatsMatch ? Number(seatsMatch[1]) : 100,
        modules: ['Basic', 'Analytics'],
        modulePrices: { Basic: 0, Analytics: 10000 },
        overageSeatPrice: 50,
        rawClauses: {
          pricingClause: 'Extracted pricing clause from updated agreement.',
        },
      },
    };

    setClients(clients.map((c) => (c.id === clientId ? updated : c)));
    triggerAutomatedReconciliation(updated);
  };

  // Create new client
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientEmail.trim()) return;

    const newClientId = `client_${Date.now()}`;
    const newClient: ClientItem = {
      id: newClientId,
      name: newClientName.trim(),
      industry: 'Pending Contract Extraction',
      contactName: newContactName.trim() || 'Billing Administrator',
      contactEmail: newClientEmail.trim(),
      billingSystem: newBillingSystem,
      currency: newCurrency,
      annualContractValue: 0,
      flags: [],
    };

    setClients([...clients, newClient]);
    setSelectedClientId(newClientId);
    setNewClientName('');
    setNewContactName('');
    setNewClientEmail('');
    setShowAddClientModal(false);
    setActiveTab('client_dashboard');
  };

  const handleApproveResolution = async (
    flagId: string,
    dispatchOptions?: { noticeText: string; to: string; cc: string; attachInvoice: boolean }
  ) => {
    const flag = selectedClient.flags.find((f) => f.id === flagId);
    const amount = flag?.cumulativeImpact || 0;

    let dispatchMsg = 'True-up resolution approved and customer notice queued for dispatch.';
    let messageId = `msg_${Date.now()}`;

    if (dispatchOptions) {
      let subject = `True-Up Adjustment Notice — ${selectedClient.name}`;
      let body = dispatchOptions.noticeText;

      const lines = dispatchOptions.noticeText.split('\n');
      if (lines[0].toLowerCase().startsWith('subject:')) {
        subject = lines[0].replace(/^subject:\s*/i, '').trim();
        body = lines.slice(1).join('\n').trim();
      }

      const attachments = dispatchOptions.attachInvoice
        ? [
            emailDispatchService.generateInvoiceAttachment(
              selectedClient.name,
              selectedClient.contactName,
              defaultYojitInvoiceItems,
              selectedClient.currency,
              amount
            ),
          ]
        : [];

      const res = await emailDispatchService.dispatchNotice({
        to: dispatchOptions.to,
        cc: dispatchOptions.cc,
        subject,
        preheader: `A revenue reconciliation notice for ${selectedClient.name} is ready for review.`,
        body,
        senderName: 'Scout Revenue Guard',
        clientName: selectedClient.name,
        buttonText: 'View Audit Ledger',
        buttonUrl: window.location.origin,
        attachments,
      });

      if (res.success) {
        messageId = res.messageId || messageId;
        dispatchMsg = `True-up notice dispatched to ${dispatchOptions.to} via n8n (Msg ID: ${messageId}).`;
      } else {
        dispatchMsg = `Approved locally. n8n Notice: ${res.error || 'Webhook unreachable'}`;
      }
    }

    setQueueSuccessMsg(dispatchMsg);
    const updatedFlags = selectedClient.flags.map((f) =>
      f.id === flagId ? { ...f, status: 'approved' as const } : f
    );
    setClients(clients.map((c) => (c.id === selectedClient.id ? { ...c, flags: updatedFlags } : c)));

    const newEntry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: `${currentUser.name} (Finance Approver)`,
      action: `Approved true-up resolution for flag ${flagId} on ${selectedClient.name}. Dispatched notice via n8n. Message ID: ${messageId}.`,
      clientName: selectedClient.name,
      amount,
      status: 'approved',
      hash: `0x${Math.random().toString(16).slice(2, 14)}`,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
    setTimeout(() => setQueueSuccessMsg(null), 5000);
  };

  const handleMarkException = (flagId: string) => {
    setQueueSuccessMsg('Flag marked as legal exception.');
    const updatedFlags = selectedClient.flags.map((f) =>
      f.id === flagId ? { ...f, status: 'exception' as const } : f
    );
    setClients(clients.map((c) => (c.id === selectedClient.id ? { ...c, flags: updatedFlags } : c)));
    setTimeout(() => setQueueSuccessMsg(null), 4000);
  };

  const handleBulkApproveAll = () => {
    const openCount = selectedClient.flags.filter((f) => f.status === 'open').length;
    if (openCount === 0) return;

    const updatedFlags = selectedClient.flags.map((f) => ({ ...f, status: 'approved' as const }));
    setClients(clients.map((c) => (c.id === selectedClient.id ? { ...c, flags: updatedFlags } : c)));

    setQueueSuccessMsg(`Bulk approved all ${openCount} open revenue leakage flags for ${selectedClient.name}.`);
    const newEntry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: `${currentUser.name} (Bulk Approver)`,
      action: `Bulk approved all ${openCount} open flags on ${selectedClient.name}. Total: $${selectedClient.flags.reduce((s, f) => s + f.cumulativeImpact, 0).toFixed(2)}.`,
      clientName: selectedClient.name,
      amount: selectedClient.flags.reduce((s, f) => s + f.cumulativeImpact, 0),
      status: 'approved',
      hash: `0x${Math.random().toString(16).slice(2, 14)}`,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
    setTimeout(() => setQueueSuccessMsg(null), 4000);
  };

  // Render Landing Page View
  if (viewMode === 'landing') {
    return (
      <LandingPageView
        onGetStarted={() => setViewMode('signup')}
      />
    );
  }

  // Render Sign-Up / Enterprise Onboarding View
  if (viewMode === 'signup') {
    return (
      <SignUpView
        onSignUpSuccess={(userData) => {
          setCurrentUser(userData);
          setViewMode('dashboard');
        }}
        onBackToLanding={() => setViewMode('landing')}
      />
    );
  }

  // Primary Sidebar Definition for AppLayout
  const sidebarContent = (
    <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', color: 'var(--sidebar-foreground)' }}>
      <div>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 24px 8px', borderBottom: '1px solid var(--sidebar-border)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary, #6366f1)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
            S
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--sidebar-foreground, #1e293b)' }}>Scout Guard</div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)' }}>Autonomous Revenue Guard</div>
          </div>
        </div>

        {/* Global Live Discrepancy Status */}
        <div style={{ margin: '16px 0', padding: 12, borderRadius: 8, background: totalOpenFlags > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)', border: totalOpenFlags > 0 ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: totalOpenFlags > 0 ? 'var(--destructive, #ef4444)' : '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {totalOpenFlags > 0 ? 'Active Leaks Detected' : 'All Accounts Clean'}
            </span>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: totalOpenFlags > 0 ? '#ef4444' : '#10b981' }} className="scout-pulse-dot" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: totalOpenFlags > 0 ? 'var(--destructive, #ef4444)' : '#10b981', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            ${totalPortfolioAtRisk.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
            {totalOpenFlags} open flags across {clients.length} accounts
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground, #6b7280)', padding: '12px 8px 4px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Workspaces
          </div>

          <button
            onClick={() => setActiveTab('portfolio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'portfolio' ? 'var(--sidebar-accent)' : 'transparent',
              color: activeTab === 'portfolio' ? 'var(--primary, #6366f1)' : 'var(--sidebar-foreground)',
              fontWeight: activeTab === 'portfolio' ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Analytics01Icon size={16} />
              <span>Executive Portfolio</span>
            </div>
            {totalOpenFlags > 0 && (
              <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.12)', color: 'var(--destructive, #ef4444)', fontWeight: 700 }}>
                {totalOpenFlags}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('client_dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'client_dashboard' ? 'var(--sidebar-accent)' : 'transparent',
              color: activeTab === 'client_dashboard' ? 'var(--primary, #6366f1)' : 'var(--sidebar-foreground)',
              fontWeight: activeTab === 'client_dashboard' ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Building01Icon size={16} />
            <span>Client Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab('contracts')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'contracts' ? 'var(--sidebar-accent)' : 'transparent',
              color: activeTab === 'contracts' ? 'var(--primary, #6366f1)' : 'var(--sidebar-foreground)',
              fontWeight: activeTab === 'contracts' ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <File01Icon size={16} />
            <span>Contract Parser</span>
          </button>

          <button
            onClick={() => setActiveTab('approval_queue')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'approval_queue' ? 'var(--sidebar-accent)' : 'transparent',
              color: activeTab === 'approval_queue' ? 'var(--primary, #6366f1)' : 'var(--sidebar-foreground)',
              fontWeight: activeTab === 'approval_queue' ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MailSend01Icon size={16} />
              <span>True-Up Approvals</span>
            </div>
            {selectedClient.flags.filter((f) => f.status === 'open').length > 0 && (
              <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 10, background: 'var(--primary, #6366f1)', color: '#ffffff', fontWeight: 600 }}>
                {selectedClient.flags.filter((f) => f.status === 'open').length}
              </span>
            )}
          </button>

          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground, #6b7280)', padding: '16px 8px 4px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Engines & Platform
          </div>

          <button
            onClick={() => setActiveTab('rules_studio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'rules_studio' ? 'var(--sidebar-accent)' : 'transparent',
              color: activeTab === 'rules_studio' ? 'var(--primary, #6366f1)' : 'var(--sidebar-foreground)',
              fontWeight: activeTab === 'rules_studio' ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <CodeIcon size={16} />
            <span>Deterministic Rule Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('audit_log')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'audit_log' ? 'var(--sidebar-accent)' : 'transparent',
              color: activeTab === 'audit_log' ? 'var(--primary, #6366f1)' : 'var(--sidebar-foreground)',
              fontWeight: activeTab === 'audit_log' ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <SecurityCheckIcon size={16} />
            <span>Compliance Audit Log</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'settings' ? 'var(--sidebar-accent)' : 'transparent',
              color: activeTab === 'settings' ? 'var(--primary, #6366f1)' : 'var(--sidebar-foreground)',
              fontWeight: activeTab === 'settings' ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Settings01Icon size={16} />
            <span>System Pipeline Config</span>
          </button>
        </div>
      </div>

      {/* User Session & Client Switcher Footer */}
      <div>
        <div style={{ borderTop: '1px solid var(--sidebar-border)', paddingTop: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginBottom: 6, fontWeight: 600 }}>
            Active Client Target:
          </div>
          <select
            value={selectedClientId}
            onChange={(e) => {
              setSelectedClientId(e.target.value);
              setActiveTab('client_dashboard');
            }}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: 6,
              border: '1px solid var(--border, #d1d5db)',
              background: 'var(--card, #ffffff)',
              color: 'var(--foreground, #1e293b)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.flags.filter((f) => f.status === 'open').length} leaks)
              </option>
            ))}
          </select>
        </div>

        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 6, background: 'var(--muted, #f3f4f6)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary, #6366f1)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12 }}>
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground, #1e293b)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted-foreground, #6b7280)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {currentUser.company}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout sidebar={sidebarContent} showStatus={false}>
      <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'var(--background, #f8fafc)', position: 'relative' }}>
        {/* Main Dashboard Content Area */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: '32px 36px',
            maxWidth: showCopilot ? 1140 : 1320,
            margin: '0 auto',
            fontFamily: 'var(--font-sans)',
            color: 'var(--foreground)',
            transition: 'max-width 0.2s ease',
            overflowX: 'hidden',
          }}
        >
          {/* Clean Contextual Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingBottom: 18, borderBottom: '1px solid var(--border, #d1d5db)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted-foreground, #6b7280)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                <span>Scout Enterprise</span>
                <span>/</span>
                {activeTab === 'client_dashboard' ? (
                  <>
                    <span style={{ cursor: 'pointer', color: 'var(--muted-foreground, #6b7280)' }} onClick={() => setActiveTab('portfolio')}>
                      Portfolio
                    </span>
                    <span>/</span>
                    <span style={{ color: 'var(--primary, #6366f1)' }}>{selectedClient.name}</span>
                  </>
                ) : (
                  <span style={{ color: 'var(--primary, #6366f1)' }}>{activeTab.replace('_', ' ')}</span>
                )}
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--foreground, #1e293b)', margin: '6px 0 0 0' }}>
                {activeTab === 'portfolio' && 'Executive Revenue Leakage Portfolio'}
                {activeTab === 'client_dashboard' && `${selectedClient.name} · Revenue Reconciliation Workspace`}
                {activeTab === 'contracts' && 'AI Contract Parser & Extraction Pipeline'}
                {activeTab === 'approval_queue' && 'Finance True-Up Approval Queue'}
                {activeTab === 'rules_studio' && 'Deterministic Rule Studio & ERP Integrator'}
                {activeTab === 'audit_log' && 'Compliance & Verification Audit Log'}
                {activeTab === 'settings' && 'System & Pipeline Configuration'}
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {isReconciling && (
                <span style={{ fontSize: 12, color: 'var(--primary, #6366f1)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent, #e0e7ff)', padding: '4px 10px', borderRadius: 12 }}>
                  <RefreshIcon size={13} className="scout-pulse-dot" />
                  <span>
                    {reconProgressStage === 'stage1_rules' && 'Stage 1: Scanning Deterministic Discrepancies...'}
                    {reconProgressStage === 'stage2_agent' && 'Stage 2: Synthesizing Agentic CoT...'}
                    {reconProgressStage === 'done' && 'Reconciliation Verified'}
                  </span>
                </span>
              )}

              <button
                onClick={() => setViewMode('landing')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 'var(--radius, 6px)',
                  border: '1px solid var(--border, #d1d5db)',
                  background: 'var(--card, #ffffff)',
                  color: 'var(--foreground, #1e293b)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-2xs)',
                }}
              >
                <ViewIcon size={14} />
                <span>Scout Landing Page</span>
              </button>

              <button
                onClick={() => setShowCopilot(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 'var(--radius, 6px)',
                  border: '1px solid var(--primary, #6366f1)',
                  background: 'var(--accent, #e0e7ff)',
                  color: 'var(--primary, #6366f1)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Brain02Icon size={14} />
                <span>Copilot</span>
              </button>

              {activeTab === 'client_dashboard' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setShowERPWritebackModal(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 14px',
                      borderRadius: 'var(--radius, 6px)',
                      border: '1px solid var(--primary, #6366f1)',
                      background: 'var(--accent, #e0e7ff)',
                      color: 'var(--primary, #6366f1)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <CloudIcon size={14} />
                    <span>Sync to ERP</span>
                  </button>

                  <button
                    onClick={() => triggerAutomatedReconciliation(selectedClient)}
                    disabled={isReconciling}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 14px',
                      borderRadius: 'var(--radius, 6px)',
                      border: 'none',
                      background: 'var(--primary, #6366f1)',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <RefreshIcon size={14} className={isReconciling ? 'scout-pulse-dot' : ''} />
                    <span>{isReconciling ? 'Reconciling...' : 'Run Audit'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('portfolio')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 14px',
                      borderRadius: 'var(--radius, 6px)',
                      border: '1px solid var(--border, #d1d5db)',
                      background: 'var(--card, #ffffff)',
                      color: 'var(--foreground, #1e293b)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-2xs)',
                    }}
                  >
                    <ArrowLeft01Icon size={14} />
                    <span>Back to All Clients</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* VIEW 1: EXECUTIVE REVENUE LEAKAGE PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <PortfolioDashboardView
              clients={clients}
              totalPortfolioAtRisk={totalPortfolioAtRisk}
              totalMonthlyVelocity={totalMonthlyVelocity}
              totalOpenFlags={totalOpenFlags}
              onSelectClient={(id) => {
                setSelectedClientId(id);
                setActiveTab('client_dashboard');
              }}
              onAddClient={() => setShowAddClientModal(true)}
            />
          )}

          {/* VIEW 2: DEDICATED INDIVIDUAL CLIENT DASHBOARD */}
          {activeTab === 'client_dashboard' && (
            <ClientDashboardView
              selectedClient={selectedClient}
              onOpenIngestionModal={(type) => setActiveIngestionModal(type)}
              onLoadAllSamples={handleLoadAllSamplesForClient}
              onOpenInvoiceModal={() => setShowInvoiceModal(true)}
              onOpenDraftNotice={() => setActiveTab('approval_queue')}
              onOpenERPWriteback={() => setShowERPWritebackModal(true)}
            />
          )}

          {/* VIEW 3: AI CONTRACT PARSER */}
          {activeTab === 'contracts' && (
            <ContractParserView
              clients={clients}
              selectedClientId={selectedClientId}
              onSelectClient={(id) => setSelectedClientId(id)}
              onUpdateContract={handleUpdateContractFromParser}
              onOpenUploadModal={(id) => {
                setSelectedClientId(id);
                setActiveIngestionModal('contract');
              }}
            />
          )}

          {/* VIEW 4: FINANCE APPROVAL QUEUE */}
          {activeTab === 'approval_queue' && (
            <ApprovalQueueView
              selectedClient={selectedClient}
              onApproveResolution={handleApproveResolution}
              onMarkException={handleMarkException}
              onBulkApproveAll={handleBulkApproveAll}
              onOpenInvoiceModal={() => setShowInvoiceModal(true)}
            />
          )}

          {/* VIEW 5: RULE STUDIO */}
          {activeTab === 'rules_studio' && (
            <RuleStudioView
              onRunDryTest={() => {
                triggerAutomatedReconciliation(selectedClient);
              }}
            />
          )}

          {/* VIEW 6: COMPLIANCE & AUDIT LOG */}
          {activeTab === 'audit_log' && (
            <AuditLogView
              auditLogs={auditLogs}
              onExportReport={() => setShowAuditExportModal(true)}
            />
          )}

          {/* VIEW 7: ENGINE SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsView
              apiKeyConfigured={apiKeyConfigured}
              geminiKeyInput={geminiKeyInput}
              setGeminiKeyInput={setGeminiKeyInput}
              activeLlmModel={activeLlmModel}
              setActiveLlmModel={setActiveLlmModel}
              isTestingKey={isTestingKey}
              keyTestResult={keyTestResult}
              onSaveApiKey={handleSaveApiKey}
              onTestApiKey={handleTestApiKey}
              onTestWebhooks={() => setShowWebhookModal(true)}
            />
          )}

          {/* Modal: ERP Two-Way Writeback */}
          {showERPWritebackModal && (
            <ERPWritebackModal
              clientName={selectedClient.name}
              amount={selectedClient.flags.filter((f) => f.status === 'open').reduce((s, f) => s + f.cumulativeImpact, 0) || 21666.66}
              onClose={() => setShowERPWritebackModal(false)}
              onSuccess={handleERPWritebackSuccess}
            />
          )}

          {/* Modal: Webhook Event Simulator */}
          {showWebhookModal && (
            <WebhookSimulatorModal
              clientName={selectedClient.name}
              onClose={() => setShowWebhookModal(false)}
              onDispatch={handleDispatchWebhook}
            />
          )}

          {/* Modal: Cryptographic Audit Package Exporter */}
          {showAuditExportModal && (
            <AuditPackageExporter
              clientName={selectedClient.name}
              contractValue={selectedClient.parsedTerms?.annualFee || selectedClient.annualContractValue}
              totalAtRisk={selectedClient.flags.filter((f) => f.status === 'open').reduce((s, f) => s + f.cumulativeImpact, 0)}
              openFlagsCount={selectedClient.flags.filter((f) => f.status === 'open').length}
              auditHash="0x7f8a9b2c3d4e"
              onClose={() => setShowAuditExportModal(false)}
            />
          )}

          {/* Modal: True-Up Invoice Generator */}
          {showInvoiceModal && (
            <TrueUpInvoiceModal
              clientName={selectedClient.name}
              contactName={selectedClient.contactName}
              contactEmail={selectedClient.contactEmail}
              currency={selectedClient.currency}
              items={defaultYojitInvoiceItems}
              onClose={() => setShowInvoiceModal(false)}
            />
          )}

          {/* Modal: Multi-Source Data Ingestion Modal */}
          {activeIngestionModal && (
            <DataIngestionModal
              sourceType={activeIngestionModal}
              clientName={selectedClient.name}
              onClose={() => setActiveIngestionModal(null)}
              onSuccess={handleIngestSuccess}
            />
          )}

          {/* Modal: Add New Client */}
          {showAddClientModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  width: 520,
                  background: 'var(--card, #ffffff)',
                  border: '1px solid var(--border, #d1d5db)',
                  borderRadius: 'var(--radius, 12px)',
                  padding: 28,
                  boxShadow: 'var(--shadow-2xl)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h2 style={{ margin: 0, fontSize: 18, color: 'var(--foreground, #1e293b)' }}>
                    Add Enterprise Client Account
                  </h2>
                  <button
                    onClick={() => setShowAddClientModal(false)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--muted-foreground, #6b7280)', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateClient} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginBottom: 6 }}>
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zenith Global Labs"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid var(--border, #d1d5db)',
                        background: 'var(--muted, #f3f4f6)',
                        color: 'var(--foreground, #1e293b)',
                        fontSize: 13,
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginBottom: 6 }}>
                        Contact Person
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rachel Adams"
                        value={newContactName}
                        onChange={(e) => setNewContactName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid var(--border, #d1d5db)',
                          background: 'var(--muted, #f3f4f6)',
                          color: 'var(--foreground, #1e293b)',
                          fontSize: 13,
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginBottom: 6 }}>
                        Billing Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="billing@zenith.com"
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid var(--border, #d1d5db)',
                          background: 'var(--muted, #f3f4f6)',
                          color: 'var(--foreground, #1e293b)',
                          fontSize: 13,
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginBottom: 6 }}>
                        Connected Billing System
                      </label>
                      <select
                        value={newBillingSystem}
                        onChange={(e) => setNewBillingSystem(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid var(--border, #d1d5db)',
                          background: 'var(--muted, #f3f4f6)',
                          color: 'var(--foreground, #1e293b)',
                          fontSize: 13,
                        }}
                      >
                        <option value="Stripe Billing API">Stripe Billing API</option>
                        <option value="NetSuite SuiteBilling">NetSuite SuiteBilling</option>
                        <option value="Salesforce CPQ">Salesforce CPQ</option>
                        <option value="Chargebee Recurring">Chargebee</option>
                        <option value="Custom ERP Engine">Custom ERP Engine</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginBottom: 6 }}>
                        Contract Currency
                      </label>
                      <select
                        value={newCurrency}
                        onChange={(e) => setNewCurrency(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid var(--border, #d1d5db)',
                          background: 'var(--muted, #f3f4f6)',
                          color: 'var(--foreground, #1e293b)',
                          fontSize: 13,
                        }}
                      >
                        <option value="USD ($)">USD ($)</option>
                        <option value="EUR (€)">EUR (€)</option>
                        <option value="GBP (£)">GBP (£)</option>
                        <option value="AED (AED)">AED (AED)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => setShowAddClientModal(false)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 6,
                        border: '1px solid var(--border, #d1d5db)',
                        background: 'var(--muted, #f3f4f6)',
                        color: 'var(--foreground, #1e293b)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '8px 20px',
                        borderRadius: 6,
                        border: 'none',
                        background: 'var(--primary, #6366f1)',
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Drawer: AI RevOps Conversational Copilot */}
        {showCopilot && (
          <div
            style={{
              width: 380,
              minWidth: 380,
              maxWidth: 380,
              flexShrink: 0,
              borderLeft: '1px solid var(--border, #e2e8f0)',
              background: 'var(--card, #ffffff)',
              height: '100vh',
              position: 'sticky',
              top: 0,
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.04)',
            }}
          >
            <RevOpsCopilotDrawer
              clientName={selectedClient.name}
              annualContractValue={selectedClient.annualContractValue}
              totalAtRisk={totalPortfolioAtRisk}
              openFlagsCount={selectedClient.flags.filter((f) => f.status === 'open').length}
              flags={selectedClient.flags}
              contractRaw={selectedClient.contractRaw}
              billingData={selectedClient.billingData}
              usageData={selectedClient.usageData}
              onClose={() => setShowCopilot(false)}
              onViewInvoice={() => setShowInvoiceModal(true)}
              onDraftNotice={() => setActiveTab('approval_queue')}
              onERPSync={() => setShowERPWritebackModal(true)}
              onOpenSettings={() => setActiveTab('settings')}
            />
          </div>
        )}
      </div>
      <Agentation />
    </AppLayout>
  );
};

export default App;
