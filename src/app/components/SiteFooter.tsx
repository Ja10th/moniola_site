import Link from 'next/link';
import { ArrowIcon } from './icons';

export default function SiteFooter() {
  return (
    <section className="footer">
      <div className="master-footer">

        {/* CTA video banner */}
        <div className="video-cta w-background-video w-background-video-atom">
          <video autoPlay loop muted playsInline>
            <source src="/videos/kindergarten.mp4" type="video/mp4" />
          </video>

          <div className="content-cta" style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="no-margins">Ready when the books are open</h2>
            <div className="button-wrap-cta">
              <a href="#results" className="cta-main w-inline-block">
                <div className="button-text-mask">
                  <div className="button-text">Check Results</div>
                </div>
                <div className="button-icon-wrap right">
                  <div className="icon-button w-embed"><ArrowIcon /></div>
                  <div className="icon-button w-embed"><ArrowIcon /></div>
                </div>
                <div className="button-bg" />
              </a>
              <Link href="/login" className="cta-main w-variant-1ff8d96e-78cc-eac8-de90-206ecdaded5f w-inline-block">
                <div className="button-text-mask">
                  <div className="button-text w-variant-1ff8d96e-78cc-eac8-de90-206ecdaded5f">Staff Portal</div>
                </div>
                <div className="button-bg w-variant-1ff8d96e-78cc-eac8-de90-206ecdaded5f" />
              </Link>
            </div>
          </div>

          <div className="overlay-cta" />
        </div>

        {/* Footer content */}
        <div className="content-footer">
          <div className="w-layout-grid footer-halves">
            <div className="footer-left">
              <div className="footer-top-tile">
                <div className="label-small tone-medium">contact</div>
                <div className="footer-left-text">
                  <div className="footer-text-tile">
                    <div>
                      Moniola Laurels Educational School<br />
                      12 Education Boulevard,<br />
                      Lagos State, Nigeria
                    </div>
                    <div className="text-small tone-medium">(Near the main government school)</div>
                  </div>
                  <div className="footer-text-tile">
                    <div className="tone-strong">
                      <a href="tel:+2348001234567" className="tone-strong">+234 800 123 4567</a>
                    </div>
                    <div className="text-small tone-medium">(Mon–Fri, 8am–4pm)</div>
                  </div>
                  <div className="footer-text-tile">
                    <div>
                      <a href="mailto:info@moniolalaurels.edu.ng" className="tone-strong">
                        info@moniolalaurels.edu.ng
                      </a>
                    </div>
                    <div className="text-small tone-medium">(We respond within 24 hours)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-right">
              <div className="footer-columns">
                <div className="footer-column">
                  <div className="label-small tone-medium">school</div>
                  <div className="footer-links-column">
                    <Link href="/about" className="footer-link">Our Philosophy</Link>
                    <Link href="/about" className="footer-link">Academic Programs</Link>
                    <Link href="/about" className="footer-link">School Calendar</Link>
                    <Link href="/contact" className="footer-link">Gallery</Link>
                  </div>
                </div>
                <div className="footer-column no-borders">
                  <div className="label-small tone-medium">for parents</div>
                  <div className="footer-links-column">
                    <a href="#results" className="footer-link">Check Results</a>
                    <Link href="/contact" className="footer-link">Enrollment</Link>
                    <Link href="/contact" className="footer-link">Contact Us</Link>
                    <Link href="/login" className="footer-link">Staff Login</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-layout-grid footer-halves">
            <div className="footer-brand-wrap">
              <Link href="/" className="brand-footer w-inline-block w--current">
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>Moniola Laurels Educational School</span>
              </Link>
              <div className="footer-legal-column">
                <Link href="/about" className="footer-legal-link">About</Link>
                <Link href="/contact" className="footer-legal-link">Contact</Link>
                <Link href="/login" className="footer-legal-link">Staff Login</Link>
              </div>
            </div>
            <div className="footer-bottom-right">
              <div className="text-small tone-medium">
                © {new Date().getFullYear()} Moniola Laurels Educational School. All rights reserved.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
