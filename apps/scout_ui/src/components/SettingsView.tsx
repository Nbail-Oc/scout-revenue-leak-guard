// =============================================================================
// SettingsView.tsx — Scout Hybrid Pipeline Configuration
// Dual-stage architecture controls, Live LLM API Keys, and webhook triggers.
// =============================================================================

import React, { useState } from 'react';
import { FlashIcon } from 'hugeicons-react';
import { emailDispatchService } from '../services/emailDispatchService';

interface SettingsViewProps {
  apiKeyConfigured: boolean;
  geminiKeyInput: string;
  setGeminiKeyInput: (val: string) => void;
  activeLlmModel: string;
  setActiveLlmModel: (val: string) => void;
  isTestingKey: boolean;
  keyTestResult: { success: boolean; message: string } | null;
  onSaveApiKey: () => void;
  onTestApiKey: () => void;
  onTestWebhooks: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  apiKeyConfigured,
  geminiKeyInput,
  setGeminiKeyInput,
  activeLlmModel,
  setActiveLlmModel,
  isTestingKey,
  keyTestResult,
  onSaveApiKey,
  onTestApiKey,
  onTestWebhooks,
}) => {
  const [n8nUrlInput, setN8nUrlInput] = useState<string>(() => emailDispatchService.getWebhookUrl());
  const [isTestingN8n, setIsTestingN8n] = useState<boolean>(false);
  const [n8nTestResult, setN8nTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveN8nUrl = () => {
    emailDispatchService.setWebhookUrl(n8nUrlInput);
    setN8nTestResult({ success: true, message: 'n8n Webhook URL saved successfully.' });
    setTimeout(() => setN8nTestResult(null), 4000);
  };

  const handleTestN8n = async () => {
    setIsTestingN8n(true);
    setN8nTestResult(null);
    try {
      const res = await emailDispatchService.testConnection(n8nUrlInput);
      setN8nTestResult(res);
    } finally {
      setIsTestingN8n(false);
    }
  };
  return (
    <div className="scout-fade-in" style={{ maxWidth: 760 }}>
      <div
        style={{
          padding: 24,
          borderRadius: 'var(--radius, 8px)',
          background: 'var(--card, #ffffff)',
          border: '1px solid var(--border, #d1d5db)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: 18, color: 'var(--foreground, #1e293b)' }}>
              Scout Hybrid Pipeline Configuration
            </h2>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)' }}>
              Manage the dual-stage reconciliation pipeline, deterministic formula engines, and LLM reasoning models.
            </div>
          </div>

          <button
            onClick={onTestWebhooks}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              borderRadius: 6,
              border: '1px solid var(--primary, #6366f1)',
              background: 'var(--accent, #e0e7ff)',
              color: 'var(--primary, #6366f1)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <FlashIcon size={14} />
            <span>Test Webhooks</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              padding: 14,
              borderRadius: 6,
              background: 'var(--accent, #e0e7ff)',
              border: '1px solid var(--primary, #6366f1)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary, #6366f1)', marginBottom: 4 }}>
              Dual-Stage Hybrid Architecture Active
            </div>
            <div style={{ fontSize: 12, color: 'var(--foreground, #1e293b)', lineHeight: 1.5 }}>
              Stage 1 (Deterministic Formula Engine) scans all 4 data sources and computes exact mathematical variances. The Stage 1 output is then passed directly as authoritative ground-truth context to Stage 2 (Agentic CoT AI Reasoner) for legal nuance synthesis, root cause diagnosis, and resolution generation.
            </div>
          </div>

          {/* Live Google Gemini API Configuration */}
          <div
            style={{
              padding: 16,
              borderRadius: 6,
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #d1d5db)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                Google Gemini API Key (Live LLM Mode)
              </div>
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: apiKeyConfigured ? 'rgba(16, 185, 129, 0.12)' : 'var(--muted, #f3f4f6)',
                  color: apiKeyConfigured ? '#10b981' : 'var(--muted-foreground, #6b7280)',
                  fontWeight: 600,
                }}
              >
                {apiKeyConfigured ? 'Live Mode Active' : 'Fallback Context Mode'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginBottom: 10 }}>
              Enter your Gemini API key to enable live generative AI responses, dynamic contract clause parsing, and custom RevOps queries.
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="password"
                placeholder="AIzaSy... (Gemini API Key)"
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border, #d1d5db)',
                  background: 'var(--muted, #f3f4f6)',
                  color: 'var(--foreground, #1e293b)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                }}
              />
              <button
                type="button"
                onClick={onSaveApiKey}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'var(--primary, #6366f1)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save Key
              </button>
              <button
                type="button"
                onClick={onTestApiKey}
                disabled={isTestingKey}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: '1px solid var(--border, #d1d5db)',
                  background: 'var(--card, #ffffff)',
                  color: 'var(--foreground, #1e293b)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isTestingKey ? 'Pinging...' : 'Test Connection'}
              </button>
            </div>

            {keyTestResult && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: keyTestResult.success ? '#10b981' : 'var(--destructive, #ef4444)',
                }}
              >
                {keyTestResult.message}
              </div>
            )}
          </div>

          {/* n8n Email Webhook Dispatcher Configuration */}
          <div
            style={{
              padding: 16,
              borderRadius: 6,
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #d1d5db)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground, #1e293b)' }}>
                n8n Email Webhook Endpoint (Finance True-Up Dispatcher)
              </div>
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: 'var(--primary, #6366f1)',
                  fontWeight: 600,
                }}
              >
                Webhook & Gmail Node
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground, #6b7280)', marginBottom: 10 }}>
              URL of the n8n webhook node listening for true-up notices. Dispatches emails with Base64 itemized invoice receipts via your configured Gmail credential.
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="https://n8n-render-tpfk.onrender.com/webhook/send-email-api"
                value={n8nUrlInput}
                onChange={(e) => setN8nUrlInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border, #d1d5db)',
                  background: 'var(--muted, #f3f4f6)',
                  color: 'var(--foreground, #1e293b)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                }}
              />
              <button
                type="button"
                onClick={handleSaveN8nUrl}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'var(--primary, #6366f1)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save URL
              </button>
              <button
                type="button"
                onClick={handleTestN8n}
                disabled={isTestingN8n}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: '1px solid var(--border, #d1d5db)',
                  background: 'var(--card, #ffffff)',
                  color: 'var(--foreground, #1e293b)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isTestingN8n ? 'Testing...' : 'Test Ping'}
              </button>
            </div>

            {n8nTestResult && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: n8nTestResult.success ? '#10b981' : 'var(--destructive, #ef4444)',
                }}
              >
                {n8nTestResult.message}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginBottom: 6 }}>
              Active RocketRide Pipeline
            </label>
            <input
              type="text"
              readOnly
              value="reconciliation_agent.pipe"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid var(--border, #d1d5db)',
                background: 'var(--muted, #f3f4f6)',
                color: 'var(--muted-foreground, #6b7280)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginBottom: 6 }}>
              Stage 2 LLM Reasoning Model
            </label>
            <select
              value={activeLlmModel}
              onChange={(e) => setActiveLlmModel(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid var(--border, #d1d5db)',
                background: 'var(--muted, #f3f4f6)',
                color: 'var(--foreground, #1e293b)',
                fontFamily: 'inherit',
              }}
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-Fast 1.2ms Reasoning Trace)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Contractual Legal Deliberation)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--foreground, #1e293b)', marginBottom: 6 }}>
              Automated Ingestion Cadence
            </label>
            <select
              defaultValue="realtime"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid var(--border, #d1d5db)',
                background: 'var(--muted, #f3f4f6)',
                color: 'var(--foreground, #1e293b)',
                fontFamily: 'inherit',
              }}
            >
              <option value="realtime">Continuous Automated Webhook / Ingestion (Recommended)</option>
              <option value="nightly">Nightly Batch Audit (Every day at 00:00 UTC)</option>
              <option value="manual">Manual Trigger Only</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
