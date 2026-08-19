import { ResultData, gradeBadge, ordinal, PSYCHO_LABELS } from './types';

interface Props {
  result: ResultData;
  onBack: () => void;
}

export default function ReportSheet({ result, onBack }: Props) {
  return (
    <div style={{ background: '#faf8f3', minHeight: '100vh', padding: '2rem 1.25rem' }}>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>

        {/* Action bar */}
        <div
          className="no-print"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}
        >
          <button
            onClick={onBack}
            style={{
              background: '#262626', color: '#fff', border: 'none',
              borderRadius: 999, padding: '0.55rem 1.25rem',
              cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
            }}
          >
            ← Back
          </button>
          <button
            onClick={() => window.print()}
            style={{
              background: '#fae6b9', color: '#262626', border: 'none',
              borderRadius: 999, padding: '0.55rem 1.25rem',
              cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
            }}
          >
            🖨️ Print Report
          </button>
        </div>

        {/* Report card */}
        <div className="report-sheet">

          {/* Header */}
          <div className="report-sheet-header">
            <h1>Moniola Laurels Educational School</h1>
            <div className="motto">
              &ldquo;{result.school.motto || 'Knowledge, Discipline & Character'}&rdquo;
            </div>
            <div className="address">{result.school.address}</div>
            <span className="term-tag">
              {result.session.term_name} &middot; {result.session.name} Session
            </span>
          </div>

          {/* Body */}
          <div className="report-body">

            {/* Student info row */}
            <div className="student-info-row">
              <div>
                <div className="student-name">{result.student.full_name}</div>
                <div className="meta-grid">
                  {(
                    [
                      ['Admission No', result.student.admission_number],
                      ['Class', result.student.class_name],
                      ['Gender', result.student.gender],
                      [
                        'Class Position',
                        result.performance.position
                          ? `${ordinal(result.performance.position)} of ${result.performance.class_size}`
                          : 'N/A',
                      ],
                    ] as [string, string][]
                  ).map(([label, val]) => (
                    <div className="meta-item" key={label}>
                      <span>{label}</span>
                      <strong>{val}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div className="avg-box">
                <div className="avg-num">{result.performance.student_average}%</div>
                <div className="avg-label">Average</div>
              </div>
            </div>

            {/* Academic table */}
            <div className="section-label">Academic Performance</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th style={{ textAlign: 'center' }}>CA1 (15)</th>
                  <th style={{ textAlign: 'center' }}>CA2 (15)</th>
                  <th style={{ textAlign: 'center' }}>Assgn (10)</th>
                  <th style={{ textAlign: 'center' }}>Exam (60)</th>
                  <th style={{ textAlign: 'center' }}>Total (100)</th>
                  <th style={{ textAlign: 'center' }}>Grade</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {result.grades.map(g => (
                  <tr key={g.subject_name}>
                    <td style={{ fontWeight: 600 }}>{g.subject_name}</td>
                    <td style={{ textAlign: 'center' }}>{g.ca1}</td>
                    <td style={{ textAlign: 'center' }}>{g.ca2}</td>
                    <td style={{ textAlign: 'center' }}>{g.assignment}</td>
                    <td style={{ textAlign: 'center' }}>{g.exam}</td>
                    <td style={{ textAlign: 'center', fontWeight: 800 }}>
                      {parseFloat(g.total_score).toFixed(1)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={gradeBadge(g.grade)}>{g.grade}</span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#737368' }}>{g.grade_remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Psychomotor */}
            {result.psychomotor && (
              <>
                <div className="section-label">Behavioural &amp; Psychomotor Ratings</div>
                <div className="psycho-grid">
                  {Object.entries(PSYCHO_LABELS).map(([key, label]) => (
                    <div className="psycho-item" key={key}>
                      <span style={{ color: '#737368', fontSize: '0.78rem' }}>{label}</span>
                      <span className="psycho-val">
                        {result.psychomotor![key] ?? 0} / 5
                      </span>
                    </div>
                  ))}
                </div>

                <div className="remark-grid">
                  <div className="remark-box">
                    <div className="remark-box-label">Class Teacher&apos;s Remark</div>
                    <div className="remark-box-text">
                      &ldquo;{result.psychomotor.class_teacher_remark || 'Good performance.'}&rdquo;
                    </div>
                  </div>
                  <div className="remark-box">
                    <div className="remark-box-label">Principal&apos;s Remark</div>
                    <div className="remark-box-text">
                      &ldquo;{result.psychomotor.principal_remark || 'Keep up the good work.'}&rdquo;
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Signatures */}
            <div className="sig-row">
              <div>
                <div className="sig-line" />
                <div className="sig-label">Class Teacher&apos;s Signature</div>
              </div>
              <div>
                <div className="sig-line" />
                <div className="sig-label">{result.school.principal_name} — Principal</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
