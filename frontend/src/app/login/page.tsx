'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('portal_token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('portal_user') || '{}');
      const isTeacherLikeRole = ['teacher', 'class_teacher'].includes(user.role);
      const isAdminLikeRole = ['admin', 'principal', 'vice_principal'].includes(user.role);
      if (isTeacherLikeRole) router.replace('/teacher');
      else if (isAdminLikeRole) router.replace('/admin');
      else router.replace('/teacher');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); return; }
      localStorage.setItem('portal_token', data.data.token);
      localStorage.setItem('portal_user', JSON.stringify(data.data.user));
      const isTeacherLikeRole = ['teacher', 'class_teacher'].includes(data.data.user.role);
      const isAdminLikeRole = ['admin', 'principal', 'vice_principal'].includes(data.data.user.role);
      if (isTeacherLikeRole) router.push('/teacher');
      else if (isAdminLikeRole) router.push('/admin');
      else router.push('/teacher');
    } catch { setError('Network error. Please check the server is running.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backgroundColor: 'var(--bg-body)' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '8px',
            backgroundColor: 'var(--primary)', color: 'white',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.75rem'
          }}>M</div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.2rem' }}>
            Moniola Laurels Educational School
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Staff & Administration Portal</p>
        </div>

        <div className="card" style={{ padding: '2rem', borderColor: 'var(--border-strong)' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input id="email" className="form-input" type="email" placeholder="e.g., admin@moniolalaurels.edu.ng"
                value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" className="form-input" type="password" placeholder="Enter your password"
                value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.25rem' }}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Signing In...</> : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Demo credentials:</strong><br />
            Admin: <code>admin@moniolalaurels.edu.ng</code> / <code>Admin@2024</code><br />
            Teacher: <code>c.nwosu@moniolalaurels.edu.ng</code> / <code>Teacher@2024</code>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Back to Result Checker</a>
        </div>
      </div>
    </div>
  );
}
