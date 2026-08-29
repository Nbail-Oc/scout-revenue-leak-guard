import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

interface LandingPageViewProps {
  onGetStarted: () => void;
}

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4';
const AVATAR_URL = 'https://i.pravatar.cc/72?img=12';
const NAV_LINKS = ['Features', 'Pricing', 'Docs', 'Contact'];

const ScoutLogo = () => (
  <svg className="nexum-logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ScoutCta = ({ onClick, children, className = '' }: { onClick: () => void; children: React.ReactNode; className?: string }) => (
  <button type="button" onClick={onClick} className={`nexum-cta ${className}`}>
    {children}
  </button>
);

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onGetStarted }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = 'Scout — Revenue Leakage Guard';
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onGetStarted();
  };

  return (
    <section className="nexum-hero">
      <video
        className="nexum-hero__video"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className="nexum-hero__content">
        <nav className="nexum-nav">
          <div className="nexum-brand"><ScoutLogo /><span>scout</span></div>
          <div className="nexum-nav__desktop">
            <div className="nexum-nav__links">
              {NAV_LINKS.map((link) => (
                <button key={link} type="button" className="nexum-nav__link">
                  {link}
                </button>
              ))}
            </div>
            <ScoutCta onClick={onGetStarted} className="nexum-nav__cta">Sign Up Free</ScoutCta>
          </div>
          <button type="button" className="nexum-menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <Menu className={menuOpen ? 'is-hidden' : ''} aria-hidden="true" />
            <X className={menuOpen ? '' : 'is-hidden'} aria-hidden="true" />
          </button>
        </nav>

        <div className={`nexum-menu-backdrop ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(false)} aria-hidden="true" />
        <aside className={`nexum-drawer ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
          <div className="nexum-drawer__links">
            {NAV_LINKS.map((link, index) => (
              <button key={link} type="button" className="nexum-drawer__link" style={{ '--nexum-delay': `${(index + 1) * 60}ms` } as React.CSSProperties} onClick={() => setMenuOpen(false)}>
                {link}
              </button>
            ))}
          </div>
          <ScoutCta onClick={() => { setMenuOpen(false); onGetStarted(); }} className="nexum-drawer__cta">Sign Up Free</ScoutCta>
        </aside>

        <main className="nexum-main">
          <div className="nexum-main__copy">
            <h1>Stop losing 1–5% of revenue to billing errors</h1>
            <form className="nexum-email-form" onSubmit={submit}>
              <input ref={emailInputRef} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Type your email" aria-label="Email address" />
              <button type="submit" className="nexum-cta">Sign Up Free</button>
            </form>
          </div>
          <div className="nexum-cards">
            <div className="nexum-card nexum-stat-card">
              <div className="nexum-stat-card__number">$2.3M</div>
              <p>Recovered in leaked revenue across 50+ SaaS companies in 2025.</p>
            </div>
            <div className="nexum-card nexum-testimonial-card">
              <div className="nexum-testimonial-card__header"><span className="nexum-testimonial-card__mark">D</span><span>Double</span></div>
              <p>"Scout caught $47K in expired discounts and unbilled features we'd been missing for months. Paid for itself in week one."</p>
              <div className="nexum-testimonial-card__footer">
                <img src={AVATAR_URL} alt="Finance Lead" />
                <div><strong>Priya Sharma</strong><span>Head of Finance</span></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default LandingPageView;
