'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type User = { id: string; full_name: string; email: string; role: string; school_name: string };
type Session = { session_id: string; session_name: string; term_id: string; term_name: string; term_number: number; results_published: boolean; is_current: boolean; term_current: boolean };
type Class = { id: string; name: string; level: string; section: string };
type Subject = { id: string; name: string; code: string; category: string };
type GradeRow = { id: string; admission_number: string; first_name: string; last_name: string; ca1: number; ca2: number; assignment: number; exam: number; total_score: number; grade: string; is_approved: boolean };

export default function TeacherPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const headers = useCallback(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    const t = localStorage.getItem('portal_token');
    const u = localStorage.getItem('portal_user');
    if (!t || !u) { router.replace('/login'); return; }
    setToken(t); setUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch('/api/results/sessions', { headers: headers() }).then(r => r.json()).then(d => d.success && setSessions(d.data));
    fetch('/api/results/classes', { headers: headers() }).then(r => r.json()).then(d => d.success && setClasses(d.data));
  }, [token]);

  useEffect(() => {
    if (!token || !selectedClass) { setSubjects([]); return; }
    fetch(`/api/results/classes/${selectedClass}/subjects`, { headers: headers() }).then(r => r.json()).then(d => d.success && setSubjects(d.data));
  }, [selectedClass, token]);

  const uniqueSessions = sessions.filter((s, i, arr) => arr.findIndex(x => x.session_id === s.session_id) === i);
  const termsForSession = sessions.filter(s => s.session_id === selectedSession);

  async function loadGrades() {
    if (!selectedClass || !selectedSubject || !selectedSession || !selectedTerm) return;
    setLoading(true);
    const r = await fetch(`/api/results/class-grades?class_id=${selectedClass}&subject_id=${selectedSubject}&session_id=${selectedSession}&term_id=${selectedTerm}`, { headers: headers() });
    const d = await r.json();
    if (d.success) setGrades(d.data.map((s: any) => ({
      ...s,
      ca1: parseFloat(s.ca1 || 0),
      ca2: parseFloat(s.ca2 || 0),
      assignment: parseFloat(s.assignment || 0),
      exam: parseFloat(s.exam || 0)
    })));
    setLoading(false);
  }

  function updateGrade(studentId: string, field: string, value: string) {
    setGrades(prev => prev.map(g => g.id === studentId ? { ...g, [field]: parseFloat(value) || 0 } : g));
  }

  function getTotal(g: GradeRow) {
    const ca1 = parseFloat(g.ca1 as any) || 0;
    const ca2 = parseFloat(g.ca2 as any) || 0;
    const assignment = parseFloat(g.assignment as any) || 0;
    const exam = parseFloat(g.exam as any) || 0;
    return +(ca1 + ca2 + assignment + exam).toFixed(1);
  }

  function getGradeBadge(total: number) {
    if (total >= 75) return { grade: 'A1', cls: 'badge badge-a1' };
    if (total >= 70) return { grade: 'B2', cls: 'badge badge-b' };
    if (total >= 65) return { grade: 'B3', cls: 'badge badge-b' };
    if (total >= 60) return { grade: 'C4', cls: 'badge badge-c' };
    if (total >= 55) return { grade: 'C5', cls: 'badge badge-c' };
    if (total >= 50) return { grade: 'C6', cls: 'badge badge-c' };
    if (total >= 45) return { grade: 'D7', cls: 'badge badge-d' };
    if (total >= 40) return { grade: 'E8', cls: 'badge badge-e' };
    return { grade: 'F9', cls: 'badge badge-f' };
  }

  async function saveGrades() {
    setSaving(true); setMessage({ text: '', type: '' });
    const payload = grades.map(g => ({
      student_id: g.id,
      ca1: parseFloat(g.ca1 as any) || 0,
      ca2: parseFloat(g.ca2 as any) || 0,
      assignment: parseFloat(g.assignment as any) || 0,
      exam: parseFloat(g.exam as any) || 0
    }));
    const r = await fetch('/api/results/upload', { method: 'POST', headers: headers(), body: JSON.stringify({ class_id: selectedClass, subject_id: selectedSubject, session_id: selectedSession, term_id: selectedTerm, grades: payload }) });
    const d = await r.json();
    setMessage({ text: d.message, type: d.success ? 'success' : 'error' });
    setSaving(false);
  }

  function logout() { localStorage.removeItem('portal_token'); localStorage.removeItem('portal_user'); router.replace('/login'); }

  if (!user) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '6px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>M</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)' }}>Moniola Laurels Educational School</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role === 'class_teacher' ? 'Class Teacher Portal' : 'Teacher Portal'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>{user.full_name}</strong></span>
            <button onClick={logout} className="btn btn-outline btn-sm">Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '1.75rem 1.25rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.2rem' }}>Grade Entry Gradebook</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Upload CA (40%) and Examination (60%) scores for your classes</p>
          </div>
          <a href="/admin" className="btn btn-outline btn-sm">Switch to Admin Portal</a>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: '1.25rem' }}>
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          </div>
        )}

        {/* Controls */}
        <div className="card" style={{ marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
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
              {termsForSession.map(t => <option key={t.term_id} value={t.term_id}>{t.term_name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Class</label>
            <select className="form-input" value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedSubject(''); setGrades([]); }}>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select className="form-input" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} disabled={!selectedClass}>
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <button onClick={loadGrades} className="btn btn-primary" disabled={loading || !selectedClass || !selectedSubject || !selectedSession || !selectedTerm}>Load Class</button>
        </div>

        {/* Grade Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
        ) : grades.length > 0 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                {subjects.find(s => s.id === selectedSubject)?.name} — {classes.find(c => c.id === selectedClass)?.name}
              </div>
              <button onClick={saveGrades} className="btn btn-primary btn-sm" disabled={saving}>
                {saving ? 'Saving...' : '💾 Save All Grades'}
              </button>
            </div>
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Adm. No.</th>
                    <th style={{ textAlign: 'center' }}>1st CA (15)</th>
                    <th style={{ textAlign: 'center' }}>2nd CA (15)</th>
                    <th style={{ textAlign: 'center' }}>Assgn (10)</th>
                    <th style={{ textAlign: 'center' }}>Exam (60)</th>
                    <th style={{ textAlign: 'center' }}>Total</th>
                    <th style={{ textAlign: 'center' }}>Grade</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g, i) => {
                    const total = getTotal(g);
                    const { grade, cls } = getGradeBadge(total);
                    return (
                      <tr key={g.id}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{g.last_name}, {g.first_name}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{g.admission_number}</td>
                        {(['ca1', 'ca2', 'assignment', 'exam'] as const).map((field) => {
                          const maxMap: Record<string, number> = { ca1: 15, ca2: 15, assignment: 10, exam: 60 };
                          return (
                            <td key={field} style={{ textAlign: 'center', padding: '0.4rem' }}>
                              <input type="number" min={0} max={maxMap[field]} step={0.5}
                                value={g[field] || 0}
                                onChange={e => updateGrade(g.id, field, e.target.value)}
                                style={{ width: '56px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-strong)', borderRadius: '4px', padding: '0.25rem 0.4rem', textAlign: 'center', fontSize: '0.875rem' }}
                              />
                            </td>
                          );
                        })}
                        <td style={{ textAlign: 'center', fontWeight: 800 }}>{total}</td>
                        <td style={{ textAlign: 'center' }}><span className={cls}>{grade}</span></td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${g.is_approved ? 'badge-a1' : 'badge-d'}`}>{g.is_approved ? 'Approved' : 'Pending'}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : selectedClass && selectedSubject ? (
          <div className="alert alert-info">Click "Load Class" to load student roster for grade entry.</div>
        ) : (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>Select Class & Subject</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Choose a session, term, class, and subject above to begin entering student marks.</p>
          </div>
        )}
      </div>
    </div>
  );
}
