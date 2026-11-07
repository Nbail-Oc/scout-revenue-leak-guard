// =============================================================================
// LandingPageView.tsx — Scout Revenue Leak Guard · Nexum-Style Cinematic Hero
// Pure inline styles. No Tailwind required.
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

interface LandingPageViewProps {
  onGetStarted: () => void;
  onLogin?: () => void;
}

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4';

const AVATAR_URL = 'https://i.pravatar.cc/72?img=57';
const NAV_LINKS = ['Contracts', 'Clients', 'Reconcile', 'Pricing'] as const;
const GEIST = "'Geist', -apple-system, BlinkMacSystemFont, sans-serif";
const SILKSCREEN = "'Silkscreen', cursive";
const CTA_BG = 'linear-gradient(to bottom, #2B2B2B, #101010)';

// ---------------------------------------------------------------------------
// Logo SVG — exact 4-quadrant circle from spec
// ---------------------------------------------------------------------------
function ScoutLogo({ color }: { color: string }) {
  return (
    <svg width={24} height={24} viewBox="0 0 256 256" fill={color} aria-hidden>
      <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
    </svg>
  );
}

// Responsive breakpoint hook
function useMq(query: string) {
  const [match, setMatch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const h = (e: MediaQueryListEvent) => setMatch(e.matches);
    mq.addEventListener('change', h);
    setMatch(mq.matches);
    return () => mq.removeEventListener('change', h);
  }, [query]);
  return match;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export const LandingPageView: React.FC<LandingPageViewProps> = ({ onGetStarted }) => {
  const isLg = useMq('(min-width: 1024px)');
  const isMd = useMq('(min-width: 768px)');

  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [hovLink, setHovLink] = useState<string | null>(null);
  const [hovNavCta, setHovNavCta] = useState(false);
  const [hovEmailCta, setHovEmailCta] = useState(false);
  const [hovMobileCta, setHovMobileCta] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  // Responsive foreground colours
  const fg    = isLg ? '#ffffff' : '#010101';
  const fg70  = isLg ? 'rgba(255,255,255,0.7)' : 'rgba(1,1,1,0.7)';
  const fg80  = isLg ? 'rgba(255,255,255,0.8)' : 'rgba(1,1,1,0.8)';
  const fg60  = isLg ? 'rgba(255,255,255,0.6)' : 'rgba(1,1,1,0.6)';

  // Body scroll lock while drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Shared glass card style
  const glass: React.CSSProperties = {
    borderRadius: 16,
    background: 'rgba(255,255,255,0.10)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    padding: isMd ? 24 : 20,
    width: isMd ? 256 : '100%',
    boxSizing: 'border-box',
  };

  // CTA button base style
  const ctaStyle = (hov: boolean): React.CSSProperties => ({
    borderRadius: 9999,
    fontSize: 14,
    fontWeight: 500,
    color: '#ffffff',
    background: CTA_BG,
    border: 'none',
    cursor: 'pointer',
    opacity: hov ? 0.9 : 1,
    transition: 'opacity 150ms ease',
    fontFamily: GEIST,
  });

  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      fontFamily: GEIST,
      WebkitFontSmoothing: 'antialiased',
    } as React.CSSProperties}>

      {/* ------------------------------------------------------------------ */}
      {/* Background Video                                                    */}
      {/* ------------------------------------------------------------------ */}
      <video
        src={VIDEO_URL}
        autoPlay loop muted playsInline
        style={{
          position: 'absolute',
          inset: 0,
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* z-10 flex-column content wrapper                                    */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ================================================================ */}
        {/* NAV                                                               */}
        {/* ================================================================ */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isLg ? '20px 48px' : isMd ? '24px 32px' : '20px 20px',
        }}>
          {/* Logo + wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ScoutLogo color={fg} />
            <span style={{ fontFamily: GEIST, fontSize: 18, fontWeight: 600, color: fg }}>scout</span>
          </div>

          {/* Desktop glass pill nav — md+ */}
          {isMd && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Glass pill cluster */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                borderRadius: 9999,
                background: 'rgba(255,255,255,0.10)',
                padding: '6px 6px',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}>
                {NAV_LINKS.map(link => (
                  <button
                    key={link}
                    type="button"
                    onMouseEnter={() => setHovLink(link)}
                    onMouseLeave={() => setHovLink(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderRadius: 9999,
                      padding: '6px 16px',
                      fontSize: 14,
                      fontWeight: 500,
                      color: hovLink === link ? '#ffffff' : 'rgba(255,255,255,0.8)',
                      background: hovLink === link ? 'rgba(255,255,255,0.10)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'color 150ms ease, background 150ms ease',
                      fontFamily: GEIST,
                    }}
                  >
                    {link}
                    {link === 'Reconcile' && <ChevronDown style={{ width: 14, height: 14 }} />}
                  </button>
                ))}
              </div>

              {/* Separate "Start Free Audit" pill */}
              <button
                type="button"
                onClick={onGetStarted}
                onMouseEnter={() => setHovNavCta(true)}
                onMouseLeave={() => setHovNavCta(false)}
                style={{ ...ctaStyle(hovNavCta), alignSelf: 'stretch', padding: '0 20px' }}
              >
                Start Free Audit
              </button>
            </div>
          )}

          {/* Mobile hamburger — <md */}
          {!isMd && (
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen(v => !v)}
              style={{
                position: 'relative',
                height: 40,
                width: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: 'none',
                cursor: 'pointer',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <Menu style={{
                position: 'absolute',
                width: 20, height: 20,
                color: fg,
                transition: 'transform 300ms ease, opacity 300ms ease',
                transform: menuOpen ? 'rotate(90deg) scale(0)' : 'rotate(0deg) scale(1)',
                opacity: menuOpen ? 0 : 1,
              }} />
              <X style={{
                position: 'absolute',
                width: 20, height: 20,
                color: fg,
                transition: 'transform 300ms ease, opacity 300ms ease',
                transform: menuOpen ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0)',
                opacity: menuOpen ? 1 : 0,
              }} />
            </button>
          )}
        </nav>

        {/* ================================================================ */}
        {/* MOBILE BACKDROP + DRAWER                                          */}
        {/* ================================================================ */}

        {/* Semi-transparent backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: 'rgba(0,0,0,0.80)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? 'auto' : 'none',
            transition: 'opacity 300ms ease',
            display: isMd ? 'none' : 'block',
          }}
        />

        {/* Slide-in drawer panel */}
        <div
          aria-hidden={!menuOpen}
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            zIndex: 40,
            height: '100%',
            width: 288,
            background: 'rgba(0,0,0,0.90)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: isMd ? 'none' : 'flex',
            flexDirection: 'column',
            transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Staggered nav links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '96px 24px 0' }}>
            {NAV_LINKS.map((link, i) => (
              <button
                key={link}
                type="button"
                onClick={() => setMenuOpen(false)}
                onMouseEnter={e => { const b = e.currentTarget; b.style.background = 'rgba(255,255,255,0.10)'; b.style.color = '#ffffff'; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.background = 'transparent'; b.style.color = 'rgba(255,255,255,0.8)'; }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 12,
                  padding: '14px 16px',
                  fontSize: 16,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.8)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: GEIST,
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateX(0)' : 'translateX(24px)',
                  transition: `opacity 300ms ease ${(i + 1) * 60}ms, transform 300ms ease ${(i + 1) * 60}ms`,
                }}
              >
                {link}
                {link === 'Reconcile' && <ChevronDown style={{ width: 16, height: 16 }} />}
              </button>
            ))}
          </div>

          {/* Bottom CTA — delayed fade+slide */}
          <div style={{
            marginTop: 'auto',
            padding: '0 24px 40px',
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 400ms ease 300ms, transform 400ms ease 300ms',
          }}>
            <button
              type="button"
              onClick={() => { setMenuOpen(false); onGetStarted(); }}
              onMouseEnter={() => setHovMobileCta(true)}
              onMouseLeave={() => setHovMobileCta(false)}
              style={{ ...ctaStyle(hovMobileCta), width: '100%', padding: '14px 0' }}
            >
              Start Free Audit
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* HERO CONTENT — mt-auto, bottom-anchored                          */}
        {/* ================================================================ */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          flexDirection: isLg ? 'row' : 'column',
          alignItems: isLg ? 'flex-end' : undefined,
          justifyContent: isLg ? 'space-between' : undefined,
          gap: 32,
          padding: isLg ? '0 48px 64px' : isMd ? '0 32px 48px' : '0 20px 32px',
        }}>

          {/* LEFT: Headline + Email CTA */}
          <div style={{ maxWidth: 576 }}>
            <h1 style={{
              fontFamily: GEIST,
              fontSize: isLg ? '3.5rem' : isMd ? '2.25rem' : '1.875rem',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: fg,
              margin: 0,
            }}>
              Stop losing 1–5% of revenue to billing errors
            </h1>

            {/* Email CTA form */}
            <form
              onSubmit={e => { e.preventDefault(); onGetStarted(); }}
              style={{ marginTop: isMd ? 32 : 24 }}
              noValidate
            >
              {isMd ? (
                /* sm+: white capsule */
                <div style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 9999, background: '#ffffff', padding: 6 }}>
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Type your email"
                    style={{ width: 256, background: 'transparent', border: 'none', outline: 'none', padding: '8px 16px', fontSize: 14, color: '#111827', fontFamily: GEIST }}
                  />
                  <button
                    type="submit"
                    onMouseEnter={() => setHovEmailCta(true)}
                    onMouseLeave={() => setHovEmailCta(false)}
                    style={{ ...ctaStyle(hovEmailCta), padding: '10px 24px', whiteSpace: 'nowrap' }}
                  >
                    Get started
                  </button>
                </div>
              ) : (
                /* mobile: stacked */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Type your email"
                    style={{ borderRadius: 9999, background: '#ffffff', border: 'none', outline: 'none', padding: '12px 20px', fontSize: 14, color: '#111827', fontFamily: GEIST }}
                  />
                  <button
                    type="submit"
                    onMouseEnter={() => setHovEmailCta(true)}
                    onMouseLeave={() => setHovEmailCta(false)}
                    style={{ ...ctaStyle(hovEmailCta), padding: '12px 24px' }}
                  >
                    Get started
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT: Two glass cards */}
          <div style={{
            display: 'flex',
            flexDirection: isMd ? 'row' : 'column',
            gap: isLg ? 20 : 16,
            width: isLg ? 'auto' : '100%',
          }}>

            {/* Stats card */}
            <div style={{ ...glass, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {/* Silkscreen stat */}
              <div style={{ fontFamily: SILKSCREEN, fontWeight: 'normal', fontSize: isMd ? '2.25rem' : '1.875rem', letterSpacing: '-0.025em', color: fg }}>
                $2.3M
              </div>
              <p style={{ fontFamily: GEIST, fontSize: 14, lineHeight: 1.6, color: fg70, margin: `${isMd ? 16 : 12}px 0 0` }}>
                Recovered in leaked revenue by SaaS finance teams in 2025.
              </p>
            </div>

            {/* Testimonial card */}
            <div style={glass}>
              {/* Company header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isMd ? 16 : 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: 4, background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: GEIST, fontSize: 11, fontWeight: 700, color: '#ffffff' }}>Y</span>
                </div>
                <span style={{ fontFamily: GEIST, fontSize: 14, fontWeight: 600, color: fg }}>Yojit FZE</span>
              </div>

              {/* Quote */}
              <p style={{ fontFamily: GEIST, fontSize: 14, lineHeight: 1.6, color: fg80, margin: 0 }}>
                "With Scout we went from manually chasing billing gaps to having AI reconcile everything nightly — and we recovered $15K in the first week."
              </p>

              {/* Avatar + name + role */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: isMd ? 20 : 16 }}>
                <img
                  src={AVATAR_URL}
                  alt="Ahmed Al-Mansoori"
                  style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', background: 'rgba(255,255,255,0.2)', flexShrink: 0 }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div>
                  <div style={{ fontFamily: GEIST, fontSize: 14, fontWeight: 600, color: fg }}>Ahmed Al-Mansoori</div>
                  <div style={{ fontFamily: GEIST, fontSize: 12, color: fg60 }}>Head of Finance</div>
                </div>
              </div>
            </div>

          </div>{/* end right glass cards */}
        </div>{/* end hero content */}
      </div>{/* end z-10 wrapper */}
    </section>
  );
};

export default LandingPageView;
