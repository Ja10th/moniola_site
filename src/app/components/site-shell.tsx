import Link from 'next/link';
import type { ReactNode } from 'react';

type SiteShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

// Used by /about, /contact, /login, /admin, /teacher pages
export default function SiteShell({ children, title, subtitle }: SiteShellProps) {
  return (
    <>
      <div className="master-navigation">
        <div className="navbar w-nav" role="banner">
          <div className="nav-mobile-bg"></div>
          <div className="nav-container">
            <Link href="/" className="brand-nav w-nav-brand w--current">
              <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                BrightBridge Academy
              </span>
            </Link>
            <nav role="navigation" className="nav-menu w-nav-menu">
              <div className="nav-menu-inner">
                <Link href="/about" className="nav-link w-inline-block"><div>About</div></Link>
                <Link href="/contact" className="nav-link w-inline-block"><div>Contact</div></Link>
                <a href="/#results" className="nav-link w-inline-block"><div>Check Results</div></a>
              </div>
            </nav>
            <div className="nav-right">
              <Link href="/login" className="cta-small w-inline-block">
                <div className="button-text-mask button-2"><div className="button-text">Staff Portal</div></div>
                <div className="button-bg"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {title && (
        <div style={{ padding: '3rem 1.5rem 1.5rem', maxWidth: 1160, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', marginBottom: '0.5rem' }}>{title}</h1>
          {subtitle && <p style={{ color: '#737368', fontSize: '1rem' }}>{subtitle}</p>}
        </div>
      )}

      <main>{children}</main>

      <div className="content-footer">
        <div className="w-layout-grid footer-halves" style={{ maxWidth: 1160, margin: '0 auto', padding: '2rem 1.5rem' }}>
          <div className="footer-brand-wrap">
            <Link href="/" className="brand-footer w-inline-block">
              <span style={{ fontWeight: 800, color: '#fff' }}>BrightBridge Academy</span>
            </Link>
            <div className="footer-legal-column">
              <Link href="/about" className="footer-legal-link">About</Link>
              <Link href="/contact" className="footer-legal-link">Contact</Link>
              <Link href="/login" className="footer-legal-link">Staff Login</Link>
            </div>
          </div>
          <div className="footer-bottom-right">
            <div className="text-small tone-medium">
              © {new Date().getFullYear()} BrightBridge Academy
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
