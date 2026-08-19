const STATS = [
  { count: '1,200', suffix: '+', label: 'Active students enrolled' },
  { count: '48',    suffix: '',  label: 'Qualified teaching staff' },
  { count: '98',    suffix: '%', label: 'Result accuracy rate' },
  { count: '12',    suffix: '',  label: 'Years of academic excellence' },
];

export default function StatsSection() {
  return (
    <section className="section stats-section">
      <div className="video-stats w-background-video w-background-video-atom">
        <video autoPlay loop muted playsInline>
          <source src="/videos/classroom.mp4" type="video/mp4" />
        </video>

        <div className="w-layout-blockcontainer main-container w-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="master-stats">
            <div className="w-layout-grid stats-grid">
              {STATS.map(s => (
                <div className="stat-item" key={s.label}>
                  <div className="stat-count">
                    <h3 className="text-h2 no-margins">{s.count}</h3>
                    {s.suffix && <h3 className="text-h2 no-margins">{s.suffix}</h3>}
                  </div>
                  <div>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overlay-stats-bottom" />
      </div>
    </section>
  );
}
