'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type User = { id: string; full_name: string; email: string; role: string; school_name: string; school_id: string };
type Stats = { total_students: number; total_teachers: number; total_classes: number; pending_grades: number; approved_grades: number; pass_rate: number };
type Session = { session_id: string; session_name: string; is_current: boolean; term_id: string; term_name: string; term_number: number; term_current: boolean; results_published: boolean };
type Class = { id: string; name: string; level: string; section: string; form_teacher_name: string };
type Student = { id: string; admission_number: string; first_name: string; last_name: string; class_name: string; gender: string };
type PIN = { serial_number: string; pin_code: string; is_used: boolean; usage_count: number; max_uses: number; admission_number: string; first_name: string; last_name: string };

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'broadsheet' | 'pins' | 'students' | 'publish'>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [broadsheet, setBroadsheet] = useState<any>(null);
  const [pins, setPins] = useState<PIN[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const headers = useCallback(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    const t = localStorage.getItem('portal_token');
    const u = localStorage.getItem('portal_user');
    if (!t || !u) { router.replace('/login'); return; }
    const parsed = JSON.parse(u);
    if (!['admin', 'principal', 'vice_principal'].includes(parsed.role)) { router.replace('/teacher'); return; }
    setToken(t); setUser(parsed);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/stats', { headers: headers() }).then(r => r.json()).then(d => d.success && setStats(d.data));
    fetch('/api/results/sessions', { headers: headers() }).then(r => r.json()).then(d => { if (d.success) setSessions(d.data); });
    fetch('/api/results/classes', { headers: headers() }).then(r => r.json()).then(d => d.success && setClasses(d.data));
    fetch('/api/admin/students', { headers: headers() }).then(r => r.json()).then(d => d.success && setStudents(d.data));
  }, [token]);

  const uniqueSessions = sessions.filter((s, i, arr) => arr.findIndex(x => x.session_id === s.session_id) === i);
  const termsForSession = sessions.filter(s => s.session_id === selectedSession);

  async function loadBroadsheet() {
    if (!selectedClass || !selectedSession || !selectedTerm) return;
    setLoading(true);
    const r = await fetch(`/api/admin/broadsheet?class_id=${selectedClass}&session_id=${selectedSession}&term_id=${selectedTerm}`, { headers: headers() });
    const d = await r.json();
    if (d.success) setBroadsheet(d.data);
    setLoading(false);
  }

  async function loadPins() {
    if (!selectedClass || !selectedSession || !selectedTerm) return;
    setLoading(true);
    const r = await fetch(`/api/admin/pins?class_id=${selectedClass}&session_id=${selectedSession}&term_id=${selectedTerm}`, { headers: headers() });
    const d = await r.json();
    if (d.success) setPins(d.data);
    setLoading(false);
  }

  async function generatePins() {
    if (!selectedClass || !selectedSession || !selectedTerm) { setMessage({ text: 'Please select class, session and term', type: 'error' }); return; }
    setLoading(true);
    const r = await fetch('/api/admin/pins/generate', { method: 'POST', headers: headers(), body: JSON.stringify({ class_id: selectedClass, session_id: selectedSession, term_id: selectedTerm }) });
    const d = await r.json();
    setMessage({ text: d.message, type: d.success ? 'success' : 'error' });
    if (d.success) loadPins();
    setLoading(false);
  }

  async function approveGrades() {
    setLoading(true);
    const r = await fetch('/api/admin/grades/approve', { method: 'POST', headers: headers(), body: JSON.stringify({ class_id: selectedClass, session_id: selectedSession, term_id: selectedTerm }) });
    const d = await r.json();
    setMessage({ text: d.message, type: d.success ? 'success' : 'error' });
    if (d.success) { const rd = await (await fetch('/api/admin/stats', { headers: headers() })).json(); if (rd.success) setStats(rd.data); }
    setLoading(false);
  }

  async function publishResults() {
    if (!selectedTerm) { setMessage({ text: 'Please select a term to publish', type: 'error' }); return; }
    if (!confirm('Are you sure you want to publish results? Parents will be able to view results immediately.')) return;
    setLoading(true);
    const r = await fetch('/api/admin/results/publish', { method: 'POST', headers: headers(), body: JSON.stringify({ term_id: selectedTerm }) });
    const d = await r.json();
    setMessage({ text: d.message, type: d.success ? 'success' : 'error' });
    setLoading(false);
  }

  function logout() { localStorage.removeItem('portal_token'); localStorage.removeItem('portal_user'); router.replace('/login'); }

  if (!user) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner" /></div>;

  const tabs = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'broadsheet', label: '📋 Class Broadsheet' },
    { key: 'pins', label: '🎫 Result PINs' },
    { key: 'students', label: '👥 Student Roster' },
    { key: 'publish', label: '✅ Approve & Publish' },
  ] as const;

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '6px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>M</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)' }}>Moniola Laurels Educational School</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin Portal</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>{user.full_name}</strong>
              <span className="badge badge-b" style={{ marginLeft: '0.5rem' }}>{user.role.toUpperCase()}</span>
            </div>
            <button onClick={logout} className="btn btn-outline btn-sm">Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '1.75rem 1.25rem', flex: 1 }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={activeTab === t.key ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>
              {t.label}
            </button>
          ))}
        </div>

        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: '1.25rem' }}>
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          </div>
        )}

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>School Analytics Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Moniola Laurels Educational School overview</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
              {stats ? [
                { label: 'Total Students', value: stats.total_students },
                { label: 'Teaching Staff', value: stats.total_teachers },
                { label: 'Active Classes', value: stats.total_classes },
                { label: 'Pending Grades', value: stats.pending_grades },
                { label: 'Approved Grades', value: stats.approved_grades },
                { label: 'Overall Pass Rate', value: `${stats.pass_rate}%` },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: '1.1rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.label}</div>
                </div>
              )) : <div className="spinner" style={{ margin: '2rem auto' }} />}
            </div>
          </div>
        )}

        {/* Shared Selector Controls */}
        {activeTab !== 'dashboard' && activeTab !== 'students' && (
          <div className="card" style={{ marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label">Session</label>
              <select className="form-input" value={selectedSession} onChange={e => { setSelectedSession(e.target.value); setSelectedTerm(''); }}>
                <option value="">Select Session</option>
                {uniqueSessions.map(s => <option key={s.session_id} value={s.session_id}>{s.session_name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Term</label>
              <select className="form-input" value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)} disabled={!selectedSession}>
                <option value="">Select Term</option>
                {termsForSession.map(t => <option key={t.term_id} value={t.term_id}>{t.term_name} {t.results_published ? '✅' : ''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Class</label>
              <select className="form-input" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {activeTab === 'broadsheet' && <button onClick={loadBroadsheet} className="btn btn-primary" disabled={loading || !selectedClass || !selectedSession || !selectedTerm}>Load Broadsheet</button>}
            {activeTab === 'pins' && (
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={loadPins} className="btn btn-outline btn-sm" disabled={loading || !selectedClass}>View PINs</button>
                <button onClick={generatePins} className="btn btn-primary btn-sm" disabled={loading || !selectedClass}>Generate PINs</button>
              </div>
            )}
          </div>
        )}

        {/* Broadsheet Tab */}
        {activeTab === 'broadsheet' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)' }}>Class Master Broadsheet</h2>
              {selectedClass && selectedSession && selectedTerm && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={approveGrades} className="btn btn-primary btn-sm" disabled={loading}>Approve All Grades</button>
                  <button onClick={() => window.print()} className="btn btn-outline btn-sm">Print Broadsheet</button>
                </div>
              )}
            </div>
            {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
              : broadsheet ? (
                <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        {broadsheet.subjects.map((s: any) => <th key={s.id} style={{ textAlign: 'center' }}>{s.code}</th>)}
                        <th style={{ textAlign: 'center' }}>Total</th>
                        <th style={{ textAlign: 'center' }}>Avg (%)</th>
                        <th style={{ textAlign: 'center' }}>Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {broadsheet.students.map((s: any, i: number) => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 600 }}>{i + 1}</td>
                          <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{s.last_name}, {s.first_name}</td>
                          {broadsheet.subjects.map((sub: any, j: number) => {
                            const g = s.grades[j];
                            return <td key={sub.id} style={{ textAlign: 'center' }}>{g ? <span>{parseFloat(g.total_score).toFixed(0)} <small style={{ color: 'var(--text-muted)' }}>({g.grade})</small></span> : '-'}</td>;
                          })}
                          <td style={{ textAlign: 'center', fontWeight: 700 }}>{s.total_score.toFixed(0)}</td>
                          <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>{s.average}%</td>
                          <td style={{ textAlign: 'center', fontWeight: 800 }}>{s.position}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <div className="alert alert-info">Select Session, Term and Class, then click "Load Broadsheet"</div>}
          </div>
        )}

        {/* PINs Tab */}
        {activeTab === 'pins' && (
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.85rem' }}>Result Access PINs</h2>
            {pins.length > 0 ? (
              <div className="card" style={{ padding: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr><th>Serial No.</th><th>Student</th><th>Admission No.</th><th style={{ textAlign: 'center' }}>PIN Code</th><th style={{ textAlign: 'center' }}>Status</th></tr>
                  </thead>
                  <tbody>
                    {pins.map(p => (
                      <tr key={p.serial_number}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.serial_number}</td>
                        <td style={{ fontWeight: 600 }}>{p.last_name}, {p.first_name}</td>
                        <td>{p.admission_number}</td>
                        <td style={{ textAlign: 'center' }}><code style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary-dark)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700 }}>{p.pin_code}</code></td>
                        <td style={{ textAlign: 'center' }}><span className={`badge ${p.is_used ? 'badge-c' : 'badge-a1'}`}>{p.is_used ? 'Used' : 'Active'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="alert alert-info">Select class and click "View PINs" or "Generate PINs"</div>}
          </div>
        )}

        {/* Students Roster */}
        {activeTab === 'students' && (
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.85rem' }}>Student Roster ({students.length})</h2>
            <div className="card" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr><th>#</th><th>Student Name</th><th>Admission No.</th><th>Class</th><th>Gender</th></tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.id}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{s.last_name}, {s.first_name}</td>
                      <td><code>{s.admission_number}</code></td>
                      <td><span className="badge badge-b">{s.class_name}</span></td>
                      <td>{s.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Publish Tab */}
        {activeTab === 'publish' && (
          <div style={{ maxWidth: '560px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Approve & Publish Results</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Review teacher grade uploads and publish results for online parent access.</p>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.4rem' }}>1. Approve Grades for Class</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Approve scores uploaded by subject teachers for the selected class.</p>
                <button onClick={approveGrades} className="btn btn-primary btn-sm" disabled={loading || !selectedClass || !selectedSession || !selectedTerm}>Approve Grades</button>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.4rem' }}>2. Publish Term Results</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Make all approved term results accessible online for parents using scratch card PINs.</p>
                <button onClick={publishResults} className="btn btn-primary btn-sm" disabled={loading || !selectedTerm}>Publish Term Results</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
