// =============================================================================
// SignUpView.tsx — Scout User Sign Up / Onboarding View
// Signs up user with any credentials and transitions directly to Scout Dashboard
// =============================================================================

import React, { useState } from 'react';
import { ArrowRight01Icon, ArrowLeft01Icon } from 'hugeicons-react';

interface SignUpViewProps {
  onSignUpSuccess: (userData: { name: string; email: string; company: string }) => void;
  onBackToLanding: () => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({ onSignUpSuccess, onBackToLanding }) => {
  const [email, setEmail] = useState('nabil.thange@scoutguard.io');
  const [name, setName] = useState('Nabil Thange');
  const [company, setCompany] = useState('Apex Global Enterprises');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onSignUpSuccess({
        name: name.trim() || 'Nabil Thange',
        email: email.trim() || 'nabil.thange@scoutguard.io',
        company: company.trim() || 'Apex Global Enterprises',
      });
      setIsLoading(false);
    }, 350);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          width: 440,
          maxWidth: '100%',
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
          padding: '36px 32px',
        }}
      >
        {/* Back link */}
        <button
          onClick={onBackToLanding}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            padding: 0,
            marginBottom: 24,
          }}
        >
          <ArrowLeft01Icon size={14} />
          <span>Back to Scout Landing</span>
        </button>

        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            S
          </div>
          <span style={{ fontSize: 18, fontWeight: 783, letterSpacing: '-0.02em', color: '#0f172a' }}>
            Scout Revenue Guard
          </span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a', margin: '0 0 6px 0' }}>
          Create your account
        </h1>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px 0', lineHeight: 1.5 }}>
          Enter your details to access real-time AI revenue reconciliation and leak prevention.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 5 }}>
              Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nabil.thange@scoutguard.io"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                background: '#ffffff',
                color: '#0f172a',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 5 }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nabil Thange"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                background: '#ffffff',
                color: '#0f172a',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 5 }}>
              Company Legal Entity
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Apex Global Enterprises"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                background: '#ffffff',
                color: '#0f172a',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 5 }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                background: '#ffffff',
                color: '#0f172a',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: 8,
              width: '100%',
              padding: '12px 16px',
              borderRadius: 8,
              border: 'none',
              background: '#6366f1',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
            }}
          >
            <span>{isLoading ? 'Creating Account...' : 'Sign Up & Open Scout Dashboard'}</span>
            <ArrowRight01Icon size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
