import Link from 'next/link';

export default function ResultCheckerSection() {
  return (
    <section className="section blog-carousel-section" id="results">
      <div className="w-layout-blockcontainer main-container w-container">

        <div className="headline-program-carousel">
          <div className="heading-program-carousel">
            <h2 className="no-margins">
              Check your child&apos;s result in seconds — from anywhere in Nigeria
            </h2>
          </div>
          <div className="button-wrap-program-carousel">
            <Link href="/results" className="cta-tertiary w-inline-block">
              <div>Check now</div>
            </Link>
          </div>
        </div>

        {/* Preview card — clicking goes to the dedicated results page */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
          <div
            className="card-testimonial result-checker-card"
            style={{ maxWidth: 560, width: '100%' }}
          >
            <h3 style={{ marginBottom: '0.25rem' }}>Online Result Checker</h3>
            <p style={{ fontSize: '0.875rem', color: '#737368', marginBottom: '1.75rem' }}>
              Enter your admission number and PIN to view the full report card — grades,
              psychomotor ratings, teacher remarks, and class position.
            </p>

            {/* Teaser fields — not interactive, just visual preview */}
            <div className="rc-form-group" style={{ pointerEvents: 'none', opacity: 0.6 }}>
              <div className="rc-label">Admission Number</div>
              <div className="rc-input" style={{ color: '#8a9db5' }}>e.g. MLES/2024/JSS1/001</div>
            </div>

            <div className="rc-row" style={{ pointerEvents: 'none', opacity: 0.6, marginBottom: '1rem' }}>
              <div>
                <div className="rc-label" style={{ marginBottom: '0.35rem' }}>Session</div>
                <div className="rc-input" style={{ color: '#8a9db5' }}>2024/2025</div>
              </div>
              <div>
                <div className="rc-label" style={{ marginBottom: '0.35rem' }}>Term</div>
                <div className="rc-input" style={{ color: '#8a9db5' }}>1st Term</div>
              </div>
            </div>

            <div className="rc-form-group" style={{ pointerEvents: 'none', opacity: 0.6 }}>
              <div className="rc-label">Result Access PIN</div>
              <div className="rc-input" style={{ color: '#8a9db5' }}>••••••••</div>
            </div>

            <Link
              href="/results"
              className="rc-btn"
              style={{ marginTop: '0.75rem', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
            >
              Check My Result →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
