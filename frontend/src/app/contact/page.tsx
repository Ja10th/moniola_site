'use client';

import SiteShell from '../components/site-shell';

export default function ContactPage() {
  return (
    <SiteShell title="Contact" subtitle="Reach out to the school office.">
      <section className="hero-section hero-compact">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Contact BrightBridge Academy</p>
            <h1>We would love to hear from you.</h1>
            <p className="hero-copy">Reach us for admissions, parent support, or school updates.</p>
          </div>
          <div className="hero-card">
            <h3>Get in touch</h3>
            <p>Phone: +234 800 000 0000</p>
            <p>Email: info@brightbridgeacademy.edu.ng</p>
            <p>Address: 12 Brightbridge Road, Lagos, Nigeria</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
