'use client';

import SiteShell from '../components/site-shell';

export default function AboutPage() {
  return (
    <SiteShell title="About Us" subtitle="A vibrant school community with strong values and modern systems.">
      <section className="hero-section hero-compact">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">About BrightBridge Academy</p>
            <h1>A school that blends excellence, technology, and heart.</h1>
            <p className="hero-copy">BrightBridge Academy is designed for learners who thrive in a structured, inspiring, and digitally connected environment.</p>
          </div>
          <div className="hero-card">
            <h3>What we stand for</h3>
            <ul>
              <li>Academic excellence with modern curricula</li>
              <li>Seamless parent and staff communication</li>
              <li>Responsive digital learning and result management</li>
            </ul>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
