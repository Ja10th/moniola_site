'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import ReportSheet from '../../components/ReportSheet';
import { ResultData } from '../../components/types';

export default function ReportPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('result_data');
      if (!raw) {
        setError('No result data found. Please go back and check your result again.');
        return;
      }
      setResult(JSON.parse(raw));
    } catch {
      setError('Failed to load result data. Please try again.');
    }
  }, []);

  const handleBack = () => {
    sessionStorage.removeItem('result_data');
    router.push('/results');
  };

  if (error) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem',
            padding: '2rem',
            background: '#f0f3f8',
          }}
        >
          <div className="rc-error" style={{ maxWidth: 480, textAlign: 'center' }}>
            ⚠️ {error}
          </div>
          <button
            onClick={() => router.push('/results')}
            className="rc-btn"
            style={{ maxWidth: 200 }}
          >
            ← Back to Checker
          </button>
        </div>
      </>
    );
  }

  if (!result) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f0f3f8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4a6080' }}>
            <span className="rc-spinner" style={{ borderTopColor: '#0a1628', borderColor: '#dce4f0' }} />
            Loading report…
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ReportSheet result={result} onBack={handleBack} />
    </>
  );
}
