'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';

export default function ResultsPage() {
  const router = useRouter();
  const [admNo, setAdmNo] = useState('');
  const [pin, setPin] = useState('');
  const [session, setSession] = useState('2024/2025');
  const [term, setTerm] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/results/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admission_number: admNo,
          pin_code: pin,
          session_name: session,
          term_number: term,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Result not found. Please check your details.');
        return;
      }
      // Store result in sessionStorage and navigate to report page
      sessionStorage.setItem('result_data', JSON.stringify(data.data));
      router.push('/results/report');
    } catch {
      setError('Network error. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: 'calc(100vh - 80px)',
          background: '#f0f3f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1.25rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: 560 }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              className="label-master"
              style={{ display: 'inline-block', marginBottom: '1rem' }}
            >
              <div className="label-small">Online Portal</div>
            </div>
            <h1
              style={{
                fontFamily: 'var(--_🔠-typography---font-family--h1, serif)',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 800,
                marginBottom: '0.5rem',
                color: '#0a1628',
              }}
            >
              Check Your Result
            </h1>
            <p style={{ color: '#4a6080', fontSize: '0.95rem' }}>
              Enter your details below to view your full report card.
            </p>
          </div>

          {/* Form card */}
          <div className="card-testimonial result-checker-card">
            <form onSubmit={handleSubmit}>
              <div className="rc-form-group">
                <label className="rc-label" htmlFor="rc-admNo">Admission Number</label>
                <input
                  id="rc-admNo"
                  className="rc-input"
                  type="text"
                  placeholder="e.g. MLES/2024/JSS1/001"
                  value={admNo}
                  onChange={e => setAdmNo(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>

              <div className="rc-row">
                <div className="rc-form-group">
                  <label className="rc-label" htmlFor="rc-session">Session</label>
                  <select
                    id="rc-session"
                    className="rc-input"
                    value={session}
                    onChange={e => setSession(e.target.value)}
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                    <option value="2022/2023">2022/2023</option>
                  </select>
                </div>
                <div className="rc-form-group">
                  <label className="rc-label" htmlFor="rc-term">Term</label>
                  <select
                    id="rc-term"
                    className="rc-input"
                    value={term}
                    onChange={e => setTerm(e.target.value)}
                  >
                    <option value="1">1st Term</option>
                    <option value="2">2nd Term</option>
                    <option value="3">3rd Term</option>
                  </select>
                </div>
              </div>

              <div className="rc-form-group">
                <label className="rc-label" htmlFor="rc-pin">Result Access PIN</label>
                <input
                  id="rc-pin"
                  className="rc-input"
                  type="text"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="rc-error" role="alert">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="rc-btn"
                disabled={loading}
                style={{ marginTop: '0.75rem' }}
              >
                {loading ? (
                  <>
                    <span className="rc-spinner" aria-hidden="true" />
                    Checking…
                  </>
                ) : (
                  'View Report Card →'
                )}
              </button>
            </form>
          </div>

          {/* Help text */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.8rem',
              color: '#7a90a8',
              marginTop: '1.25rem',
            }}
          >
            Need your PIN? Contact the school registrar.
          </p>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
