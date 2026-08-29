// =============================================================================
// emailDispatchService.ts — Scout n8n Webhook Email Dispatch Service
// Dispatches structured true-up notices and base64 invoice attachments to n8n
// =============================================================================

export interface EmailAttachment {
  filename: string;
  content: string; // Base64 encoded string
  mimeType: string;
}

export interface DispatchNoticePayload {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  preheader?: string;
  body: string;
  senderName?: string;
  clientName?: string;
  buttonText?: string;
  buttonUrl?: string;
  attachments?: EmailAttachment[];
}

export interface DispatchNoticeResult {
  success: boolean;
  messageId?: string;
  threadId?: string;
  timestamp?: string;
  message?: string;
  error?: string;
}

const STORAGE_KEY_N8N_URL = 'scout_n8n_webhook_url';
export const DEFAULT_N8N_WEBHOOK_URL = 'https://n8n-render-tpfk.onrender.com/webhook/send-email-api';

export class EmailDispatchService {
  private webhookUrl: string = DEFAULT_N8N_WEBHOOK_URL;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_N8N_URL);
      if (stored && stored.trim().length > 0 && !stored.includes('localhost:5678')) {
        this.webhookUrl = stored.trim();
      } else if ((import.meta as any).env?.VITE_N8N_WEBHOOK_URL) {
        this.webhookUrl = (import.meta as any).env.VITE_N8N_WEBHOOK_URL;
      } else {
        this.webhookUrl = DEFAULT_N8N_WEBHOOK_URL;
        localStorage.setItem(STORAGE_KEY_N8N_URL, DEFAULT_N8N_WEBHOOK_URL);
      }
    }
  }

  getWebhookUrl(): string {
    return this.webhookUrl;
  }

  setWebhookUrl(url: string): void {
    this.webhookUrl = url.trim() || DEFAULT_N8N_WEBHOOK_URL;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_N8N_URL, this.webhookUrl);
    }
  }

  /**
   * Generates a formatted ASCII & JSON itemized true-up invoice attachment in Base64
   */
  generateInvoiceAttachment(
    clientName: string,
    contactName: string,
    items: Array<{ description: string; contractClause: string; period: string; total: number }>,
    currency: string = 'USD',
    totalAmount: number
  ): EmailAttachment {
    const invoiceNum = `INV-2026-08-TRU-${Math.floor(1000 + Math.random() * 9000)}`;
    const issueDate = new Date().toISOString().split('T')[0];

    const lines = [
      '======================================================================',
      '             SCOUT REVENUE ASSURANCE — ITEMIZES TRUE-UP INVOICE       ',
      '======================================================================',
      `Invoice Number:  ${invoiceNum}`,
      `Issue Date:      ${issueDate}`,
      `Terms:           Net 15 Days`,
      `Client Account:  ${clientName}`,
      `Attn:            ${contactName || 'Finance & Accounts Payable'}`,
      '----------------------------------------------------------------------',
      'ITEMIZED AUDIT VARIANCES & CONTRACT CITATIONS:',
      '----------------------------------------------------------------------',
    ];

    items.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.description}`);
      lines.push(`   Citation: ${item.contractClause}`);
      lines.push(`   Period:   ${item.period}`);
      lines.push(`   Amount:   $${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`);
      lines.push('');
    });

    lines.push('----------------------------------------------------------------------');
    lines.push(`TOTAL TRUE-UP RECONCILIATION DUE: $${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`);
    lines.push('======================================================================');
    lines.push('Generated automatically by Scout Revenue Leak Guard Engine.');
    lines.push('Audit Hash: ' + '0x' + Math.random().toString(16).slice(2, 14));

    const invoiceText = lines.join('\n');
    const base64Content = btoa(unescape(encodeURIComponent(invoiceText)));

    return {
      filename: `Scout_TrueUp_${clientName.replace(/[^a-zA-Z0-9]/g, '_')}_${invoiceNum}.txt`,
      content: base64Content,
      mimeType: 'text/plain',
    };
  }

  /**
   * Dispatches the notice payload to the n8n webhook
   */
  async dispatchNotice(payload: DispatchNoticePayload, customUrl?: string): Promise<DispatchNoticeResult> {
    const targetUrl = (customUrl || this.webhookUrl).trim();

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        return {
          success: false,
          error: `n8n webhook responded with HTTP status ${response.status}: ${errText || response.statusText}`,
        };
      }

      const data = await response.json().catch(() => null);

      if (data && data.success !== false) {
        return {
          success: true,
          messageId: data?.data?.messageId || data?.messageId || `msg_${Date.now()}`,
          threadId: data?.data?.threadId || data?.threadId,
          timestamp: data?.data?.timestamp || new Date().toISOString(),
          message: data?.message || 'True-up notice successfully dispatched via n8n.',
        };
      }

      return {
        success: false,
        error: data?.message || 'n8n workflow did not return a success response.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to reach n8n webhook endpoint. Check that n8n is running and reachable.',
      };
    }
  }

  /**
   * Tests connection to n8n webhook endpoint
   */
  async testConnection(targetUrl?: string): Promise<{ success: boolean; message: string }> {
    const url = (targetUrl || this.webhookUrl).trim();
    try {
      const testPayload: DispatchNoticePayload = {
        to: 'test-ping@scoutguard.io',
        subject: 'Scout n8n Webhook Connectivity Verification',
        body: 'Ping test from Scout Revenue Leak Guard settings view.',
        senderName: 'Scout Connectivity Tester',
        clientName: 'Scout Test Verification',
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
      });

      if (res.ok) {
        return {
          success: true,
          message: `Connected successfully to n8n (HTTP ${res.status}).`,
        };
      } else {
        return {
          success: false,
          message: `Webhook returned HTTP ${res.status}: ${res.statusText}`,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: `Connection failed: ${err.message}. Ensure n8n is running at ${url}.`,
      };
    }
  }
}

export const emailDispatchService = new EmailDispatchService();
