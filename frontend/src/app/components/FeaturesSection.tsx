const CDN = 'https://cdn.prod.website-files.com/69088e9cbe595647126a3125';

const FEATURES = [
  {
    icon: `${CDN}/690d2a0bcec235b89e140337_Feature%20Icon.svg`,
    title: 'JSS & SSS',
    desc: 'Structured classes where every student is known by name.',
  },
  {
    icon: `${CDN}/690d2a0a687e7c5e80b92ae7_Feature%20Icon2.svg`,
    title: 'Online Results',
    desc: "Check your child's report card instantly, from anywhere.",
  },
  {
    icon: `${CDN}/690d2a0a33c5c2de1ba8e3ac_Feature%20Icon3.svg`,
    title: 'Staff Portal',
    desc: 'Teachers manage grades, approvals, and reports with ease.',
  },
  {
    icon: `${CDN}/690d2a0bb18c1d3eb351ecfc_Feature%20Icon4.svg`,
    title: 'Our Approach',
    desc: 'WAEC-aligned grading built on character and curiosity.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="section features-section">
      <div className="w-layout-blockcontainer main-container w-container">
        <div className="wrap-about-home">
          <div className="label-large">Built for results. Trusted by families.</div>
          <h2 className="text-h4 no-margins">
            A purposeful school community rooted in discipline, academic rigour, and a genuine
            care for every student — right here in Nigeria. Where learning is structured, and
            futures are built with intention.
          </h2>
        </div>

        <div className="w-layout-grid features-grid">
          {FEATURES.map(f => (
            <div className="feature-card" key={f.title}>
              <img
                src={f.icon}
                loading="lazy"
                alt={f.title}
                className="icon-feature-card"
              />
              <div className="text-wrap-feature-card">
                <div className="text-h6">{f.title}</div>
                <div className="tone-medium">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
