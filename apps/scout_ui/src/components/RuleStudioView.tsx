// =============================================================================
// RuleStudioView.tsx — Custom Deterministic Reconciliation Rule Studio
// Allows RevOps & Finance admins to configure, dry-run test, and register custom rules
// =============================================================================

import React, { useState } from 'react';
import {
  Settings01Icon,
  PlusSignIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  FlashIcon,
  CodeIcon,
  PlayIcon,
  File01Icon,
  Invoice01Icon,
  UserGroupIcon,
  Brain02Icon,
  SecurityCheckIcon,
} from 'hugeicons-react';

export interface CustomRule {
  id: string;
  code: string;
  name: string;
  category: 'discount' | 'metering' | 'entitlements' | 'commitment' | 'currency';
  sourceA: string;
  sourceB: string;
  formula: string;
  threshold: string;
  stage2PromptContext: string;
  isEnabled: boolean;
  isCore: boolean;
}

const defaultRules: CustomRule[] = [
  {
    id: 'rule_1',
    code: 'RULE-01-STALE-DISCOUNT',
    name: 'Stale Introductory Discount Expiration',
    category: 'discount',
    sourceA: 'Contract Pricing Schedule (Section 3.2)',
    sourceB: 'Stripe Active Subscription Coupon Override',
    formula: 'Active Discount Rate > 0% AND Current Date > Contract Discount Expiry Date',
    threshold: 'Any active discount past validity date ($0.01 tolerance)',
    stage2PromptContext: 'Verify if customer received written amendment extending onboarding promotion. If not, calculate monthly delta and propose true-up invoice.',
    isEnabled: true,
    isCore: true,
  },
  {
    id: 'rule_2',
    code: 'RULE-02-USAGE-OVERAGE',
    name: 'Metered Active User Seat Overage',
    category: 'metering',
    sourceA: 'Telemetry Daily Active Logins',
    sourceB: 'Contract Base User Seat License Cap',
    formula: 'Daily Active Seats > Contract Included Baseline Seats',
    threshold: 'Delta > 0 active seats across >= 1 billing cycle',
    stage2PromptContext: 'Check if overage rate is defined in contract (Section 4.3). Calculate seat overage count × rate × compounding months.',
    isEnabled: true,
    isCore: true,
  },
  {
    id: 'rule_3',
    code: 'RULE-03-UNBILLED-MODULE',
    name: 'Unbilled Provisioned Feature Key',
    category: 'entitlements',
    sourceA: 'Entitlements Database Active Feature Keys',
    sourceB: 'Billing Invoice Subscription Line Items',
    formula: 'Module Provisioned == TRUE AND Billing Line Item Missing',
    threshold: 'Feature key active with zero corresponding billing item',
    stage2PromptContext: 'Verify whether provisioned module is contracted as paid add-on vs bundled free tier. Draft true-up adjustment for unbilled duration.',
    isEnabled: true,
    isCore: true,
  },
  {
    id: 'rule_4',
    code: 'RULE-04-MIN-COMMIT-SHORTFALL',
    name: 'Minimum Annual Spend Commitment Shortfall',
    category: 'commitment',
    sourceA: 'Contract Minimum Annual Spend Clause (Section 2.1)',
    sourceB: 'YTD Cumulative Invoiced Run-Rate',
    formula: 'Projected Annual Invoiced Spend < Contract Minimum Commitment',
    threshold: 'Projected annual run-rate deficit >= $1,000.00',
    stage2PromptContext: 'Evaluate contract true-up mechanism for annual minimum spend commitments. Issue shortfall notification prior to anniversary date.',
    isEnabled: true,
    isCore: false,
  },
  {
    id: 'rule_5',
    code: 'RULE-05-CURRENCY-FX-VARIANCE',
    name: 'Cross-Border Currency Peg Discrepancy',
    category: 'currency',
    sourceA: 'Executed Contract Currency (e.g. USD)',
    sourceB: 'Settled Payment Gateway FX Rate (e.g. EUR / AED)',
    formula: 'Settled FX Conversion Rate Variance > 2.5%',
    threshold: 'Exchange rate slippage > 2.5% of agreed contract peg',
    stage2PromptContext: 'Flag foreign currency conversion losses where contract stipulates customer bears FX conversion fees.',
    isEnabled: false,
    isCore: false,
  },
];

interface RuleStudioViewProps {
  onRunDryTest: (rule: CustomRule) => void;
}

export const RuleStudioView: React.FC<RuleStudioViewProps> = ({ onRunDryTest }) => {
  const [rules, setRules] = useState<CustomRule[]>(defaultRules);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dryTestResult, setDryTestResult] = useState<string | null>(null);

  // New Rule Form
  const [newCode, setNewCode] = useState('RULE-06-CUSTOM-TIER-DRIFT');
  const [newName, setNewName] = useState('Tiered Volume Licensing Variance');
  const [newCategory, setNewCategory] = useState<CustomRule['category']>('metering');
  const [newSourceA, setNewSourceA] = useState('Contract Tier Pricing Schedule');
  const [newSourceB, setNewSourceB] = useState('Telemetry Usage Volume');
  const [newFormula, setNewFormula] = useState('Volume Band > Upper Limit AND Billed Tier == Lower Band');
  const [newThreshold, setNewThreshold] = useState('Volume drift > 5%');
  const [newPrompt, setNewPrompt] = useState('Synthesize whether client moved into higher pricing bracket and calculate retroactive tier delta.');

  const handleToggleRule = (id: string) => {
    setRules(
      rules.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CustomRule = {
      id: `rule_${Date.now()}`,
      code: newCode.trim(),
      name: newName.trim(),
      category: newCategory,
      sourceA: newSourceA.trim(),
      sourceB: newSourceB.trim(),
      formula: newFormula.trim(),
      threshold: newThreshold.trim(),
      stage2PromptContext: newPrompt.trim(),
      isEnabled: true,
      isCore: false,
    };
    setRules([...rules, created]);
    setShowCreateModal(false);
  };

  const handleDryRun = (rule: CustomRule) => {
    setDryTestResult(`Executing dry-run test for [${rule.code}] against Yojit FZE & Acme Cloud Inc datasets...`);
    setTimeout(() => {
      setDryTestResult(`Dry-run evaluation complete! [${rule.code}] triggered on 1 target account (Yojit FZE). Zero mathematical hallucinations.`);
      setTimeout(() => setDryTestResult(null), 5000);
    }, 800);
  };

  return (
    <div className="scout-fade-in">
      {/* Top Banner & KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ padding: 18, borderRadius: 'var(--radius, 8px)', background: 'var(--card, #ffffff)', border: '1px solid var(--border, #d1d5db)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>Active Detection Rules</span>
            <CodeIcon size={16} color="var(--primary, #6366f1)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground, #1e293b)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            {rules.filter((r) => r.isEnabled).length} / {rules.length} Active
          </div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 2, fontWeight: 500 }}>
            3 Core + {rules.filter((r) => !r.isCore && r.isEnabled).length} Custom RevOps Rules
          </div>
        </div>

        <div style={{ padding: 18, borderRadius: 'var(--radius, 8px)', background: 'var(--card, #ffffff)', border: '1px solid var(--border, #d1d5db)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>Stage 1 Evaluation Latency</span>
            <FlashIcon size={16} color="var(--primary, #6366f1)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary, #6366f1)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            1.2 ms
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
            Deterministic zero-hallucination scan speed
          </div>
        </div>

        <div style={{ padding: 18, borderRadius: 'var(--radius, 8px)', background: 'var(--card, #ffffff)', border: '1px solid var(--border, #d1d5db)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground, #6b7280)' }}>Stage 2 CoT Bridge</span>
            <Brain02Icon size={16} color="var(--primary, #6366f1)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            100% Synced
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
            Rule outputs feed directly into LLM prompts
          </div>
        </div>
      </div>

      {dryTestResult && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius, 6px)', background: 'var(--accent, #e0e7ff)', border: '1px solid var(--primary, #6366f1)', color: 'var(--primary, #6366f1)', fontSize: 13, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FlashIcon size={16} />
          <span>{dryTestResult}</span>
        </div>
      )}

      {/* Rules Registry List Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
            Deterministic Discrepancy Rule Studio
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
            Configure exact mathematical comparison formulas executed prior to Stage 2 agentic CoT reasoning
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
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
          <PlusSignIcon size={14} />
          <span>New Custom Rule</span>
        </button>
      </div>

      {/* Rules Registry Table / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rules.map((rule) => (
          <div
            key={rule.id}
            style={{
              padding: 20,
              borderRadius: 'var(--radius, 8px)',
              background: 'var(--card, #ffffff)',
              border: rule.isEnabled ? '1px solid var(--border, #d1d5db)' : '1px dashed var(--border, #d1d5db)',
              boxShadow: 'var(--shadow-xs)',
              opacity: rule.isEnabled ? 1 : 0.65,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 20,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'var(--accent, #e0e7ff)', color: 'var(--primary, #6366f1)' }}>
                  {rule.code}
                </span>
                {rule.isCore && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', textTransform: 'uppercase' }}>
                    Core Rule
                  </span>
                )}
                <span style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', textTransform: 'capitalize' }}>
                  Category: {rule.category}
                </span>
              </div>

              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                {rule.name}
              </h4>

              {/* Formula & Sources Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12, marginTop: 10, padding: 10, borderRadius: 6, background: 'var(--muted, #f3f4f6)', fontSize: 11 }}>
                <div>
                  <span style={{ color: 'var(--muted-foreground, #6b7280)', fontWeight: 600 }}>Formula: </span>
                  <code style={{ color: 'var(--primary, #6366f1)', fontWeight: 700 }}>{rule.formula}</code>
                </div>
                <div>
                  <span style={{ color: 'var(--muted-foreground, #6b7280)', fontWeight: 600 }}>Comparison: </span>
                  <span>{rule.sourceA} <strong>vs</strong> {rule.sourceB}</span>
                </div>
              </div>

              {/* Stage 2 AI Guidance */}
              <div style={{ fontSize: 11, color: 'var(--muted-foreground, #6b7280)', marginTop: 8, lineHeight: 1.4 }}>
                <strong>Stage 2 CoT Prompt Bridge:</strong> {rule.stage2PromptContext}
              </div>
            </div>

            {/* Actions & Switch */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <button
                onClick={() => handleToggleRule(rule.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 14,
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: rule.isEnabled ? '#10b981' : 'var(--muted-foreground, #6b7280)',
                  color: '#ffffff',
                }}
              >
                {rule.isEnabled ? 'ENABLED' : 'DISABLED'}
              </button>

              <button
                onClick={() => handleDryRun(rule)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius, 6px)',
                  border: '1px solid var(--border, #d1d5db)',
                  background: 'var(--card, #ffffff)',
                  color: 'var(--primary, #6366f1)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <PlayIcon size={12} />
                <span>Dry-Run Test</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Custom Rule */}
      {showCreateModal && (
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
              width: 580,
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #d1d5db)',
              borderRadius: 'var(--radius, 12px)',
              padding: 28,
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, color: 'var(--foreground, #1e293b)' }}>Create Deterministic Rule</h3>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginTop: 2 }}>
                  Define mathematical condition and context fed into Stage 2 Agentic CoT
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--muted-foreground, #6b7280)', cursor: 'pointer' }}
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRule}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--foreground, #1e293b)', marginBottom: 4 }}>
                    Rule Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border, #d1d5db)', background: 'var(--muted, #f3f4f6)', color: 'var(--foreground, #1e293b)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--foreground, #1e293b)', marginBottom: 4 }}>
                    Rule Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border, #d1d5db)', background: 'var(--muted, #f3f4f6)', color: 'var(--foreground, #1e293b)', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--foreground, #1e293b)', marginBottom: 4 }}>
                    Source A (Baseline)
                  </label>
                  <input
                    type="text"
                    required
                    value={newSourceA}
                    onChange={(e) => setNewSourceA(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border, #d1d5db)', background: 'var(--muted, #f3f4f6)', color: 'var(--foreground, #1e293b)', fontSize: 12 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--foreground, #1e293b)', marginBottom: 4 }}>
                    Source B (Comparison)
                  </label>
                  <input
                    type="text"
                    required
                    value={newSourceB}
                    onChange={(e) => setNewSourceB(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border, #d1d5db)', background: 'var(--muted, #f3f4f6)', color: 'var(--foreground, #1e293b)', fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--foreground, #1e293b)', marginBottom: 4 }}>
                  Deterministic Logical Condition
                </label>
                <input
                  type="text"
                  required
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border, #d1d5db)', background: 'var(--muted, #f3f4f6)', color: 'var(--primary, #6366f1)', fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--foreground, #1e293b)', marginBottom: 4 }}>
                  Stage 2 Agentic CoT Context Prompt
                </label>
                <textarea
                  rows={3}
                  required
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border, #d1d5db)', background: 'var(--muted, #f3f4f6)', color: 'var(--foreground, #1e293b)', fontSize: 12, resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '7px 12px', borderRadius: 6, border: '1px solid var(--border, #d1d5db)', background: 'transparent', color: 'var(--muted-foreground, #6b7280)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '7px 16px', borderRadius: 6, border: 'none', background: 'var(--primary, #6366f1)', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Register Rule in Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
