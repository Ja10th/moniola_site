'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, MenuOpenIcon, MenuCloseIcon } from './icons';

interface DropdownItem { label: string; href: string; }
interface NavDropdown { label: string; items: DropdownItem[]; }
interface NavLink { label: string; href: string; }

const DROPDOWNS: NavDropdown[] = [
  {
    label: 'About',
    items: [
      { label: 'Our Philosophy', href: '/about' },
      { label: 'Academic Programs', href: '/about' },
      { label: 'School Calendar', href: '/about' },
    ],
  },
  {
    label: 'For Parents',
    items: [
      { label: 'Check Results', href: '/#results' },
      { label: 'Enrollment', href: '/contact' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

const NAV_LINKS: NavLink[] = [
  { label: 'Programs', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(prev => (prev === label ? null : label));
  };

  return (
    <div className="master-navigation">
      <div className="navbar w-nav" role="banner">
        <div className="nav-mobile-bg" />
        <div className="nav-container">

          {/* Brand */}
          <Link href="/" className="brand-nav w-nav-brand">
            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
              Moniola
            </span>
          </Link>

          {/* Desktop nav */}
          <nav role="navigation" className={`nav-menu w-nav-menu${mobileOpen ? ' mobile-open' : ''}`}>
            <div className="nav-menu-inner">

              {/* About dropdown */}
              {DROPDOWNS.map(dd => (
                <div
                  key={dd.label}
                  className="nav-dropdown w-dropdown"
                  onMouseEnter={() => setOpenDropdown(dd.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <div
                    className="nav-dropdown-toggle w-dropdown-toggle"
                    onClick={() => toggleDropdown(dd.label)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>{dd.label}</div>
                    <div className="icon-dropdown w-embed">
                      <ChevronDownIcon />
                    </div>
                    {/* mobile expand */}
                    <div
                      className="icon-mobile-drodown"
                      onClick={e => { e.stopPropagation(); toggleDropdown(dd.label); }}
                    >
                      <div className="mobile-dropdown-line" />
                      <div className={`mobile-dropdown-line absolute${openDropdown === dd.label ? ' rotated' : ''}`} />
                    </div>
                  </div>
                  <nav
                    className="nav-dropdown-list w-dropdown-list"
                    style={{ display: openDropdown === dd.label ? 'block' : '' }}
                  >
                    <div className="nav-inner-dropdown-list">
                      {dd.items.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="nav-dropdown-link"
                          onClick={() => { setOpenDropdown(null); setMobileOpen(false); }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>
              ))}

              {/* Flat links — interspersed between dropdowns */}
              <Link href="/about" className="nav-link w-inline-block" onClick={() => setMobileOpen(false)}>
                <div>Programs</div>
              </Link>
              <Link href="/contact" className="nav-link w-inline-block" onClick={() => setMobileOpen(false)}>
                <div>Contact</div>
              </Link>

            </div>
          </nav>

          {/* Right CTA + hamburger */}
          <div className="nav-right">
            <Link href="/login" className="cta-small w-inline-block">
              <div className="button-text-mask button-2">
                <div className="button-text">Staff Portal</div>
              </div>
              <div className="button-bg" />
            </Link>

            <button
              className="menu-button w-nav-button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(prev => !prev)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {mobileOpen ? (
                <div className="menu-button-inner close">
                  <div className="icon-nav-menu w-embed"><MenuCloseIcon /></div>
                </div>
              ) : (
                <div className="menu-button-inner open">
                  <div className="icon-nav-menu w-embed"><MenuOpenIcon /></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div style={{
            background: '#fff',
            borderTop: '1px solid #e8e5de',
            padding: '1rem 1.5rem 1.5rem',
          }}>
            {DROPDOWNS.map(dd => (
              <div key={dd.label} style={{ marginBottom: '0.5rem' }}>
                <button
                  onClick={() => toggleDropdown(dd.label)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none', border: 'none',
                    fontWeight: 600, fontSize: '0.95rem', padding: '0.6rem 0', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  {dd.label}
                  <span style={{ transform: openDropdown === dd.label ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-flex', width: 14, height: 14 }}>
                    <ChevronDownIcon />
                  </span>
                </button>
                {openDropdown === dd.label && (
                  <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {dd.items.map(item => (
                      <Link
                        key={item.label}
                        href={item.href}
                        style={{ fontSize: '0.875rem', color: '#737368', padding: '0.35rem 0' }}
                        onClick={() => { setMobileOpen(false); setOpenDropdown(null); }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {NAV_LINKS.map(l => (
              <Link
                key={l.label}
                href={l.href}
                style={{ display: 'block', fontWeight: 600, fontSize: '0.95rem', padding: '0.6rem 0', color: '#262626' }}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              style={{
                display: 'block', marginTop: '1rem', background: '#262626', color: '#fff',
                textAlign: 'center', padding: '0.75rem', borderRadius: 999, fontWeight: 600, fontSize: '0.9rem',
              }}
              onClick={() => setMobileOpen(false)}
            >
              Staff Portal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// School name constants — import from here to keep naming consistent
export const SCHOOL_SHORT = 'Moniola';
export const SCHOOL_FULL = 'Moniola Laurels Educational School';
